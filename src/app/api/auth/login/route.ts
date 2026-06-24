import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "acr_session";

export async function POST(req: NextRequest) {
  const { username, password } = (await req.json()) as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const adminUrl = process.env.AUTH_ADMIN_URL;
  const apiKey = process.env.AUTH_API_KEY;

  if (!adminUrl || !apiKey) {
    console.error("Missing AUTH_ADMIN_URL or AUTH_API_KEY env vars");
    return NextResponse.json({ error: "Auth service not configured" }, { status: 500 });
  }

  const verifyRes = await fetch(`${adminUrl}/api/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "x-app-name": "acr-dynamic-model",
    },
    body: JSON.stringify({ username, password, demo: "acr-model" }),
  });

  if (!verifyRes.ok) {
    return NextResponse.json({ error: "Auth service error" }, { status: 502 });
  }

  const data = await verifyRes.json();

  if (!data.authorized || !data.hasAccess) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, JSON.stringify({
    user: data.user.email,
    name: [data.user.firstName, data.user.lastName].filter(Boolean).join(" "),
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
