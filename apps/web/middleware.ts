import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
//  this function with every request reach to the server we check if the user is authenticatede or not
//
const isProtectedRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])
const isOrgFreeRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/org-selection(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  // console.log("middleware/////////-----------------req url--------->")
  // console.log(req.url)
  // console.log("middleware/////////-----------------req next url--------->")

  // console.log("req.nextUrl.pathname", req.nextUrl.pathname)
  const { userId, orgId } = await auth()
  // console.log("userId", userId, "orgId", orgId)
  // console.log("isOrgFreeRoute(req)", isOrgFreeRoute(req))

  // console.log("auth", auth)
  const currentPath = req.nextUrl.pathname
  if (!isProtectedRoute(req)) {
    // this will redirect the user to the sign-in page if they are not authenticated and trying to access a protected route
    await auth.protect()
  }
  if (userId && !orgId && !isOrgFreeRoute(req)) {
    console.log("the condition true ----?")
    const searchParams = new URLSearchParams(req.nextUrl.search)
    console.log(searchParams, "searvch params s")
    const orgSelection = new URL(
      `/org-selection?${searchParams.toString()}`,
      req.url
    )
    return NextResponse.redirect(orgSelection)
  } else {
    console.log(
      "conditon false  : meaning that the user has login but dont have an org id and tree to acces to location and in this location we need the user to have org"
    )
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
