"use client"

import { useRef, useEffect, useCallback } from "react"
import gsap from "gsap"

const BG_COLOR = "#060608"
const CYAN = "#00bcd4"
const WHITE = "#f0f2f5"
const PARTICLE_COUNT = 50
const FULL_NAME = "Yohann Dandeville"
const HIGHLIGHT_INDICES = [0, 7, 12]
const S_SCALE = 1.35

export default function TestLoadingPage() {
  const overlayRef           = useRef<HTMLDivElement>(null)
  const containerRef         = useRef<HTMLDivElement>(null)
  const nameContainerRef     = useRef<HTMLDivElement>(null)
  const particleContainerRef = useRef<HTMLDivElement>(null)
  const charRefs             = useRef<(HTMLSpanElement | null)[]>([])
  const stampFrameRef        = useRef<HTMLDivElement>(null)

  const logoContainerRef = useRef<HTMLDivElement>(null)
  const ydvTextRef       = useRef<HTMLSpanElement>(null)

  // Zone morphing
  // text8Ref  : "8" couché (−90°) → tourne → blur out pendant le morph
  // textS1Ref : 1er S — émerge du morph, part vers la gauche
  // textS2Ref : 2e S — émerge du morph, part vers la droite
  const morphWrapRef = useRef<HTMLDivElement>(null)
  const text8Ref     = useRef<HTMLSpanElement>(null)
  const textS1Ref    = useRef<HTMLSpanElement>(null)
  const textS2Ref    = useRef<HTMLSpanElement>(null)

  // Éléments de la suite (inactifs dans cette étape)
  const ystemWrapRef = useRef<HTMLSpanElement>(null)
  const ystemRefs    = useRef<(HTMLSpanElement | null)[]>([])
  const s2Ref        = useRef<HTMLSpanElement>(null)

  const masterTimeline = useRef<gsap.core.Timeline | null>(null)

  // ─── Particules ────────────────────────────────────────────────────────────
  function spawnParticles() {
    const c = particleContainerRef.current
    if (!c) return
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement("div")
      const size = gsap.utils.random(3, 8)
      el.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${CYAN};top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;opacity:0.9;`
      c.appendChild(el)
      const angle = gsap.utils.random(0, Math.PI * 2)
      const dist  = gsap.utils.random(50, 180)
      gsap.to(el, {
        x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
        opacity: 0, scale: gsap.utils.random(0.2, 0.8),
        duration: gsap.utils.random(0.5, 1.0), ease: "power2.out",
        onComplete: () => el.remove(),
      })
    }
  }

  // ─── Reset ─────────────────────────────────────────────────────────────────
  const resetAll = useCallback(() => {
    const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[]
    chars.forEach((el, i) => {
      gsap.set(el, { opacity: 0, x: 0, y: 0, scale: 1, color: WHITE, fontWeight: 200 })
      if (i === 7) el.textContent = "D"
    })
    if (nameContainerRef.current)
      gsap.set(nameContainerRef.current, { display: "block", opacity: 1, x: 0, y: 0 })
    if (stampFrameRef.current)
      gsap.set(stampFrameRef.current, { opacity: 0, scale: 1 })
    if (logoContainerRef.current)
      gsap.set(logoContainerRef.current, { opacity: 0 })
    if (ydvTextRef.current)
      gsap.set(ydvTextRef.current, { opacity: 0 })

    // "8" couché (−90°), morphWrap caché
    if (morphWrapRef.current) gsap.set(morphWrapRef.current, { opacity: 0, x: 0 })
    if (text8Ref.current) {
      text8Ref.current.style.filter    = "none"
      text8Ref.current.style.opacity   = "1"
      text8Ref.current.style.transform = "translate(-50%, -50%)"
      gsap.set(text8Ref.current, { rotation: 0, transformOrigin: "center center" })
    }
    if (textS1Ref.current) {
      textS1Ref.current.style.filter    = "blur(8px)"
      textS1Ref.current.style.opacity   = "0"
      textS1Ref.current.style.transform = "translate(-50%, -50%)"
    }
    if (textS2Ref.current) {
      textS2Ref.current.style.filter    = "blur(8px)"
      textS2Ref.current.style.opacity   = "0"
      textS2Ref.current.style.transform = "translate(-50%, -50%)"
    }

    // Suite (inactive dans cette étape)
    if (ystemWrapRef.current) gsap.set(ystemWrapRef.current, { width: 0 })
    ystemRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 0 }) })
    if (s2Ref.current)
      gsap.set(s2Ref.current, { opacity: 0, scale: S_SCALE, transformOrigin: "left center" })

    if (overlayRef.current)   gsap.set(overlayRef.current,  { opacity: 1 })
    if (containerRef.current) gsap.set(containerRef.current, { x: 0 })
  }, [])

  // ─── Animation principale ──────────────────────────────────────────────────
  const runAnimation = useCallback(() => {
    resetAll()

    const tl = gsap.timeline({
      onComplete: () => { setTimeout(() => runAnimation(), 2000) },
    })
    masterTimeline.current = tl

    const chars           = charRefs.current.filter(Boolean) as HTMLSpanElement[]
    const highlightEls    = HIGHLIGHT_INDICES.map(i => chars[i]).filter(Boolean)
    const nonHighlightEls = chars.filter((_, i) => !HIGHLIGHT_INDICES.includes(i))

    // ======== PHASE 1 : Le Tampon ========

    tl.to(chars, { opacity: 1, duration: 0.08, stagger: 0.085, ease: "power1.out" }, 0)
    tl.to(highlightEls, { color: CYAN, y: -12, fontWeight: 700, duration: 0.7, stagger: 0.15, ease: "power2.out" }, 1.6)
    tl.to(nonHighlightEls, { opacity: 0, y: 10, duration: 0.5, ease: "power2.in" }, 2.5)

    tl.add(() => {
      const nameContainer = nameContainerRef.current
      if (!nameContainer) return
      const containerRect = nameContainer.getBoundingClientRect()
      const centerX = containerRect.width / 2
      const letterWidths = HIGHLIGHT_INDICES.map(idx => chars[idx]?.getBoundingClientRect().width ?? 0)
      const gaps = [-3, 1]  // Y→d, d→V
      const totalWidth = letterWidths.reduce((a, b) => a + b, 0) + gaps.reduce((a, b) => a + b, 0)
      let currentX = centerX - totalWidth / 2
      HIGHLIGHT_INDICES.forEach((charIndex, posIndex) => {
        const el = chars[charIndex]
        if (!el) return
        const elRect = el.getBoundingClientRect()
        gsap.to(el, { x: currentX - (elRect.left - containerRect.left), y: 0, duration: 0.6, ease: "power2.inOut" })
        currentX += letterWidths[posIndex] + (gaps[posIndex] ?? 0)
      })
    }, 2.5)

    // Zoom : Y s'écarte à gauche, V à droite pour éviter le chevauchement
    tl.to(highlightEls[0], { scale: 2.0, y: -35, x: "-=42", duration: 0.6, ease: "power2.in" }, 3.2)
    tl.to(highlightEls[1], { scale: 2.0, y: -35,            duration: 0.6, ease: "power2.in" }, 3.2)
    tl.to(highlightEls[2], { scale: 2.0, y: -35, x: "+=42", duration: 0.6, ease: "power2.in" }, 3.2)
    // Drop : Y et V reviennent à leur position compactée
    tl.to(highlightEls[0], { y: 0, scale: 1.3, x: "+=42", duration: 0.2, ease: "power4.in" }, 3.8)
    tl.to(highlightEls[1], { y: 0, scale: 1.3,             duration: 0.2, ease: "power4.in" }, 3.8)
    tl.to(highlightEls[2], { y: 0, scale: 1.3, x: "-=42", duration: 0.2, ease: "power4.in" }, 3.8)
    tl.to(highlightEls, { scale: 1, duration: 0.15, ease: "back.out(3)" }, 4.0)
    // D→d à l'impact
    tl.add(() => { const d = chars[7]; if (d) d.textContent = "d" }, 4.0)
    tl.fromTo(stampFrameRef.current,
      { opacity: 0, scale: 1.2 },
      { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, 4.0)
    tl.to(containerRef.current, { x: 4, duration: 0.04, yoyo: true, repeat: 7, ease: "none" }, 4.0)
    tl.add(() => spawnParticles(), 4.0)

    // ======== TRANSITION : le "8" apparaît et propulse le tampon à sa place finale ========

    tl.set(logoContainerRef.current, { opacity: 1 }, 4.7)
    // Le 8 pop in avec un punch
    tl.fromTo(morphWrapRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.12, ease: "back.out(3)" }, 4.7)

    // ======== PHASE 2 : spin démarre immédiatement (c'est lui qui propulse) ========

    tl.to(text8Ref.current, {
      rotation: 1170,
      duration: 2.8,
      ease: "power2.out",
      transformOrigin: "center center",
    }, 4.7)

    // t=4.75s : choc — cadre explose, Ydv blanc, tampon propulsé vers sa place finale
    tl.add(() => {
      const morphEl = morphWrapRef.current
      const ydvEl   = ydvTextRef.current
      const nameEl  = nameContainerRef.current
      const frameEl = stampFrameRef.current
      if (!morphEl || !ydvEl || !nameEl || !frameEl) return

      // Centre visuel réel du tampon "Ydv" groupé
      const charY = charRefs.current[0]
      const charV = charRefs.current[12]
      if (!charY || !charV) return
      const stampCenterX = (charY.getBoundingClientRect().left + charV.getBoundingClientRect().right) / 2

      // Position FINALE de ydvTextRef = centre du logo complet déployé
      const ydvW = ydvEl.offsetWidth
      const s1W  = textS1Ref.current?.offsetWidth ?? 30
      const s2W  = s2Ref.current?.offsetWidth ?? 20
      let ystemW = 0
      const ystemEl = ystemWrapRef.current
      if (ystemEl) {
        const ystemLetters = ystemRefs.current.filter(Boolean)
        gsap.set(ystemLetters, { opacity: 1 })
        gsap.set(ystemEl, { width: "auto" })
        ystemW = ystemEl.offsetWidth
        gsap.set(ystemEl, { width: 0 })
        gsap.set(ystemLetters, { opacity: 0 })
      }
      const finalLogoW      = ydvW + s1W + ystemW + s2W
      const finalYdvCenterX = window.innerWidth / 2 - finalLogoW / 2 + ydvW / 2
      const dx              = finalYdvCenterX - stampCenterX

      // Cadre explose instantanément + Ydv vire au blanc
      gsap.set(frameEl, { opacity: 0 })
      gsap.to(highlightEls, { color: WHITE, duration: 0.1 })

      // Secousse
      gsap.to(containerRef.current, { x: -5, duration: 0.04, yoyo: true, repeat: 5, ease: "none" })
      spawnParticles()

      // Tampon atterrit à la position finale stable (8px de marge visuelle entre V et S)
      gsap.to(nameEl, { x: dx - 6, duration: 0.5, ease: "back.out(2)" })
    }, 4.75)

    // Pause sur le "8" vertical (6.4s)

    // ======== PHASE 3 : blur morph "8" → deux "S" qui s'écartent ========
    // Pendant p 0→1 :
    //   • "8" blur out
    //   • S1 et S2 blur in simultanément
    //   • S1 glisse vers la gauche, S2 vers la droite (séparation progressive)

    // ======== PHASE 3+4 : une seule animation pilotée par morphProgress ========
    // S1 reste centré, S2 part à droite, ystem s'ouvre — tout suit le même p

    tl.add(() => {
      // Mesure de ystem avant de démarrer
      const wrap = ystemWrapRef.current
      const letters = ystemRefs.current.filter(Boolean) as HTMLSpanElement[]
      let targetWidth = 0
      if (wrap) {
        gsap.set(letters, { opacity: 1 })
        gsap.set(wrap, { width: "auto" })
        targetWidth = wrap.offsetWidth
        gsap.set(wrap, { width: 0 })
        gsap.set(letters, { opacity: 0 })
      }

      const sWidth = textS1Ref.current?.offsetWidth ?? 30

      // Distance S2 → position finale de s2Ref (après expansion de ystem)
      const morphEl = morphWrapRef.current
      const s2El    = s2Ref.current
      let maxSepS2  = (textS1Ref.current?.offsetWidth ?? 30) * 1.3
      if (morphEl && s2El) {
        const morphCenterX   = morphEl.getBoundingClientRect().left + morphEl.getBoundingClientRect().width / 2
        const s2FinalCenterX = s2El.getBoundingClientRect().left + s2El.getBoundingClientRect().width / 2 + targetWidth
        maxSepS2 = s2FinalCenterX - morphCenterX
      }

      const morphProgress = { v: 0 }
      gsap.to(morphProgress, {
        v: 1,
        duration: 1.3,
        ease: "sine.inOut",
        onUpdate() {
          const p = morphProgress.v
          const t8 = text8Ref.current
          const s1 = textS1Ref.current
          const s2 = textS2Ref.current
          if (!t8 || !s1 || !s2) return

          // "8" disparaît
          const blur8 = Math.min(8 / (1.001 - p) - 8, 100)
          t8.style.filter  = `blur(${blur8}px)`
          t8.style.opacity = String(Math.pow(1 - p, 0.4))

          // S1 émerge et reste visible, centré
          const blurS = Math.min(8 / (p + 0.001) - 8, 100)
          s1.style.filter    = `blur(${blurS}px)`
          s1.style.opacity   = String(Math.pow(p, 0.4))
          s1.style.transform = `translate(-50%, -50%)`

          // S2 : phase A (0→0.4) → blur in + légère séparation (pleine taille)
          //      phase B (0.4→1) → continue vers s2Ref + rétrécit
          s2.style.filter  = `blur(${blurS}px)`
          s2.style.opacity = String(Math.pow(p, 0.4))

          let s2Sep: number
          let s2Scale: number
          if (p <= 0.4) {
            // Phase A : S2 s'écarte d'une largeur de S1 pour rendre le split visible
            s2Sep   = (p / 0.4) * sWidth
            s2Scale = 1
          } else {
            // Phase B : S2 voyage vers sa destination + rétrécit vers taille lowercase
            const bP  = (p - 0.4) / 0.6
            s2Sep   = sWidth + bP * (maxSepS2 - sWidth)
            s2Scale = 1 - bP * (1 - 1 / S_SCALE)
          }
          s2.style.transform = `translate(calc(-50% + ${s2Sep}px), -50%) scale(${s2Scale})`

          // ystem s'écrit pendant la phase B seulement
          if (wrap) {
            const bP = Math.max(0, (p - 0.4) / 0.6)
            wrap.style.width = `${targetWidth * bP}px`
            letters.forEach((letter, i) => {
              const step  = 0.6 / letters.length
              const start = 0.4 + i * step
              const lp    = Math.max(0, Math.min(1, (p - start) / step))
              letter.style.opacity = String(Math.pow(lp, 0.4))
            })
          }

        },
        onComplete() {
          const charW = textS1Ref.current?.offsetWidth ?? 30
          gsap.set(morphWrapRef.current, { width: charW })
          if (textS1Ref.current) textS1Ref.current.style.transform = "translate(-50%, -50%)"
          if (textS2Ref.current) textS2Ref.current.style.opacity   = "0"
          gsap.set(s2Ref.current, { opacity: 1, scale: 1 })
          // nameContainerRef reste visible (Ydv déjà à sa place finale)
          // ydvTextRef reste opacity:0 (spacer flex uniquement)
        },
      })
    }, 6.5)

    // logo complet "YdvSystems" — pause — fade-out
    tl.to(overlayRef.current, { opacity: 0, duration: 0.6, ease: "power2.in" }, 9.4)

  }, [resetAll])

  useEffect(() => {
    const start = async () => {
      await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 500))])
      runAnimation()
    }
    start()
    return () => { masterTimeline.current?.kill() }
  }, [runAnimation])

  // ─── JSX ───────────────────────────────────────────────────────────────────
  const gradientText: React.CSSProperties = {
    display: "inline-block",
    background: `linear-gradient(90deg, ${CYAN}, #4dd0e1)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }

  // Spans du morphing : centrés en absolu dans morphWrapRef
  const morphCharStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: CYAN,
    fontFamily: "var(--font-outfit)",
    fontWeight: 700,
    lineHeight: 1,
    userSelect: "none",
    pointerEvents: "none",
  }

  return (
    <div
      ref={overlayRef}
      role="presentation"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: BG_COLOR,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-outfit), sans-serif",
      }}
    >
      {/* Filtre SVG "gooey" : seuille les pixels semi-transparents issus du blur */}
      <svg style={{ position: "fixed", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <defs>
          <filter id="morph-threshold" x="-10%" y="-50%" width="420%" height="200%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        ref={containerRef}
        style={{
          position: "relative", width: "100%", maxWidth: "700px", padding: "0 1rem",
          display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80px",
        }}
      >
        {/* Phase 1 */}
        <div
          ref={nameContainerRef}
          style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)", whiteSpace: "nowrap", position: "absolute" }}
        >
          {FULL_NAME.split("").map((char, i) => (
            <span
              key={i}
              ref={el => { charRefs.current[i] = el }}
              style={{ display: "inline-block", opacity: 0, fontWeight: 200, color: WHITE }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        <div
          ref={stampFrameRef}
          style={{
            opacity: 0, position: "absolute",
            width: "clamp(80px, 14vw, 120px)", height: "clamp(40px, 7vw, 52px)",
            border: `2.5px solid ${CYAN}`, borderRadius: "5px",
            boxShadow: `inset 0 0 0 3px ${BG_COLOR}, inset 0 0 0 4px ${CYAN}44`,
            pointerEvents: "none",
          }}
        />

        {/* Phase 2 */}
        <div
          ref={logoContainerRef}
          style={{
            opacity: 0, position: "absolute",
            left: "50%", top: "50%", transform: "translate(-50%, -50%)",
            display: "flex", alignItems: "center",
            whiteSpace: "nowrap",
            fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 700,
          }}
        >
          <span ref={ydvTextRef} style={{ color: WHITE, opacity: 0, flexShrink: 0 }}>Ydv</span>

          {/* Zone morphing : "8" couché → spins → blur morph → deux "S" écartés
              overflow:visible permet aux S de déborder lors de l'écartement
              filter gooey appliqué ici pour l'effet liquide du morph */}
          <div
            ref={morphWrapRef}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "0.85em",
              height: "1em",
              flexShrink: 0,
              opacity: 0,
              overflow: "visible",
              filter: "url(#morph-threshold) blur(0.6px)",
            }}
          >
            {/* Figure-8 symétrique : deux cercles identiques, pas le "8" typographique
                La rotation GSAP s'applique à la span entière.
                stroke="currentColor" hérite color:CYAN du morphCharStyle. */}
            <span ref={text8Ref} style={morphCharStyle}>
              {/* SVG paysage (∞ horizontal) à 0° → tourne à 90° → figure-8 vertical */}
              <svg
                viewBox="0 0 48 26"
                style={{ width: "0.85em", height: "0.6em", display: "block" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
              >
                <circle cx="13" cy="13" r="10" />
                <circle cx="35" cy="13" r="10" />
              </svg>
            </span>

            {/* S1 : 1er S, émerge à gauche pendant le morph */}
            <span ref={textS1Ref} style={{ ...morphCharStyle, opacity: 0 }}>S</span>

            {/* S2 : 2e S, émerge à droite pendant le morph */}
            <span ref={textS2Ref} style={{ ...morphCharStyle, opacity: 0 }}>S</span>
          </div>

          {/* Éléments de la suite — inactifs dans cette étape */}
          <span
            ref={ystemWrapRef}
            style={{ display: "inline-flex", alignItems: "center", overflow: "hidden", width: 0, flexShrink: 0 }}
          >
            {"ystem".split("").map((char, i) => (
              <span key={char + i} ref={el => { ystemRefs.current[i] = el }}
                style={{ ...gradientText, opacity: 0 }}>{char}</span>
            ))}
          </span>
          <span ref={s2Ref} style={{ ...gradientText, opacity: 0, flexShrink: 0 }}>s</span>
        </div>

        <div
          ref={particleContainerRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
        />
      </div>
    </div>
  )
}
