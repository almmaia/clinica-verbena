import { useRef } from 'react'
import { asset } from '../lib/env'
import { useParallax } from '../lib/useParallax'
import { SplitHeading } from './Words'

export function Clinic() {
  const sec = useRef<HTMLElement>(null)
  useParallax(sec)
  return (
    <section className="clinic" id="clinica" data-h="dark" ref={sec}>
      <div className="wrap">
        <div className="head">
          <SplitHeading className="big" text="Um consultório que não parece consultório" />
          <p>Luz natural, sala de espera silenciosa e salas de atendimento pensadas para quem tem medo de dentista.</p>
        </div>
        <div className="mosaic">
          <figure className="m1"><img src={asset('chair-window.webp')} alt="Sala de atendimento com cadeira odontológica e grandes janelas" loading="lazy" decoding="async" data-par="-8" /></figure>
          <figure className="m2"><img src={asset('dentist-green.webp')} alt="Dentista sorrindo ao lado de paciente em sala com parede verde" loading="lazy" decoding="async" data-par="-10" /></figure>
          <figure className="m3"><img src={asset('waiting-room.webp')} alt="Sala de espera clara e silenciosa com poltrona branca" loading="lazy" decoding="async" data-par="-9" /></figure>
          <figure className="m4"><img src={asset('reception.webp')} alt="Recepção branca com balcão de mármore e plantas" loading="lazy" decoding="async" data-par="-12" /></figure>
        </div>
        <div className="points">
          <div><h3>Hora marcada de verdade</h3><p>Você não espera na recepção. Reservamos o tempo da consulta inteira para você.</p></div>
          <div><h3>Plano por escrito</h3><p>Etapas, prazos e valores no papel antes de começar. Sem surpresa no meio do caminho.</p></div>
          <div><h3>Sem pressa e sem susto</h3><p>Explicamos o que vamos fazer, e você pode pedir uma pausa a qualquer momento.</p></div>
        </div>
      </div>
    </section>
  )
}
