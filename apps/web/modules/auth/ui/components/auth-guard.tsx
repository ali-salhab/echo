"use client"
import { UserButton } from "@clerk/nextjs"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import AuthLayout from "../layouts/auth-layout"
import { SignInPageView } from "../views/sign-in"

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-transparent" />
          </div>{" "}
        </AuthLayout>
      </AuthLoading>
      <Authenticated>
        <AuthLayout>{children}</AuthLayout>
        <UserButton />
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
