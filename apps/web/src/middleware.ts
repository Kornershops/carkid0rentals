import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // In a real app, you would check for an actual auth token/session cookie here.
  // For demonstration, we'll check a mock cookie or just let the user through based on path.
  const hasAuthToken = request.cookies.has("carkid0_auth");
  const isKycVerified = request.cookies.has("carkid0_kyc");

  const path = request.nextUrl.pathname;

  // Protect /dashboard routes
  if (path.startsWith("/dashboard")) {
    if (!hasAuthToken) {
      // Not logged in -> Redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (!isKycVerified) {
      // Logged in but no KYC -> Redirect to KYC
      return NextResponse.redirect(new URL("/auth/kyc", request.url));
    }
  }

  // If trying to access /auth/login while already authenticated
  if (path === "/auth/login" && hasAuthToken) {
    if (!isKycVerified) {
      return NextResponse.redirect(new URL("/auth/kyc", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
