import { NextRequest, NextResponse } from "next/server";

const ADMIN_URL = process.env.AUTH_ADMIN_URL!;
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

  const loginRes = await fetch(`${ADMIN_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: username, password }),
  });

  if (!loginRes.ok) {
    const data = await loginRes.json().catch(() => null);
    const status = loginRes.status === 401 ? 401 : 502;
    return NextResponse.json(
      { error: data?.error || "Invalid credentials" },
      { status }
    );
  }

  const data = await loginRes.json();
  const session = data.session;

  if (!session) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const demos = session.allowedDemos;
  const hasAccess =
    demos === "all" || (Array.isArray(demos) && demos.includes("acr-model"));

  if (!hasAccess) {
    return NextResponse.json(
      { error: "You do not have access to this demo" },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    COOKIE_NAME,
    JSON.stringify({
      user: session.email,
      name: session.displayName || session.email,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  return response;
}
