import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
//  this function with every request reach to the server we check if the user is authenticatede or not
//
const isProtectedRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  // console.log("auth", auth)
  const currentPath = req.nextUrl.pathname
  if (!isProtectedRoute(req)) {
    // this will redirect the user to the sign-in page if they are not authenticated and trying to access a protected route
    await auth.protect()
  }
})

//  this config object  is used to tell the middleware which routes to run on and which routes to skip
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
