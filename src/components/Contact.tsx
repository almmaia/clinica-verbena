import { useRef } from 'react'
import { asset } from '../lib/env'
import { useParallax } from '../lib/useParallax'
import { SplitHeading } from './Words'

export function Contact() {
  const sec = useRef<HTMLElement>(null)
  useParallax(sec)
  return (
    <section className="contact" id="contato" data-h="light" ref={sec}>
      <div className="wrap contact-grid">
        <div>
          <SplitHeading className="big" text="Venha conhecer a clínica" />
          <dl>
            <dt>Endereço</dt><dd>Rua Padre Chagas, 120, sala 402<br />Moinhos de Vento, Porto Alegre, RS</dd>
            <dt>Horário</dt><dd>Segunda a sexta, 8h às 19h<br />Sábado, 8h às 12h</dd>
            <dt>Contato</dt><dd>Pelo WhatsApp, com resposta no mesmo dia útil</dd>
          </dl>
          <a className="btn dark" href="#agendar" data-mag>Escolher um horário</a>
        </div>
        <div className="ph"><img src={asset('hallway.webp')} alt="Corredor claro com piso de porcelanato e iluminação indireta" loading="lazy" decoding="async" data-par="-8" /></div>
      </div>
    </section>
  )
}
