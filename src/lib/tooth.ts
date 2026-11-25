import * as THREE from 'three'

/** Funde as normais de vértices coincidentes (a emenda do torno some). */
function smoothNormals(g: THREE.BufferGeometry) {
  const pos = g.attributes.position as THREE.BufferAttribute
  const nor = g.attributes.normal as THREE.BufferAttribute
  const map = new Map<string, { n: [number, number, number]; idx: number[] }>()
  for (let i = 0; i < pos.count; i++) {
    const k = pos.getX(i).toFixed(4) + '|' + pos.getY(i).toFixed(4) + '|' + pos.getZ(i).toFixed(4)
    let e = map.get(k)
    if (!e) { e = { n: [0, 0, 0], idx: [] }; map.set(k, e) }
    e.n[0] += nor.getX(i); e.n[1] += nor.getY(i); e.n[2] += nor.getZ(i); e.idx.push(i)
  }
  map.forEach((e) => {
    const l = Math.hypot(e.n[0], e.n[1], e.n[2]) || 1
    e.idx.forEach((i) => nor.setXYZ(i, e.n[0] / l, e.n[1] / l, e.n[2] / l))
  })
}

/** Perfil suave (raio, altura) a partir de pontos; a ordem sobe de baixo para cima, para as faces ficarem para fora. */
const profile = (pts: [number, number][], n: number) =>
  new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], 0)), false, 'centripetal')
    .getPoints(n)
    .map((v) => new THREE.Vector2(Math.max(0.0005, v.x), v.y))
    .reverse()

/** Coroa: torno com quatro cúspides e seção levemente quadrada. */
function crownGeo() {
  const prof = profile([[0.001, 0.8], [0.34, 0.86], [0.68, 1.0], [0.93, 0.82], [1.03, 0.44], [0.96, 0.02], [0.76, -0.3], [0.56, -0.52], [0.001, -0.6]], 90)
  const g = new THREE.LatheGeometry(prof, 88)
  const pos = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const th = Math.atan2(z, x), r = Math.hypot(x, z)
    const nr = r * (1 + 0.085 * Math.cos(4 * th))
    x = Math.cos(th) * nr
    z = Math.sin(th) * nr * 0.88
    const rim = Math.min(1, Math.max(0, (y - 0.62) / 0.3))
    y += rim * 0.17 * (0.5 - 0.5 * Math.cos(4 * th))
    pos.setXYZ(i, x, y, z)
  }
  g.computeVertexNormals()
  smoothNormals(g)
  return g
}

function rootGeo() {
  const g = new THREE.LatheGeometry(profile([[0.31, 0.62], [0.31, 0.2], [0.3, -0.15], [0.245, -0.52], [0.155, -0.84], [0.075, -1.04], [0.001, -1.12]], 50), 56)
  g.computeVertexNormals()
  smoothNormals(g)
  return g
}

/** Molar de porcelana: coroa e duas raízes abertas em leque. */
export function makeTooth(mat: THREE.Material) {
  const grp = new THREE.Group()
  grp.add(new THREE.Mesh(crownGeo(), mat))
  const rg = rootGeo()
  const roots: [number, number][] = [[-0.36, -0.14], [0.36, 0.14]]
  roots.forEach(([x, rz]) => {
    const m = new THREE.Mesh(rg, mat)
    m.position.set(x, -0.5, 0)
    m.rotation.z = rz
    m.scale.set(1, 1, 0.9)
    grp.add(m)
  })
  return grp
}

type V3 = [number, number, number]

/** Estúdio claro em verde-esmalte: softbox no alto e faixas laterais. */
export function makeEnv(renderer: THREE.WebGLRenderer) {
  const s = new THREE.Scene()
  s.add(new THREE.Mesh(new THREE.BoxGeometry(30, 20, 30), new THREE.MeshBasicMaterial({ color: 0x9fb9ab, side: THREE.BackSide })))
  const panel = (w: number, h: number, pos: V3, rgb: V3, rot: V3) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }))
    m.material.color.setRGB(rgb[0], rgb[1], rgb[2])
    m.position.set(pos[0], pos[1], pos[2])
    m.rotation.set(rot[0], rot[1], rot[2])
    s.add(m)
  }
  panel(16, 9, [0, 9, 3], [6, 6, 5.6], [Math.PI / 2, 0, 0])
  panel(4, 12, [-11, 1, 4], [5, 5.2, 5], [0, Math.PI / 2, 0])
  panel(4, 12, [11, 0, -2], [1.4, 3.4, 2.6], [0, -Math.PI / 2, 0])
  panel(12, 3, [0, -8, 5], [2.4, 3.2, 2.8], [-Math.PI / 2, 0, 0])
  const pm = new THREE.PMREMGenerator(renderer)
  const tex = pm.fromScene(s, 0.03).texture
  pm.dispose()
  s.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.geometry) m.geometry.dispose()
    if (m.material) (m.material as THREE.Material).dispose()
  })
  return tex
}

export function makeRenderer(canvas: HTMLCanvasElement) {
  try {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    r.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.25 : 1.5))
    r.toneMapping = THREE.ACESFilmicToneMapping
    r.toneMappingExposure = 1.0
    return r
  } catch {
    return null
  }
}

export const toothMat = (c: number) =>
  new THREE.MeshPhysicalMaterial({
    color: c, roughness: 0.3, metalness: 0, clearcoat: 0.85, clearcoatRoughness: 0.16,
    sheen: 0.15, sheenColor: new THREE.Color(0xfff1e0), sheenRoughness: 0.6, envMapIntensity: 0.8,
  })

export function disposeAll(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  scene.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.geometry) m.geometry.dispose()
    const mat = m.material as THREE.Material | THREE.Material[] | undefined
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
    else mat?.dispose()
  })
  if (scene.environment) scene.environment.dispose()
  renderer.dispose()
}
