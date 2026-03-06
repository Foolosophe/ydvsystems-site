import AdminNav from "@/components/admin/AdminNav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-secondary text-foreground font-(family-name:--font-outfit)">
      <AdminNav />
      <main className="flex-1 p-8 max-w-6xl">{children}</main>
    </div>
  )
}
