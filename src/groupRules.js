export function groupError(teams, groups, tournament, complete = false, previousTeams = []) {
  if (tournament.format !== 'Grupos y eliminación directa') return ''
  const capacity = Number(tournament.groupCapacity || 4)
  const requiredGroups = Number(tournament.count) / capacity
  if (groups.length !== requiredGroups) return `Creá los ${requiredGroups} grupos del torneo antes de cargar selecciones o programar partidos.`
  const sizes = groups.map(g => teams.filter(t => t.group === g.name).length)
  if (teams.some(t => !groups.some(g => g.name === t.group))) return 'Elegí un grupo válido.'
  if (sizes.some(n => n > capacity)) return `El grupo está completo: admite como máximo ${capacity} selecciones.`
  const previousSizes = groups.map(g => previousTeams.filter(t => t.group === g.name).length)
  const added = sizes.map((n, i) => n - previousSizes[i])
  // Loading the least populated group must work even with several empty groups.
  const fillsSmallest = added.filter(n => n > 0).length === 1 && added.every((n, i) => n <= 0 || (n === 1 && previousSizes[i] === Math.min(...previousSizes)))
  const removesLargest = added.filter(n => n < 0).length === 1 && added.every((n, i) => n >= 0 || (n === -1 && previousSizes[i] === Math.max(...previousSizes)))
  const unchanged = added.every(n => n === 0)
  const balancing = (fillsSmallest && added.every(n => n >= 0)) || (removesLargest && added.every(n => n <= 0)) || (fillsSmallest && removesLargest)
  if (sizes.length && Math.max(...sizes) - Math.min(...sizes) > 1 && (complete || (!balancing && !unchanged))) return 'Los grupos deben mantenerse equilibrados. Elegí uno con menos selecciones.'
  if (complete && (!sizes.length || sizes.some(n => n !== capacity))) return 'Completá todos los grupos con la misma cantidad de selecciones antes de programar partidos.'
  return ''
}
