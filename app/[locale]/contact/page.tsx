"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Send, CheckCircle2, AlertCircle, Mail, Code2, Monitor } from "lucide-react"
import { useTranslations } from "next-intl"
import { AnimateOnScroll } from "@/components/AnimateOnScroll"

type FormState = "idle" | "loading" | "success" | "error"

const PROJECT_TYPE_KEYS = [
  "dev",
  "ia-integration",
  "atelier-ia",
  "audit-ia",
  "automatisation",
  "demo-insertion",
  "demo-formation",
  "demo-autre",
  "autre",
] as const

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  })
  const t = useTranslations("contact")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setFormState("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setFormState("success")
        setForm({ name: "", email: "", projectType: "", message: "" })
      } else {
        setFormState("error")
      }
    } catch {
      setFormState("error")
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
        <div className="text-center mb-14">
          <p className="section-tag">{t("header.tag")}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("header.title")}
          </h1>
          <p className="text-secondary-foreground max-w-xl mx-auto text-lg">
            {t("header.description")}
          </p>
        </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <AnimateOnScroll>
            <Card className="bg-white border-border overflow-hidden shadow-(--shadow-card) group">
              <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": "#00bcd4" } as React.CSSProperties} />
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-(--accent-subtle) text-primary flex items-center justify-center shrink-0 solution-icon-box">
                  <Code2 size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("cards.freelanceTitle")}</h3>
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    {t("cards.freelanceDescription")}
                  </p>
                </div>
              </CardContent>
            </Card>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
            <Card className="bg-white border-border overflow-hidden shadow-(--shadow-card) group">
              <div className="h-1 w-full solution-brand-underline" style={{ "--solution-color": "#00bcd4" } as React.CSSProperties} />
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-(--accent-subtle) text-primary flex items-center justify-center shrink-0 solution-icon-box">
                  <Monitor size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("cards.demoTitle")}</h3>
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    {t("cards.demoDescription")}
                  </p>
                </div>
              </CardContent>
            </Card>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
            <div className="flex items-center gap-3 text-secondary-foreground">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Mail size={16} className="text-primary" />
              </div>
              <a
                href="mailto:contact@ydvsystems.com"
                className="hover:text-foreground transition-colors text-sm"
              >
                contact@ydvsystems.com
              </a>
            </div>

            <div className="p-5 bg-secondary border border-border rounded-xl">
              <p className="text-sm text-secondary-foreground leading-relaxed">
                <span className="text-foreground font-medium">{t("cards.meetingHighlight")}</span>
                {t("cards.meetingText")}
              </p>
            </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={200}>
          <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-(--shadow-card)">
            {formState === "success" ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-(--accent-subtle) flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t("success.title")}</h3>
                <p className="text-secondary-foreground">{t("success.description")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-border text-secondary-foreground hover:bg-secondary"
                  onClick={() => setFormState("idle")}
                >
                  {t("success.another")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formState === "error" && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>
                      {t("error.message")}{" "}
                      <a href="mailto:contact@ydvsystems.com" className="underline">
                        contact@ydvsystems.com
                      </a>
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-secondary-foreground" htmlFor="name">{t("form.nameLabel")}</label>
                    <Input
                      id="name"
                      placeholder={t("form.namePlaceholder")}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="bg-white border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-secondary-foreground" htmlFor="email">{t("form.emailLabel")}</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("form.emailPlaceholder")}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="bg-white border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-secondary-foreground">{t("form.projectTypeLabel")}</label>
                  <Select
                    value={form.projectType}
                    onValueChange={(v) => setForm({ ...form, projectType: v })}
                  >
                    <SelectTrigger className="bg-white border-border text-foreground focus:border-primary">
                      <SelectValue placeholder={t("form.projectTypePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {PROJECT_TYPE_KEYS.map((key) => (
                        <SelectItem
                          key={key}
                          value={key}
                          className="text-secondary-foreground focus:bg-secondary focus:text-foreground"
                        >
                          {t(`projectTypes.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-secondary-foreground" htmlFor="message">{t("form.messageLabel")}</label>
                  <Textarea
                    id="message"
                    placeholder={t("form.messagePlaceholder")}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="bg-white border-border text-foreground placeholder:text-muted-foreground focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={formState === "loading"}
                  className="w-full bg-primary hover:bg-(--accent-hover) text-foreground font-semibold gap-2 disabled:opacity-70"
                >
                  {formState === "loading" ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-foreground/30 border-t-foreground animate-spin" />
                      {t("form.sending")}
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {t("form.submit")}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  )
}
