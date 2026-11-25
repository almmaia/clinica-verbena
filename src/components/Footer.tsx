/** Rodapé: chamada para agendar, navegação, endereço, atendimento e o nome da clínica em tamanho grande. */
export function Footer() {
  return (
    <footer data-h="dark">
      <div className="wrap">
        <div className="f-top">
          <h2 className="f-cta">Seu sorriso merece um horário só seu.</h2>
          <a className="btn" href="#agendar" data-mag>Agendar avaliação</a>
        </div>
        <div className="f-cols">
          <div className="f-brand">
            <a className="brand" href="#hero" aria-label="Verbena Odontologia, início">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16 3c-5 0-9 3-9 8 0 4 1 6 2 10 .6 2.4 1.3 7 3.4 7 2 0 2-5 3.6-5s1.6 5 3.6 5c2.1 0 2.8-4.6 3.4-7 1-4 2-6 2-10 0-5-4-8-9-8Z" fill="currentColor" />
              </svg>
              Verbena
            </a>
            <p>Odontologia em Porto Alegre com hora marcada, plano de tratamento por escrito e atendimento sem pressa.</p>
          </div>
          <nav aria-label="Rodapé">
            <h3>Navegue</h3>
            <ul>
              <li><a href="#escala">Escala de cor</a></li>
              <li><a href="#tratamentos">Tratamentos</a></li>
              <li><a href="#clinica">A clínica</a></li>
              <li><a href="#duvidas">Perguntas comuns</a></li>
            </ul>
          </nav>
          <div>
            <h3>Onde estamos</h3>
            <p>Rua Padre Chagas, 120, sala 402<br />Moinhos de Vento, Porto Alegre, RS</p>
            <p>Segunda a sexta, 8h às 19h<br />Sábado, 8h às 12h</p>
          </div>
          <div>
            <h3>Atendimento</h3>
            <p>Agendamentos e dúvidas pelo WhatsApp, com resposta no mesmo dia útil.</p>
            <a className="btn" href="https://wa.me/" target="_blank" rel="noopener">Chamar no WhatsApp</a>
          </div>
        </div>
        <div className="f-base">
          <span>© 2026 Verbena Odontologia. Todos os direitos reservados.</span>
          <a href="#hero">Voltar ao topo</a>
        </div>
      </div>
      <div className="giant" aria-hidden="true">Verbena</div>
    </footer>
  )
}
