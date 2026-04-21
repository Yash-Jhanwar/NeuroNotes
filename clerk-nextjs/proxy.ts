import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Simple & stable matcher
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};