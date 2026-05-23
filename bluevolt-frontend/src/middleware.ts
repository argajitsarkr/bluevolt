import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdmin = !!(req.auth?.user as any)?.isAdmin;

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin?next=" + nextUrl.pathname, nextUrl));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }
  if ((nextUrl.pathname === "/checkout" || nextUrl.pathname === "/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin?next=" + nextUrl.pathname, nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard", "/checkout"],
};
