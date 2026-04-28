import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 60;

const GUMROAD_PRODUCT_ID = "BSq0p-ZLAmr3vtIo-bkSzQ==";
const STRIPE_AMOUNT_CENTS = 9900;
const CAP = 100;

type FoundingBody = {
  sold: number;
  cap: number;
  left: number;
  published: boolean;
  sources: { gumroad: number; stripe: number };
};

type GumroadProduct = {
  sales_count?: number;
  published?: boolean;
  max_purchase_count?: number | null;
};

type StripePI = { status: string; amount: number; currency: string };

type CacheSlot = { at: number; body: FoundingBody };
let cache: CacheSlot | null = null;
const CACHE_MS = 60_000;

async function fetchGumroad(): Promise<{ sold: number; cap: number; published: boolean }> {
  const key = process.env.GUMROAD_API_KEY;
  if (!key) return { sold: 0, cap: CAP, published: false };
  const url = `https://api.gumroad.com/v2/products/${encodeURIComponent(GUMROAD_PRODUCT_ID)}?access_token=${encodeURIComponent(key)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return { sold: 0, cap: CAP, published: false };
  const data = (await res.json()) as { product?: GumroadProduct };
  const rawSold = Number(data.product?.sales_count ?? 0);
  const sold = Number.isFinite(rawSold) && rawSold >= 0 ? Math.floor(rawSold) : 0;
  const rawCap = Number(data.product?.max_purchase_count ?? CAP);
  const effectiveCap = Number.isFinite(rawCap) && rawCap > 0 ? Math.floor(rawCap) : CAP;
  return { sold, cap: effectiveCap, published: Boolean(data.product?.published) };
}

async function fetchStripe(): Promise<number> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return 0;
  // Paginated count of $99 succeeded PIs. 100-cap product → one page suffices,
  // but we walk pages defensively so the badge stays accurate after the cap rises.
  let count = 0;
  let starting_after: string | undefined;
  for (let page = 0; page < 5; page++) {
    const params = new URLSearchParams({ limit: "100" });
    if (starting_after) params.set("starting_after", starting_after);
    const url = `https://api.stripe.com/v1/payment_intents?${params.toString()}`;
    const auth = Buffer.from(`${key}:`).toString("base64");
    const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
    if (!res.ok) return count;
    const data = (await res.json()) as { data?: StripePI[]; has_more?: boolean };
    const rows = data.data ?? [];
    count += rows.filter(
      (pi) => pi.status === "succeeded" && pi.amount === STRIPE_AMOUNT_CENTS && pi.currency === "usd",
    ).length;
    if (!data.has_more || rows.length === 0) break;
    starting_after = (rows[rows.length - 1] as { id?: string }).id;
    if (!starting_after) break;
  }
  return count;
}

async function fetchSold(): Promise<FoundingBody> {
  const [gum, stripe] = await Promise.all([fetchGumroad(), fetchStripe()]);
  const sold = gum.sold + stripe;
  const cap = gum.cap;
  return {
    sold,
    cap,
    left: Math.max(cap - sold, 0),
    published: gum.published || stripe > 0,
    sources: { gumroad: gum.sold, stripe },
  };
}

export async function GET() {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) {
    return NextResponse.json(cache.body, { headers: { "cache-control": "public, max-age=60" } });
  }
  const body = await fetchSold();
  cache = { at: now, body };
  return NextResponse.json(body, { headers: { "cache-control": "public, max-age=60" } });
}
