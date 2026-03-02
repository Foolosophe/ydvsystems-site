"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
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
import { Send, CheckCircle2, AlertCircle, Mail } from "lucide-react"
import { PROJECT_TYPES } from "@/lib/data"

type FormState = "idle" | "loading" | "success" | "error"

export function Contact() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  })

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
    <section id="contact" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Texte gauche */}
          <div>
            <Badge
              variant="secondary"
              className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 mb-4"
            >
              Contact
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Parlons de votre projet
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Mission freelance, atelier IA, démo YDV Systems, ou simple question
              — je réponds sous 24h.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-indigo-400" />
                </div>
                <a
                  href="mailto:contact@ydvsystems.com"
                  className="hover:text-white transition-colors text-sm"
                >
                  contact@ydvsystems.com
                </a>
              </div>
            </div>

            <div className="mt-10 p-5 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <p className="text-sm text-slate-400 leading-relaxed">
                <span className="text-white font-medium">Prenons 30 min</span> pour
                parler de votre projet. Je vous pose quelques questions pour bien
                comprendre votre besoin, et je vous propose une approche concrète.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 sm:p-8">
            {formState === "success" ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Message envoyé !</h3>
                <p className="text-slate-400">Je vous réponds sous 24h.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setFormState("idle")}
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formState === "error" && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>
                      Erreur d&apos;envoi. Contactez directement{" "}
                      <a
                        href="mailto:contact@ydvsystems.com"
                        className="underline"
                      >
                        contact@ydvsystems.com
                      </a>
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400" htmlFor="name">
                      Nom *
                    </label>
                    <Input
                      id="name"
                      placeholder="Votre nom"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400" htmlFor="email">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400">
                    Type de projet
                  </label>
                  <Select
                    value={form.projectType}
                    onValueChange={(v) => setForm({ ...form, projectType: v })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-indigo-500">
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {PROJECT_TYPES.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="text-slate-300 focus:bg-slate-700 focus:text-white"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400" htmlFor="message">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez votre projet, votre besoin, ou posez votre question..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={formState === "loading"}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2 disabled:opacity-70"
                >
                  {formState === "loading" ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
