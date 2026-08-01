"use client"
import { SignUp } from "@clerk/nextjs"

export const SignUpPageView = () => {
  return <SignUp routing="hash" />
}

export default SignUpPageView
