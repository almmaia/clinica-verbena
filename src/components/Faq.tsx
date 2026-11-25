import { SplitHeading } from './Words'

const QA = [
  { q: 'Como funciona a primeira consulta?', a: 'Conversamos sobre o seu histórico, examinamos a boca e fazemos as radiografias necessárias. No fim, você recebe um plano por escrito, com as prioridades e os valores.' },
  { q: 'Dói?', a: 'Trabalhamos com anestesia e com técnicas para reduzir o desconforto. Se você tem medo, avise na hora de agendar: reservamos mais tempo e vamos no seu ritmo.' },
  { q: 'Vocês atendem por convênio?', a: 'O atendimento é particular. Emitimos recibo e relatório do procedimento para você pedir reembolso ao seu plano, quando ele oferece essa opção.' },
  { q: 'Posso parcelar o tratamento?', a: 'Sim. As condições de pagamento entram no plano de tratamento e podem ser conversadas na avaliação.' },
  { q: 'E se eu precisar remarcar?', a: 'Avise pelo WhatsApp com um dia de antecedência e escolhemos outro horário sem custo.' },
]

export function Faq() {
  return (
    <section className="faq-sec" id="duvidas" data-h="light">
      <div className="wrap faq-grid">
        <div className="head" style={{ margin: 0 }}>
          <SplitHeading className="big" text="Perguntas comuns" />
          <p>Não achou a sua? Mande no WhatsApp e respondemos no mesmo dia útil.</p>
        </div>
        <div className="faq">
          {QA.map((x) => (
            <details key={x.q}><summary>{x.q}</summary><div className="a">{x.a}</div></details>
          ))}
        </div>
      </div>
    </section>
  )
}
