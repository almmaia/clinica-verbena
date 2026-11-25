import { useLayoutEffect, useRef, useState } from 'react'
import { reduce } from '../lib/env'
import { jumpToShade, shadePin } from '../lib/shadePin'
import type { ShadeGL } from '../lib/shade3d'
import { SHADES } from '../lib/shades'
import { gsap, ScrollTrigger } from '../lib/scroll'

/** Seção fixa na tela: a rolagem percorre a escala de cor e o dente 3D muda de tom. */
export function ShadeScale() {
  const sec = useRef<HTMLElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const gl = useRef<ShadeGL | null>(null)
  const run = useRef({ p: 0, target: 0, last: -1, live: false, idx: -1 })
  const [idx, setIdx] = useState(0)

  // dente 3D (three.js carregado à parte)
  useLayoutEffect(() => {
    let cancelled = false
    import('../lib/shade3d').then(({ createShadeGL }) => {
      if (cancelled) return
      gl.current = createShadeGL(cv.current!)
      if (!gl.current && cv.current) cv.current.style.display = 'none'
    })
    return () => {
      cancelled = true
      gl.current?.dispose()
      gl.current = null
    }
  }, [])

  // seção fixa + laço de animação
  useLayoutEffect(() => {
    const r = run.current
    const pin = ScrollTrigger.create({
      trigger: sec.current, start: 'top top', end: '+=240%', pin: true, anticipatePin: 1,
      onUpdate: (s) => { r.target = s.progress },
      onToggle: (s) => { r.live = s.isActive },
    })
    const vis = ScrollTrigger.create({
      trigger: sec.current, start: 'top bottom', end: 'bottom top',
      onToggle: (s) => { r.live = s.isActive },
    })
    shadePin.st = pin
    const tick = () => {
      if (!r.live) return
      r.p += (r.target - r.p) * (reduce ? 1 : 0.14)
      if (Math.abs(r.target - r.p) < 0.0005) r.p = r.target
      const k = Math.round(r.p * (SHADES.length - 1))
      if (k !== r.idx) { r.idx = k; setIdx(k) }
      const dirty = gl.current?.consumeDirty() ?? false
      if (Math.abs(r.p - r.last) < 1e-5 && !dirty) return
      r.last = r.p
      gl.current?.render(r.p)
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      pin.kill()
      vis.kill()
      shadePin.st = null
    }
  }, [])

  return (
    <section className="shade" id="escala" data-h="dark" aria-label="Escala de cor dos dentes" ref={sec}>
      <div className="in">
        <div className="sh-text">
          <div className="sh-k">Role a página ou toque nos tons</div>
          <div className="sh-name">{SHADES[idx].n}</div>
          <p>{SHADES[idx].t}</p>
          <p className="fine">O tom real do seu dente é definido na avaliação, comparando com a escala no consultório.</p>
        </div>
        <div className="sh-cv">
          <canvas id="sCv" ref={cv} aria-hidden="true" />
          <div className="sw" role="group" aria-label="Tons da escala">
            {SHADES.map((s, i) => (
              <button key={s.n} type="button" aria-pressed={i === idx} aria-label={`Tom ${s.n}`} style={{ background: s.c }} onClick={() => jumpToShade(i)}>
                <span>{s.n}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
