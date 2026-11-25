import { useLayoutEffect, useRef } from 'react'
import { asset, reduce } from '../lib/env'
import { gsap } from '../lib/scroll'
import { SplitHeading } from './Words'

const STEPS = [
  { img: 'dentist-smile.webp', alt: 'Dentista sorrindo ao conversar com um paciente', title: 'Conversa e avaliação', text: 'Você conta o que incomoda e o que deseja. Examinamos a boca com calma e sem julgamento.' },
  { img: 'xray.webp', alt: 'Dentista analisando radiografias dos dentes em um negatoscópio', title: 'Exames e planejamento', text: 'Radiografias e imagens quando necessárias. Com elas, montamos as opções de tratamento para o seu caso.' },
  { img: 'tablet.webp', alt: 'Dentista mostrando uma imagem no tablet para o paciente', title: 'Plano por escrito', text: 'Etapas, prazos e valores no papel. Você leva para casa, decide com tranquilidade e pode pedir outra opinião.' },
  { img: 'loupes.webp', alt: 'Dentista e auxiliar com lupas atendendo um paciente', title: 'Tratamento e acompanhamento', text: 'Atendimento em dupla, com hora marcada. Depois do tratamento, combinamos as revisões.' },
]

/** Linha do tempo do atendimento: a linha se preenche com a rolagem e cada etapa se revela. */
export function Steps() {
  const sec = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.to('.prog', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 60%', end: 'bottom 60%', scrub: true } })
      gsap.utils.toArray<HTMLElement>('.st').forEach((st) => {
        gsap.fromTo(st.querySelector('.ph'), { clipPath: 'inset(100% 0 0 0 round 28px)' }, {
          clipPath: 'inset(0% 0 0 0 round 28px)', duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: st, start: 'top 75%', once: true },
        })
        gsap.from(st.querySelector('.tx'), { opacity: 0, y: 30, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: st, start: 'top 70%', once: true } })
      })
    }, sec)
    return () => ctx.revert()
  }, [])

  return (
    <section className="steps" data-h="light" ref={sec}>
      <div className="wrap">
        <div className="head">
          <SplitHeading className="big" text="Como é o atendimento" />
          <p>Quatro etapas, sempre na mesma ordem. Você sabe onde está e o que vem a seguir.</p>
        </div>
        <div className="tl">
          <div className="prog" />
          {STEPS.map((s) => (
            <div className="st" key={s.title}>
              <div className="ph"><img src={asset(s.img)} alt={s.alt} loading="lazy" decoding="async" /></div>
              <div className="tx"><h3>{s.title}</h3><p>{s.text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
