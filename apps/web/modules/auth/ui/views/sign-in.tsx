import { SignIn } from "@clerk/nextjs"
import React from "react"

export const SignInPageView = () => {
  return <SignIn routing="hash" />
}

export default SignInPageView
