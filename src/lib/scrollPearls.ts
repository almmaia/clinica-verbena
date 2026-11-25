import { clamp, reduce } from './env'
import { gsap } from './scroll'

interface Piece {
  side: -1 | 1
  home: number // posição vertical de origem (0 a 1)
  depth: number // 0,35 a 1: quanto mais perto, mais rápido e maior
  r: number // raio em px
  kind: 'pearl' | 'tooth'
  tint: number
  ox: number; vx: number
  oy: number; vy: number
  rot: number; vr: number
  seed: number
}

/** Mesma silhueta do ícone da marca (viewBox 32). */
const TOOTH = new Path2D('M16 6c-4 0-7 2.3-7 6 0 3 .8 4.6 1.6 7.6.5 1.9 1 5.4 2.6 5.4 1.6 0 1.6-3.8 2.8-3.8s1.2 3.8 2.8 3.8c1.6 0 2.1-3.5 2.6-5.4C22.2 16.6 23 15 23 12c0-3.7-3-6-7-6Z')

const PEARL = [
  ['#FFFFFF', '#E9F3EE', '#B9D2C4'],
  ['#FFFFFF', '#D6E9DD', '#9FC2AF'],
  ['#FFF4F1', '#F5C7BC', '#E8725C'],
]

/**
 * Pérolas e dentinhos nas margens da página. Com a rolagem eles descem em ritmos diferentes,
 * são empurrados, quicam de volta (mola) e giram. Parados, não gastam nada.
 */
export function createScrollPearls(canvas: HTMLCanvasElement) {
  if (reduce) return () => {}
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  let W = 0, H = 0, dpr = 1
  let pieces: Piece[] = []
  let lastY = window.scrollY
  let needsDraw = true
  let T = 0

  const build = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5)
    W = canvas.clientWidth
    H = canvas.clientHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    const n = W > 1100 ? 12 : W > 700 ? 8 : 6
    const gut = Math.max(16, W * 0.04)
    pieces = Array.from({ length: n }, (_, i) => {
      const depth = 0.35 + Math.random() * 0.65
      const wide = W > 700
      const r = wide ? clamp(gut * (0.16 + depth * 0.24), 7, 17) : 7 + depth * 8
      return {
        side: i % 2 ? 1 : -1, home: (i + Math.random() * 0.8) / n, depth, r,
        kind: i % 3 === 1 ? 'tooth' : 'pearl', tint: Math.floor(Math.random() * 3),
        ox: 0, vx: 0, oy: 0, vy: 0, rot: Math.random() * 0.8 - 0.4, vr: 0, seed: Math.random() * 6,
      }
    })
    needsDraw = true
  }
  build()
  const ro = new ResizeObserver(build)
  ro.observe(canvas)

  const draw = (p: Piece, x: number, y: number) => {
    const c = ctx
    c.save()
    c.translate(x, y)
    c.rotate(p.rot)
    c.shadowColor = 'rgba(10,31,24,.28)'
    c.shadowBlur = p.r * 0.9
    c.shadowOffsetY = p.r * 0.25
    if (p.kind === 'pearl') {
      const t = PEARL[p.tint]
      const g = c.createRadialGradient(-p.r * 0.35, -p.r * 0.4, p.r * 0.05, 0, 0, p.r * 1.15)
      g.addColorStop(0, t[0])
      g.addColorStop(0.6, t[1])
      g.addColorStop(1, t[2])
      c.fillStyle = g
      c.beginPath()
      c.arc(0, 0, p.r, 0, Math.PI * 2)
      c.fill()
      c.shadowColor = 'transparent'
      c.fillStyle = 'rgba(255,255,255,.75)'
      c.beginPath()
      c.ellipse(-p.r * 0.34, -p.r * 0.4, p.r * 0.2, p.r * 0.13, -0.6, 0, Math.PI * 2)
      c.fill()
    } else {
      const s = (p.r * 2.1) / 20
      c.scale(s, s)
      c.translate(-16, -15.7)
      const g = c.createLinearGradient(9, 6, 23, 26)
      g.addColorStop(0, '#FFFFFF')
      g.addColorStop(1, '#DCEBE1')
      c.fillStyle = g
      c.fill(TOOTH)
      c.shadowColor = 'transparent'
      c.lineWidth = 0.7
      c.strokeStyle = 'rgba(29,75,58,.35)'
      c.stroke(TOOTH)
    }
    c.restore()
  }

  const tick = (_t: number, dtMs: number) => {
    const dt = Math.min(2, dtMs / 16.67)
    T += dt
    const y = window.scrollY
    const dy = y - lastY
    lastY = y
    let moving = Math.abs(dy) > 0.01
    for (const p of pieces) {
      p.vy += -dy * (0.05 + p.depth * 0.05) * dt
      p.vx += -p.side * Math.abs(dy) * 0.012 * p.depth * dt
      p.vr += dy * 0.0022 * p.depth * dt
      p.vy += -p.oy * 0.055 * dt
      p.vx += -p.ox * 0.06 * dt
      p.vr += -p.rot * 0.02 * dt
      p.vy *= Math.pow(0.9, dt)
      p.vx *= Math.pow(0.88, dt)
      p.vr *= Math.pow(0.93, dt)
      p.oy = clamp(p.oy + p.vy * dt, -90, 90)
      p.ox = clamp(p.ox + p.vx * dt, -12, 12)
      p.rot += p.vr * dt
      if (Math.abs(p.vy) > 0.03 || Math.abs(p.vx) > 0.03 || Math.abs(p.vr) > 0.0008 || Math.abs(p.oy) > 0.2 || Math.abs(p.rot) > 0.02) moving = true
    }
    if (!moving && !needsDraw) return
    needsDraw = false
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    const span = H + 120
    const gut = Math.max(16, W * 0.04)
    for (const p of pieces) {
      const py = (((p.home * span - y * p.depth * 0.32) % span) + span) % span - 60
      const wide = W > 700
      const cx = wide ? (p.side < 0 ? gut * 0.4 : W - gut * 0.4) : (p.side < 0 ? 2 : W - 2)
      draw(p, cx + p.ox + Math.sin(T * 0.02 + p.seed) * 1.5, py + p.oy)
    }
  }
  gsap.ticker.add(tick)
  return () => {
    gsap.ticker.remove(tick)
    ro.disconnect()
  }
}
