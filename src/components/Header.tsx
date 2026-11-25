/** Barra superior fixa. O tema (claro/escuro) acompanha a seção que está embaixo dela. */
export function Header({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <header className="top" data-t={theme} id="top">
      <div className="wrap">
        <a className="brand" href="#hero" aria-label="Verbena Odontologia, início">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 3c-5 0-9 3-9 8 0 4 1 6 2 10 .6 2.4 1.3 7 3.4 7 2 0 2-5 3.6-5s1.6 5 3.6 5c2.1 0 2.8-4.6 3.4-7 1-4 2-6 2-10 0-5-4-8-9-8Z" fill="currentColor" />
          </svg>
          Verbena
        </a>
        <nav className="nav" aria-label="Principal">
          <a className="hide-sm" href="#escala">Escala de cor</a>
          <a className="hide-sm" href="#tratamentos">Tratamentos</a>
          <a className="hide-sm" href="#clinica">A clínica</a>
          <a className="hide-sm" href="#duvidas">Dúvidas</a>
          <a className="btn" href="#agendar" data-mag>Agendar</a>
        </nav>
      </div>
    </header>
  )
}
