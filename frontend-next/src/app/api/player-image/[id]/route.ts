import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apiKey = process.env.SPORTAPI_KEY;
  if (!apiKey) {
    return new NextResponse(null, { status: 404 });
  }

  const res = await fetch(`https://sportapi7.p.rapidapi.com/api/v1/player/${id}/image`, {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "sportapi7.p.rapidapi.com",
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return new NextResponse(null, { status: 404 });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "image/webp",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
