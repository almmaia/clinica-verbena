import { useEffect, useRef, useState } from 'react'
import { reduce } from '../lib/env'
import { gsap } from '../lib/scroll'

/** Tela de abertura. Chama onFinish quando a página está pronta para a entrada. */
export function Preloader({ onFinish }: { onFinish: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLElement>(null)
  const [gone, setGone] = useState(reduce)

  useEffect(() => {
    if (reduce) {
      onFinish()
      return
    }
    const el = root.current
    let done = false
    let timer = 0
    const finish = () => {
      if (done) return
      done = true
      onFinish()
      gsap.to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', onComplete: () => setGone(true) })
    }
    const o = { v: 0 }
    const tw = gsap.to(o, {
      v: 1, duration: 1.2, ease: 'power2.inOut',
      onUpdate: () => { if (bar.current) bar.current.style.transform = `scaleX(${o.v})` },
      onComplete: () => {
        if (document.readyState === 'complete') finish()
        else window.addEventListener('load', finish, { once: true })
        timer = window.setTimeout(finish, 2500)
      },
    })
    return () => {
      tw.kill()
      clearTimeout(timer)
      window.removeEventListener('load', finish)
      gsap.killTweensOf(el)
    }
    // onFinish é estável (useCallback no App)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div id="pre" ref={root} aria-hidden="true">
      <div className="in"><div className="nm">Verbena</div><div className="bar"><i ref={bar} /></div></div>
    </div>
  )
}
