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
          <div className="flex h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>{" "}
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
