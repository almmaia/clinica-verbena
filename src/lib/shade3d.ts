import * as THREE from 'three'
import { SHADES } from './shades'
import { disposeAll, makeEnv, makeRenderer, makeTooth, toothMat } from './tooth'

export interface ShadeGL {
  /** Desenha o dente no progresso p (0 a 1) da escala: cor interpolada e giro. */
  render: (p: number) => void
  /** Verdadeiro uma vez após redimensionar: pede novo desenho mesmo sem mudança de p. */
  consumeDirty: () => boolean
  dispose: () => void
}

/** Dente grande da escala de cor: muda de tom e gira conforme a rolagem. */
export function createShadeGL(canvas: HTMLCanvasElement): ShadeGL | null {
  const r = makeRenderer(canvas)
  if (!r) return null
  const scene = new THREE.Scene()
  scene.environment = makeEnv(r)
  const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 40)
  cam.position.set(0, 0.2, 9)
  const key = new THREE.DirectionalLight(0xfff3e4, 2.2)
  key.position.set(-3, 4, 5)
  scene.add(key)
  const rim = new THREE.PointLight(0xe8725c, 30, 20)
  rim.position.set(4, 0, -3)
  scene.add(rim)

  const mat = toothMat(0xcdae78)
  const pivot = new THREE.Group()
  pivot.add(makeTooth(mat))
  scene.add(pivot)

  let aspect = 1
  let dirty = true
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    r.setSize(w, h, false)
    aspect = w / h
    cam.aspect = aspect
    cam.position.z = aspect < 0.9 ? 12 : 9
    cam.updateProjectionMatrix()
    dirty = true
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const a = new THREE.Color(), b = new THREE.Color()
  return {
    render(p) {
      const f = p * (SHADES.length - 1), i0 = Math.floor(f), i1 = Math.min(SHADES.length - 1, i0 + 1)
      a.set(SHADES[i0].c)
      b.set(SHADES[i1].c)
      mat.color.copy(a).lerp(b, f - i0)
      pivot.scale.setScalar(1.2)
      pivot.rotation.set(0.12, p * 4.2 + Math.sin(p * 6) * 0.25 + 0.3, 0.08)
      pivot.position.y = aspect < 0.9 ? 0.35 : 0.5
      r.render(scene, cam)
    },
    consumeDirty() {
      const d = dirty
      dirty = false
      return d
    },
    dispose() {
      ro.disconnect()
      disposeAll(scene, r)
    },
  }
}
