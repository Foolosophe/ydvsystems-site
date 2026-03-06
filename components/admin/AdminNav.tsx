"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FileText, PenSquare, CalendarDays, BarChart3, Settings, LogOut, ArrowLeft } from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/articles/new", label: "Nouvel article", icon: PenSquare },
  { href: "/admin/calendar", label: "Calendrier", icon: CalendarDays },
  { href: "/admin/analytics", label: "Analytics IA", icon: BarChart3 },
  { href: "/admin/settings", label: "Reglages", icon: Settings },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth?action=logout", { method: "POST" })
    } catch {
      // Redirect même si le fetch échoue
    }
    router.push("/admin/login")
  }

  return (
    <nav className="w-64 min-h-screen bg-white border-r border-border flex flex-col font-(family-name:--font-outfit)">
      <div className="p-6 border-b border-border">
        <Link href="/fr" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft size={12} />
          Retour au site
        </Link>
        <h2 className="text-lg font-bold text-gradient">YdvSystems</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Administration</p>
      </div>

      <div className="flex-1 py-4 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                active
                  ? "text-primary bg-[--accent-subtle] font-medium shadow-sm"
                  : "text-secondary-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full rounded-lg hover:bg-red-50"
        >
          <LogOut size={18} />
          Deconnexion
        </button>
      </div>
    </nav>
  )
}
