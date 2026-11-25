import { useEffect, useRef } from 'react'
import { createScrollPearls } from '../lib/scrollPearls'

/** Camada fixa, sem clique, com pérolas e dentinhos que pulam e giram conforme a rolagem. */
export function ScrollPearls() {
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => (cv.current ? createScrollPearls(cv.current) : undefined), [])
  return <canvas className="play" ref={cv} aria-hidden="true" />
}
