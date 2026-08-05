"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { ConvexProvider, ConvexReactClient } from "convex/react"
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
import { Provider } from "jotai"
if (!convexUrl) {
  throw new Error("Missing CONVEX_URL inside .env.local")
}
const convex = new ConvexReactClient(convexUrl!)

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <ConvexProvider client={convex}>
      <Provider>{children}</Provider>
    </ConvexProvider>
  )
}

export { ThemeProvider }
