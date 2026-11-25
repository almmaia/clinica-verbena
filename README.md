# Verbena Odontologia

Site de uma clínica odontológica em Porto Alegre. Vite + React + TypeScript, com GSAP (ScrollTrigger), Lenis e Three.js.

## Como rodar

```powershell
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ (funciona em qualquer pasta ou subdomínio)
npm run preview    # serve o dist/ para conferir o build
npm run lint
```

O build usa caminhos relativos (`base: './'`): a pasta `dist/` pode ser enviada para Netlify, Vercel, GitHub Pages ou qualquer hospedagem estática.

## O que tem de especial

- **Dente 3D de porcelana feito por código** (`src/lib/tooth.ts`): coroa e raízes procedurais, sem modelo externo.
- **Escala de cor** (`src/components/ShadeScale.tsx`): a rolagem percorre os tons (A3,5 a 0M1) e o dente muda de cor; os tons também são botões. As cores são ilustrativas e o texto avisa que o tom real é definido na avaliação.
- **Agendamento** (`src/components/Booking.tsx`): dia, horário, motivo e nome; monta a mensagem para o WhatsApp. Já no topo da página há os próximos horários livres, que pré-selecionam o formulário.
- Pérolas e dentinhos nas margens que descem, quicam e giram conforme a rolagem (`src/lib/scrollPearls.ts`, canvas 2D que só desenha enquanto há movimento).
- Linha do tempo do atendimento que se preenche com a rolagem, fotos com parallax, botão fixo "Agendar avaliação" no celular.

## Estrutura

```
src/
  App.tsx              composição da página, horário escolhido e efeitos globais
  components/          uma seção por arquivo
  lib/
    agenda.ts          dias úteis, horários e ocupação de exemplo
    shades.ts          tons da escala de cor
    tooth.ts           geometria e luz do dente
    heroTooth.ts       cena do topo     (carregada sob demanda)
    shade3d.ts         dente da escala  (carregado sob demanda)
    scrollPearls.ts    pérolas e dentes que pulam com a rolagem
    scroll.ts          Lenis + GSAP
public/assets/images/  fotos (.webp)
docs/SOURCES.json      autor, página e licença de cada foto
```

## Como editar o conteúdo

- Tratamentos: `ITEMS` em `components/Treatments.tsx`. Etapas do atendimento: `STEPS` em `components/Steps.tsx`.
- Perguntas frequentes: `QA` em `components/Faq.tsx`.
- Endereço, horários e contato são dados de exemplo: troque pelos da clínica (`Footer.tsx`, `Contact.tsx`).
- Agenda: a ocupação em `lib/agenda.ts` (`busy`) é gerada por regra. Numa versão real, troque por dados do sistema da clínica (API ou planilha).
- Cores e fontes: variáveis no topo de `src/styles.css`.
- WhatsApp: os links usam `https://wa.me/?text=...` sem número. Para fixar o número da clínica, use `https://wa.me/55DDDNUMERO?text=...` em `components/Booking.tsx`.

## Acessibilidade e desempenho

- Respeita `prefers-reduced-motion` (sem scroll suave, sem abertura animada).
- Sem WebGL, a seção da escala some e o resto da página continua completo.
- Resolução do 3D limitada (1,5x no desktop, 1,25x no celular). O Three.js fica em um pacote separado e só baixa depois que a página aparece.
- O texto do topo fica oculto até a fonte carregar, para o layout não pular.

## Créditos

Fotos do Unsplash (Unsplash License). Autor e página de cada foto em `docs/SOURCES.json`.
