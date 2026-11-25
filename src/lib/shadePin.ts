import { goY, type ScrollTriggerType as ST } from './scroll'
import { SHADES } from './shades'

/** O ScrollTrigger que prende a seção da escala; usado para saltar a um tom ao tocar no seletor. */
export const shadePin: { st: ST | null } = { st: null }

export function jumpToShade(i: number) {
  const st = shadePin.st
  if (!st) return
  goY(st.start + (i / (SHADES.length - 1)) * (st.end - st.start) + 2, 1.4)
}
