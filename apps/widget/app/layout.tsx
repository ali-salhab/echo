import { Geist, Geist_Mono } from "next/font/google"
import { ConvexClientProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import "@workspace/ui/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
