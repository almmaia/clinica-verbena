/** Botão fixo no rodapé do celular, visível entre a frase de destaque e o agendamento. */
export function StickyCta({ on }: { on: boolean }) {
  return (
    <a className={'sticky-cta btn' + (on ? ' on' : '')} id="sticky" href="#agendar" aria-label="Agendar avaliação">
      Agendar avaliação
    </a>
  )
}
