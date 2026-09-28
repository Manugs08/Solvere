export function groupError(teams, groups, tournament, complete = false) {
  if (tournament.format !== 'Grupos y eliminación directa') return ''
  const capacity = Number(tournament.groupCapacity || 4)
  const requiredGroups = Number(tournament.count) / capacity
  if (groups.length !== requiredGroups) return `Creá los ${requiredGroups} grupos del torneo antes de cargar selecciones o programar partidos.`
  const sizes = groups.map(g => teams.filter(t => t.group === g.name).length)
  if (teams.some(t => !groups.some(g => g.name === t.group))) return 'Elegí un grupo válido.'
  if (sizes.some(n => n > capacity)) return `El grupo está completo: admite como máximo ${capacity} selecciones.`
  if (sizes.length && Math.max(...sizes) - Math.min(...sizes) > 1) return 'Los grupos deben mantenerse equilibrados. Elegí uno con menos selecciones.'
  if (complete && (!sizes.length || sizes.some(n => n !== capacity))) return 'Completá todos los grupos con la misma cantidad de selecciones antes de programar partidos.'
  return ''
}
