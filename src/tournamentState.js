import { initialData, initialMatches } from './data'

export function emptyEdition(tournament) {
  const grouped = tournament.format === 'Grupos y eliminación directa'
  return {
    data: {
      teams: [], players: [], staff: [], cities: [], stadiums: [], referees: [],
      groups: grouped ? Array.from({ length: Math.ceil(Number(tournament.count) / 4) }, (_, i) => ({ id: `${tournament.id}-g${i}`, name: String.fromCharCode(65 + i) })) : [],
      phases: grouped ? [{ id: `${tournament.id}-phase`, name: 'Fase de grupos', type: 'Grupos', rule: 'Primeros 2 de cada grupo', count: '0' }] : [{ id: `${tournament.id}-phase`, name: 'Final', type: 'Eliminación directa', rule: 'Ganador del partido', count: '1' }],
    },
    matches: [], tickets: [], notifications: [],
  }
}

export function initialTournamentState() {
  const { tournaments, users, ...data } = structuredClone(initialData)
  return { activeId: tournaments[0].id, tournaments, users, editions: {
    [tournaments[0].id]: { data, matches: structuredClone(initialMatches), tickets: [], notifications: [] },
  } }
}

export function updateEditionData(state, id, update) {
  const edition = state.editions[id]
  const previous = { ...edition.data, tournaments: state.tournaments, users: state.users }
  const next = typeof update === 'function' ? update(previous) : update
  const { tournaments, users, ...data } = next
  const editions = { ...state.editions, [id]: { ...edition, data } }
  for (const tournament of tournaments) editions[tournament.id] ??= emptyEdition(tournament)
  for (const key of Object.keys(editions)) if (!tournaments.some(t => t.id === key)) delete editions[key]
  return { ...state, tournaments, users, editions, activeId: tournaments.some(t => t.id === state.activeId) ? state.activeId : tournaments[0].id }
}
