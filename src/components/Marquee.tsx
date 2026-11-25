import { Fragment, useEffect, useRef } from 'react'
import { reduce } from '../lib/env'
import { getLenis, gsap } from '../lib/scroll'

const TERMS: { text: string; italic?: boolean }[] = [
  { text: 'Prevenção' },
  { text: 'Clareamento', italic: true },
  { text: 'Estética do sorriso' },
  { text: 'Alinhadores', italic: true },
  { text: 'Implantes' },
]

function TermSet() {
  return (
    <div className="set">
      {TERMS.map((t) => (
        <Fragment key={t.text}>
          {t.italic ? <i>{t.text}</i> : <span>{t.text}</span>}
          <b className="dot" />
        </Fragment>
      ))}
    </div>
  )
}

/** Faixa de tratamentos que corre sozinha e acelera (e inverte) com a rolagem. */
export function Marquee() {
  const row = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = row.current!
    const first = el.children[0] as HTMLElement
    let x = 0, dir = -1
    const tick = () => {
      const w = first.getBoundingClientRect().width
      if (!w) return
      const v = getLenis()?.velocity ?? 0
      if (v > 0.1) dir = -1
      else if (v < -0.1) dir = 1
      x += dir * 1.2 * (reduce ? 0.3 : 1) * (1 + Math.min(6, Math.abs(v) * 0.35))
      if (x <= -w) x += w
      if (x > 0) x -= w
      el.style.transform = `translate3d(${x}px,0,0)`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <div className="band" aria-hidden="true">
      <div className="row" ref={row}>
        <TermSet />
        <TermSet />
      </div>
    </div>
  )
}
