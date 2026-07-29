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
        <AuthLayout>{children}=</AuthLayout>
      </Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInPageView />
        </AuthLayout>
      </Unauthenticated>
    </>
  )
}
