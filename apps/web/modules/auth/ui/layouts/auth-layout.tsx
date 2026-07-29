export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1>auth layout</h1>
      {children}
    </div>
  )
}
