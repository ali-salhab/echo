import { Geist, Geist_Mono } from "next/font/google"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { ConvexClientProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
