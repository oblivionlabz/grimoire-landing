import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 60;

const GUMROAD_PRODUCT_ID = "BSq0p-ZLAmr3vtIo-bkSzQ==";
const CAP = 100;

type GumroadProduct = {
  sales_count?: number;
  published?: boolean;
  max_purchase_count?: number | null;
};

type CacheSlot = { at: number; body: { sold: number; cap: number; left: number; published: boolean } };
let cache: CacheSlot | null = null;
const CACHE_MS = 60_000;

async function fetchSold(): Promise<CacheSlot["body"]> {
  const key = process.env.GUMROAD_API_KEY;
  if (!key) {
    return { sold: 0, cap: CAP, left: CAP, published: false };
  }
  const url = `https://api.gumroad.com/v2/products/${encodeURIComponent(GUMROAD_PRODUCT_ID)}?access_token=${encodeURIComponent(key)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    return { sold: 0, cap: CAP, left: CAP, published: false };
  }
  const data = (await res.json()) as { success?: boolean; product?: GumroadProduct };
  const rawSold = Number(data.product?.sales_count ?? 0);
  const sold = Number.isFinite(rawSold) && rawSold >= 0 ? Math.floor(rawSold) : 0;
  const rawCap = Number(data.product?.max_purchase_count ?? CAP);
  const effectiveCap =
    Number.isFinite(rawCap) && rawCap > 0 ? Math.floor(rawCap) : CAP;
  const left = Math.max(effectiveCap - sold, 0);
  return {
    sold,
    cap: effectiveCap,
    left,
    published: Boolean(data.product?.published),
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
