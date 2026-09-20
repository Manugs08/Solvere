// Toda la información de esta edición es ficticia y sirve para recorrer el prototipo.
export const teams = [
  { id: 'arg', name: 'Argentina', code: 'ARG', group: 'A', coach: 'Martín Suárez', color: '#8ccbe8' },
  { id: 'mex', name: 'México', code: 'MEX', group: 'A', coach: 'Diego Herrera', color: '#368b67' },
  { id: 'jpn', name: 'Japón', code: 'JPN', group: 'A', coach: 'Kenji Mori', color: '#dd6473' },
  { id: 'den', name: 'Dinamarca', code: 'DEN', group: 'A', coach: 'Erik Nielsen', color: '#bd4159' },
  { id: 'bra', name: 'Brasil', code: 'BRA', group: 'B', coach: 'Pedro Costa', color: '#e8c33c' },
  { id: 'fra', name: 'Francia', code: 'FRA', group: 'B', coach: 'Louis Martin', color: '#5b79cd' },
  { id: 'mar', name: 'Marruecos', code: 'MAR', group: 'B', coach: 'Amir Saïd', color: '#bd6056' },
  { id: 'can', name: 'Canadá', code: 'CAN', group: 'B', coach: 'Oliver Roy', color: '#e36363' },
]
export const initialData = {
  teams,
  tournaments: [{ id: 't1', name: 'Copa Mundial 2026', year: '2026', count: '8', format: 'Grupos y eliminación directa' }],
  phases: [{ id: 'f1', name: 'Fase de grupos', type: 'Grupos', rule: 'Primeros 2 de cada grupo', count: '12' }, { id: 'f2', name: 'Semifinal', type: 'Eliminación directa', rule: 'Ganador del partido', count: '2' }, { id: 'f3', name: 'Final', type: 'Eliminación directa', rule: 'Ganador del partido', count: '1' }],
  groups: [{ id: 'g1', name: 'A' }, { id: 'g2', name: 'B' }],
  cities: [{ id: 'c1', name: 'Ciudad de México', country: 'México', location: 'Zona central' }, { id: 'c2', name: 'Miami', country: 'Estados Unidos', location: 'Florida' }, { id: 'c3', name: 'Toronto', country: 'Canadá', location: 'Ontario' }],
  stadiums: [{ id: 's1', name: 'Estadio Capital', city: 'Ciudad de México', capacity: '72000', sectors: 'Norte, Sur, Preferencial', rows: '20', seats: '40' }, { id: 's2', name: 'Arena del Sol', city: 'Miami', capacity: '64000', sectors: 'Norte, Sur, Preferencial', rows: '20', seats: '40' }, { id: 's3', name: 'Estadio del Lago', city: 'Toronto', capacity: '45000', sectors: 'Norte, Sur, Preferencial', rows: '20', seats: '40' }],
  players: [{ id: 'p1', name: 'Tomás Álvarez', team: 'Argentina', number: '10', position: 'Delantero', info: 'Club del Sur' }, { id: 'p2', name: 'Nicolás Fernández', team: 'Argentina', number: '1', position: 'Arquero', info: 'Club Central' }, { id: 'p3', name: 'Mateo López', team: 'México', number: '9', position: 'Delantero', info: 'Deportivo Capital' }, { id: 'p4', name: 'Lucas Silva', team: 'Brasil', number: '7', position: 'Delantero', info: 'Atlético del Este' }],
  staff: [{ id: 'ct1', name: 'Martín Suárez', team: 'Argentina', position: 'Director técnico' }, { id: 'ct2', name: 'Diego Herrera', team: 'México', position: 'Director técnico' }],
  referees: [{ id: 'r1', name: 'Marco Rossi', country: 'Italia', history: 'Internacional · 8 años', available: 'Disponible' }, { id: 'r2', name: 'Clara Weber', country: 'Alemania', history: 'Internacional · 6 años', available: 'Disponible' }, { id: 'r3', name: 'Ana Pereira', country: 'Portugal', history: 'Internacional · 5 años', available: 'Disponible' }],
  users: [{ id: 'u1', name: 'Manuel González', email: 'manuel@demo.test', role: 'Usuario registrado' }, { id: 'u2', name: 'Luciana Gómez', email: 'luciana@demo.test', role: 'Usuario registrado' }, { id: 'u3', name: 'Catalina Marquevich', email: 'admin@demo.test', role: 'Administrador FIFA' }],
}
export const initialMatches = [
  { id: 'm1', home: 'arg', away: 'mex', date: '2026-06-18', time: '18:00', stadium: 'Estadio Capital', phase: 'Fase de grupos', group: 'A', referee: 'Marco Rossi', status: 'Programado', stock: 40, score: [0, 0], events: [] },
  { id: 'm2', home: 'bra', away: 'fra', date: '2026-06-18', time: '21:00', stadium: 'Arena del Sol', phase: 'Fase de grupos', group: 'B', referee: 'Clara Weber', status: 'Programado', stock: 40, score: [0, 0], events: [] },
  { id: 'm3', home: 'jpn', away: 'den', date: '2026-06-19', time: '16:00', stadium: 'Estadio del Lago', phase: 'Fase de grupos', group: 'A', referee: 'Ana Pereira', status: 'Programado', stock: 40, score: [0, 0], events: [] },
  { id: 'm4', home: 'arg', away: 'jpn', date: '2026-06-12', time: '18:00', stadium: 'Estadio Capital', phase: 'Fase de grupos', group: 'A', referee: 'Marco Rossi', status: 'Finalizado', stock: 0, score: [2, 0], events: [{ player: 'Tomás Álvarez', type: 'Gol', minute: '24' }, { player: 'Tomás Álvarez', type: 'Gol', minute: '68' }] },
  { id: 'm5', home: 'mex', away: 'den', date: '2026-06-13', time: '16:00', stadium: 'Arena del Sol', phase: 'Fase de grupos', group: 'A', referee: 'Clara Weber', status: 'Finalizado', stock: 0, score: [1, 1], events: [] },
  { id: 'm6', home: 'bra', away: 'can', date: '2026-06-14', time: '18:00', stadium: 'Estadio del Lago', phase: 'Fase de grupos', group: 'B', referee: 'Ana Pereira', status: 'Finalizado', stock: 0, score: [3, 0], events: [] },
]
export const uid = () => crypto.randomUUID()
export const money = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
export const dateLabel = (date) => new Date(date + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
export function standings(teams, matches, group) {
  return teams.filter(t => t.group === group).map(t => {
    const row = { ...t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }
    matches.filter(m => m.phase === 'Fase de grupos' && m.group === group && m.status === 'Finalizado' && [m.home, m.away].includes(t.id)).forEach(m => {
      const own = m.score[m.home === t.id ? 0 : 1], other = m.score[m.home === t.id ? 1 : 0]
      row.played++; row.gf += own; row.ga += other
      if (own > other) { row.won++; row.points += 3 } else if (own === other) { row.drawn++; row.points++ } else row.lost++
    })
    return row
  }).sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || a.name.localeCompare(b.name))
}
