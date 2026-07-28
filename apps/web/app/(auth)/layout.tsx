export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="mb-8 w-full min-w-0 bg-amber-200 py-7 text-center">
        <h1>Welcome to auth Group</h1>
      </div>
      {children}
    </div>
  )
}
