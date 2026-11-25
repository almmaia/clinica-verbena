/** Agenda: próximos 6 dias úteis a partir de amanhã. A ocupação vem de busy(); troque pelos dados do sistema da clínica. */
export const SLOTS = ['08:30', '10:00', '11:30', '14:00', '15:30', '17:00']

export const dias: Date[] = (() => {
  const out: Date[] = []
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  while (out.length < 6) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d))
  }
  return out
})()

const wd = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
const wdLong = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

/** "qui" */
export const weekday = (d: Date) => wd.format(d).replace('.', '')
/** "26/11" */
export const dayMonth = (d: Date) => `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}`
/** "quinta-feira, 26 de novembro" */
export const longDate = (d: Date) => wdLong.format(d)
/** "08:30" -> "08h30" */
export const hm = (t: string) => t.replace(':', 'h')

/** Horário ocupado. Substitua por dados reais (API ou planilha). */
export const busy = (date: Date, i: number) => (date.getDate() * 7 + i * 3 + date.getMonth()) % 5 === 0

export interface Selection { day: number; time: string | null }

/** Escolhe o dia; mantém o horário se ainda estiver livre, senão pega o primeiro livre. */
export function pick(day: number, time: string | null = null): Selection {
  const free = SLOTS.filter((_, i) => !busy(dias[day], i))
  return { day, time: time && free.includes(time) ? time : (free[0] ?? null) }
}

/** Até três horários livres para mostrar no topo do site. */
export const quickSlots: { day: number; time: string }[] = (() => {
  const out: { day: number; time: string }[] = []
  dias.forEach((d, di) =>
    SLOTS.forEach((t, ti) => {
      if (out.length < 3 && !busy(d, ti) && (ti === 0 || ti === 3 || out.length === 0)) out.push({ day: di, time: t })
    }),
  )
  return out
})()
