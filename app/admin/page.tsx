import { prisma } from "@/lib/db"
import Link from "next/link"
import { PenSquare, FileText, Eye, Send, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [totalArticles, publishedArticles, draftArticles, totalViews, recentArticles] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.article.aggregate({ _sum: { viewCount: true } }),
      prisma.article.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, status: true, updatedAt: true },
      }),
    ])

  const stats = [
    { label: "Articles", value: totalArticles, icon: FileText, color: "text-primary" },
    { label: "Publies", value: publishedArticles, icon: Send, color: "text-green-600" },
    { label: "Brouillons", value: draftArticles, icon: Clock, color: "text-amber-500" },
    { label: "Vues totales", value: totalViews._sum.viewCount ?? 0, icon: Eye, color: "text-blue-500" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Vue d&apos;ensemble de votre blog</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-(--accent-hover) transition-colors shadow-sm btn-glow"
        >
          <PenSquare size={16} />
          Nouvel article
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-border p-5 shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon size={18} className={color} />
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border shadow-(--shadow-card)">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Articles recents</h2>
        </div>
        <div className="divide-y divide-border">
          {recentArticles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-secondary transition-colors"
            >
              <span className="text-sm font-medium text-foreground">{article.title}</span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    article.status === "PUBLISHED"
                      ? "bg-green-50 text-green-700"
                      : article.status === "DRAFT"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {article.status === "PUBLISHED"
                    ? "Publie"
                    : article.status === "DRAFT"
                      ? "Brouillon"
                      : "Archive"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
