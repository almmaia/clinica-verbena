import * as THREE from 'three'
import { bindMouse, mouse, reduce } from './env'
import { gsap, ScrollTrigger } from './scroll'
import { disposeAll, makeEnv, makeRenderer, makeTooth, toothMat } from './tooth'

export interface HeroTooth {
  /** Estado animado de fora: abertura (0→1) e progresso do scroll. */
  st: { scroll: number; intro: number }
  dispose: () => void
}

/** Cena do topo: o dente gira com o mouse e o scroll; pérolas flutuam ao redor. */
export function createHeroTooth(canvas: HTMLCanvasElement, trigger: HTMLElement): HeroTooth | null {
  const r = makeRenderer(canvas)
  if (!r) return null
  bindMouse()
  const scene = new THREE.Scene()
  scene.environment = makeEnv(r)
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
  cam.position.set(0, 0, 9.5)
  const key = new THREE.DirectionalLight(0xfff6ea, 1.8)
  key.position.set(-3, 5, 6)
  scene.add(key)
  const rim = new THREE.PointLight(0xe8725c, 24, 20)
  rim.position.set(5, -2, -2)
  scene.add(rim)

  const pivot = new THREE.Group()
  pivot.add(makeTooth(toothMat(0xf7f4ea)))
  scene.add(pivot)

  // pérolas flutuantes
  const N = innerWidth < 760 ? 8 : 16
  const inst = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 24, 18),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.3 }),
    N,
  )
  const tints = [0xffffff, 0xd6e9dd, 0xf7f4ea, 0xe8725c, 0xbfdacb]
  const col = new THREE.Color()
  const items: { x: number; y: number; z: number; s: number; ph: number; v: number }[] = []
  for (let i = 0; i < N; i++) {
    let x: number, y: number, z: number
    do {
      x = (Math.random() * 2 - 1) * 4.6
      y = (Math.random() * 2 - 1) * 3.4
      z = -4 + Math.random() * 6.5
    } while (Math.abs(x) < 1.7 && Math.abs(y) < 2.4 && z > -1.5)
    items.push({ x, y, z, s: 0.07 + Math.random() * 0.2, ph: Math.random() * 6, v: 0.2 + Math.random() * 0.4 })
    inst.setColorAt(i, col.setHex(tints[i === 3 ? 3 : i % 5 === 3 ? 0 : i % 5]))
  }
  scene.add(inst)

  const dummy = new THREE.Object3D()
  const st = { scroll: 0, intro: reduce ? 1 : 0 }
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    r.setSize(w, h, false)
    cam.aspect = w / h
    cam.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let live = true
  let T = 0
  const tick = (_t: number, dtMs: number) => {
    if (!live) return
    T += dtMs / 1000
    mouse.x += (mouse.tx - mouse.x) * 0.05
    mouse.y += (mouse.ty - mouse.y) * 0.05
    pivot.scale.setScalar(1.12 * (0.5 + 0.5 * st.intro) * (1 + st.scroll * 0.4))
    pivot.rotation.set(
      0.12 + mouse.y * 0.25 + st.scroll * 0.4,
      Math.sin(T * 0.5) * 0.55 + mouse.x * 0.6 + st.scroll * 3 - (1 - st.intro) * 3.2,
      0.1 + Math.sin(T * 0.4) * 0.05,
    )
    pivot.position.y = 0.1 + Math.sin(T * 0.9) * 0.1 - st.scroll * 1.6
    for (let i = 0; i < N; i++) {
      const it = items[i], par = (it.z + 4) / 6.5
      dummy.position.set(
        it.x + mouse.x * (0.2 + par * 0.5),
        it.y + Math.sin(T * it.v + it.ph) * 0.25 - mouse.y * 0.3 - st.scroll * (1 + par * 2.4),
        it.z,
      )
      dummy.scale.setScalar(it.s * (0.3 + 0.7 * st.intro))
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
    }
    inst.instanceMatrix.needsUpdate = true
    r.render(scene, cam)
  }
  gsap.ticker.add(tick)

  const trig = ScrollTrigger.create({
    trigger, start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (s) => { st.scroll = s.progress },
    onToggle: (s) => { live = s.isActive },
  })

  return {
    st,
    dispose() {
      gsap.ticker.remove(tick)
      trig.kill()
      ro.disconnect()
      disposeAll(scene, r)
    },
  }
}
