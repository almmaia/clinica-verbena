import { useEffect, useLayoutEffect, useRef } from 'react'
import { dayMonth, dias, hm, quickSlots, weekday } from '../lib/agenda'
import { reduce } from '../lib/env'
import type { HeroTooth } from '../lib/heroTooth'
import { gsap } from '../lib/scroll'
import { SplitHeading } from './Words'

interface Props {
  go: boolean
  /** Toque num dos horários rápidos: pré-seleciona e leva ao formulário. */
  onQuick: (day: number, time: string) => void
}

/** Abertura: título, horários livres já no topo e o dente 3D. */
export function Hero({ go, onQuick }: Props) {
  const sec = useRef<HTMLElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const scene = useRef<HeroTooth | null>(null)
  const goRef = useRef(go)
  useEffect(() => { goRef.current = go }, [go])

  const startIntro = () => {
    if (reduce || !goRef.current || !scene.current) return
    gsap.to(scene.current.st, { intro: 1, duration: 2.4, ease: 'expo.out', delay: 0.2 })
  }

  // a cena 3D (three.js) é carregada à parte, para não atrasar o primeiro desenho da página
  useLayoutEffect(() => {
    let cancelled = false
    const words = sec.current!.querySelectorAll('h1 .i')
    if (!reduce) gsap.set(words, { yPercent: 118 })
    import('../lib/heroTooth')
      .then(({ createHeroTooth }) => {
        if (cancelled) return
        const s = createHeroTooth(cv.current!, sec.current!)
        if (!s) { document.documentElement.classList.add('no-webgl'); return }
        scene.current = s
        startIntro()
      })
      .catch(() => document.documentElement.classList.add('no-webgl'))
    return () => {
      cancelled = true
      scene.current?.dispose()
      scene.current = null
      gsap.set(words, { clearProps: 'transform' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!go || reduce) return
    startIntro()
    const ctx = gsap.context(() => {
      gsap.to('h1 .i', { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07, delay: 0.55 })
      gsap.from('.lede, .btns, .quick, .meta', { opacity: 0, y: 22, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.95 })
    }, sec)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go])

  return (
    <section className="hero" id="hero" data-h="light" ref={sec}>
      <div className="wrap hero-grid">
        <div>
          <SplitHeading as="h1" text="Cuidar do sorriso pode ser tranquilo." reveal={false} />
          <p className="lede">Consultas com hora marcada, plano de tratamento explicado por escrito e uma equipe que não tem pressa. Escolha um horário e confirme pelo WhatsApp.</p>
          <div className="btns">
            <a className="btn" href="#agendar" data-mag>Agendar avaliação</a>
            <a className="btn line" href="#tratamentos" data-mag>Ver tratamentos</a>
          </div>
          <div className="quick">
            <span className="q-t">Próximos horários livres</span>
            <div className="q-row">
              {quickSlots.map((q) => (
                <button key={q.day + q.time} type="button" onClick={() => onQuick(q.day, q.time)}>
                  {weekday(dias[q.day])} {dayMonth(dias[q.day])} · {hm(q.time)}
                </button>
              ))}
            </div>
          </div>
          <div className="meta"><span>Hora marcada de verdade</span><span>Plano por escrito</span><span>Atendimento sem pressa</span></div>
        </div>
        <div className="stage3d">
          <div className="arch" />
          <canvas id="heroCv" ref={cv} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
