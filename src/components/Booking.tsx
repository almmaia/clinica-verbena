import { useRef, useState } from 'react'
import { busy, dayMonth, dias, hm, longDate, pick, type Selection, SLOTS, weekday } from '../lib/agenda'
import { asset } from '../lib/env'
import { useParallax } from '../lib/useParallax'

const REASONS = ['Avaliação inicial', 'Limpeza e prevenção', 'Clareamento', 'Implante', 'Alinhadores ou aparelho', 'Outro assunto']

interface Props {
  sel: Selection
  onSel: (s: Selection) => void
}

/** Agendamento: dia, horário, motivo e nome. Monta a mensagem pronta para o WhatsApp. */
export function Booking({ sel, onSel }: Props) {
  const sec = useRef<HTMLElement>(null)
  useParallax(sec)
  const [reason, setReason] = useState(REASONS[0])
  const [name, setName] = useState('')

  const date = dias[sel.day]
  const long = longDate(date)
  const longCap = long.charAt(0).toUpperCase() + long.slice(1)
  const ok = sel.time !== null
  const msg = ok
    ? `Olá! ${name.trim() ? 'Aqui é ' + name.trim() + '. ' : ''}Quero agendar: ${reason}, ${long}, às ${hm(sel.time!)}. Esse horário está disponível?`
    : ''

  return (
    <section className="book-sec" id="agendar" data-h="light" ref={sec}>
      <div className="wrap book-grid">
        <form className="book" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <h3>Agende sua avaliação</h3>
          <span className="lbl" id="l-dia">Dia</span>
          <div className="days" role="group" aria-labelledby="l-dia">
            {dias.map((d, i) => (
              <button key={i} type="button" className="chip" aria-pressed={sel.day === i} onClick={() => onSel(pick(i, sel.time))}>
                {weekday(d)}<small>{dayMonth(d)}</small>
              </button>
            ))}
          </div>
          <span className="lbl" id="l-hora">Horário</span>
          <div className="times" role="group" aria-labelledby="l-hora">
            {SLOTS.map((t, i) => (
              <button key={t} type="button" className="chip" aria-pressed={sel.time === t} disabled={busy(date, i)} onClick={() => onSel({ day: sel.day, time: t })}>
                {hm(t)}
              </button>
            ))}
          </div>
          <div className="row2">
            <div>
              <label className="lbl" htmlFor="motivo">Motivo da consulta</label>
              <select className="field" id="motivo" value={reason} onChange={(e) => setReason(e.target.value)}>
                {REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl" htmlFor="nome">Seu nome</label>
              <input className="field" id="nome" type="text" placeholder="Como podemos chamar você?" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="go">
            <p className="sum" aria-live="polite">
              {ok ? <><b>{longCap}, {hm(sel.time!)}</b><br />{reason}</> : 'Sem horários neste dia. Escolha outro dia.'}
            </p>
            <a
              className="btn"
              href={ok ? 'https://wa.me/?text=' + encodeURIComponent(msg) : '#agendar'}
              target="_blank"
              rel="noopener"
              aria-disabled={ok ? undefined : true}
              style={{ opacity: ok ? 1 : 0.5 }}
              onClick={(e) => { if (!ok) e.preventDefault() }}
              data-mag
            >
              Pedir este horário
            </a>
          </div>
          <p className="demo-note">Você confirma o horário pelo WhatsApp. Se precisar remarcar, é só avisar com um dia de antecedência.</p>
        </form>
        <div className="book-ph"><div className="im"><img src={asset('smile-look.webp')} alt="Mulher sorrindo de olhos baixos em retrato aproximado" loading="lazy" decoding="async" data-par="-7" /></div></div>
      </div>
    </section>
  )
}
