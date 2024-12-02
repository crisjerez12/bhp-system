import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const PUBLIC_ROUTES = ["/"];
// const ADMIN_ROUTES = [
//   "/dashboard",
//   "/dashboard/reports",
//   "/dashboard/my-account",
//   "/dashboard/reports/pregnant",
//   "/dashboard/reports/household",
//   "/dashboard/reports/senior-citizen",
//   "/dashboard/reports/family-planning",
// ];
// const STAFF_ROUTES = [
//   "/dashboard/household",
//   "/dashboard/family-planning",
//   "/dashboard/pregnant",
//   "/dashboard/senior-citizen",
//   "/dashboard/my-account",
// ];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.includes(path);
  // const isAdminRoute = ADMIN_ROUTES.includes(path);
  // const isStaffRoute = STAFF_ROUTES.includes(path);

  // const session = await decrypt(req.cookies.get("session")?.value);

  // if (!session) {
  //   if (isAdminRoute || isStaffRoute) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  //   return NextResponse.next();
  // }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard/my-account", req.url));
  }

  // if (session.role === "staff" && !isStaffRoute) {
  //   return NextResponse.redirect(new URL("/dashboard/my-account", req.url));
  // }

  return NextResponse.next();
}

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
