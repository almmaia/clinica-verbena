import { useState } from 'react'
import { asset } from '../lib/env'
import { SplitHeading } from './Words'

const ITEMS = [
  { k: 'consult-bright', title: 'Prevenção e limpeza', alt: 'Dentista conversando com paciente na cadeira, em sala clara', text: 'Avaliação completa da boca, radiografias quando necessárias e limpeza profissional. É o ponto de partida de qualquer tratamento.', bullets: ['Revisão a cada seis meses, ou conforme a sua necessidade', 'Orientação de higiene para o seu caso'] },
  { k: 'smile-teal', title: 'Clareamento', alt: 'Close do sorriso de uma mulher com dentes claros e fundo azul-petróleo', text: 'Clareamento supervisionado, no consultório ou com moldeira em casa. Antes, avaliamos a saúde das gengivas e dos dentes para o resultado ser seguro.', bullets: ['Indicação feita depois da avaliação', 'Acompanhamento até o tom combinado'] },
  { k: 'laugh-outdoor', title: 'Estética do sorriso', alt: 'Mulher rindo ao ar livre, com o cabelo ao vento', text: 'Restaurações, facetas e lentes de contato dental para ajustar forma, tamanho e cor. Mostramos o planejamento antes de qualquer procedimento.', bullets: ['Planejamento digital do sorriso', 'Materiais escolhidos junto com você'] },
  { k: 'tools-hand', title: 'Alinhadores e aparelhos', alt: 'Mão com luva segurando instrumentos odontológicos sobre uma bandeja', text: 'Alinhadores transparentes e aparelhos fixos, para adultos e adolescentes. Escolhemos o método pelo seu caso e pela sua rotina.', bullets: ['Consultas de manutenção com hora marcada', 'Contenção ao final, para manter o resultado'] },
  { k: 'scan', title: 'Implantes', alt: 'Dentista apontando para a tela com a imagem digital dos dentes do paciente', text: 'Reposição de dentes com planejamento por imagem e atendimento em dupla. Explicamos cada fase antes da cirurgia e depois dela.', bullets: ['Avaliação por tomografia quando indicada', 'Acompanhamento no pós-operatório'] },
]

/** Lista de tratamentos em sanfona; no desktop a foto ao lado acompanha o item aberto. */
export function Treatments() {
  const [active, setActive] = useState(ITEMS[0].k)
  return (
    <section className="treat" id="tratamentos" data-h="light">
      <div className="wrap">
        <div className="head">
          <SplitHeading className="big" text="Tratamentos, explicados antes de começar" />
          <p>Cada plano sai por escrito, com as etapas, o tempo estimado e o valor. Você decide com calma e pode pedir uma segunda opinião.</p>
        </div>
        <div className="treat-grid">
          <div className="acc">
            {ITEMS.map((it) => (
              <details
                key={it.k}
                name="trat"
                open={active === it.k}
                onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) setActive(it.k) }}
              >
                <summary>{it.title}</summary>
                <div className="body">
                  <img className="m-img" src={asset(it.k + '.webp')} alt={it.alt} loading="lazy" decoding="async" />
                  <p>{it.text}</p>
                  <ul>{it.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                </div>
              </details>
            ))}
          </div>
          <div className="stage" aria-hidden="true">
            {ITEMS.map((it) => (
              <img key={it.k} className={active === it.k ? 'on' : ''} src={asset(it.k + '.webp')} alt="" loading="lazy" decoding="async" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
