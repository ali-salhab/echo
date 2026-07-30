"use client"
import { UserButton } from "@clerk/nextjs"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import AuthLayout from "../layouts/auth-layout"
import { SignInPageView } from "../views/sign-in"
import { SignUpPageView } from "../views/sign-up"
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-300 border-b-olive-700"></div>
        </AuthLayout>
      </AuthLoading>
      <Authenticated>
        <h1>authed</h1>
        <UserButton />
        <AuthLayout>{children}</AuthLayout>
      </Authenticated>
      <Unauthenticated>
        <h1>unauthenticated</h1>

        <AuthLayout>
          <SignInPageView />
        </AuthLayout>
      </Unauthenticated>
    </>
  )
}
