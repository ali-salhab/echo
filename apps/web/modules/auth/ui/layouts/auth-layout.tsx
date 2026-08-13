export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="item-center flex justify-center">{children}</div>
}
