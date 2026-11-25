import { useLayoutEffect, useRef } from 'react'
import { asset, reduce } from '../lib/env'
import { gsap } from '../lib/scroll'

/** Foto de página inteira com parallax suave e uma frase de apoio. */
export function BigPhoto() {
  const box = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.fromTo('img', { yPercent: -5 }, {
        yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: box.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, box)
    return () => ctx.revert()
  }, [])
  return (
    <div className="bigph" data-h="dark" ref={box}>
      <img src={asset('smile-warm.webp')} alt="Mulher sorrindo de olhos baixos, com luz quente no rosto" loading="lazy" decoding="async" />
      <div className="cap"><div className="wrap"><p>Odontologia que respeita o seu ritmo.</p></div></div>
    </div>
  )
}
