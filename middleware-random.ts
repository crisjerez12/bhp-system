// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "./lib/session";

// const publicRoutes = ["/"];
// const adminRoutes = [
//   "/dashboard",
//   "/dashboard/reports",
//   "/dashboard/my-account",
//   "/dashboard/reports/pregnant",
//   "/dashboard/reports/household",
//   "/dashboard/reports/senior-citizen",
//   "/dashboard/reports/family-planning",
// ];
// const staffRoutes = [
//   "/dashboard/senior-citizen",
//   "/dashboard/household",
//   "/dashboard/my-account",
//   "/dashboard/pregnant",
//   "/dashboard/my-account",
// ];
// export default async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;
//   const isStaff = staffRoutes.includes(path);
//   const isAdmin = adminRoutes.includes(path);

//   const cookie = cookies().get("session")?.value;
//   const session = await decrypt(cookie);

//   //   if (isProtectedRoute && !session?.userId) {
//   //     return NextResponse.redirect(new URL("/login", req.nextUrl));
//   //   }

//   //   if (isPublicRoute && session?.userId) {
//   //     return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
//   //   }

//   return NextResponse.next();
// }
