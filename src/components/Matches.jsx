import { useState } from 'react'
import { Badge, Empty, Field, Flag, Icon, Modal } from './UI'
import { dateLabel, uid } from '../data'

export function MatchRow({ match, teams, onClick }) {
  const home = teams.find(t => t.id === match.home), away = teams.find(t => t.id === match.away)
  return <button className="match-row" onClick={() => onClick(match)}><span className="match-date"><strong>{dateLabel(match.date)}</strong><small>{match.time} h</small></span><span className="match-teams"><span><Flag team={home} small/>{home?.name}</span><b>{match.status === 'Finalizado' ? match.score.join(' : ') : 'vs'}</b><span><Flag team={away} small/>{away?.name}</span></span><span className="match-venue">{match.stadium}<small>{match.phase}{match.group ? ` · Grupo ${match.group}` : ''}</small></span><Badge tone={match.status === 'Finalizado' ? 'gray' : 'green'}>{match.status}</Badge><Icon name="chevron" size={16}/></button>
}

export default function Matches({ data, matches, setMatches, admin, notify, onBuy, selected, setSelected }) {
  const [scheduledPhase, setScheduledPhase] = useState('')
  const [search, setSearch] = useState(''), [filter, setFilter] = useState('Todos'), [editing, setEditing] = useState(false), [error, setError] = useState('')
  const current = matches.find(m => m.id === selected?.id)
  const home = data.teams.find(t => t.id === current?.home), away = data.teams.find(t => t.id === current?.away)
  const visible = matches.filter(m => (filter === 'Todos' || m.status === filter) && `${data.teams.find(t => t.id === m.home)?.name} ${data.teams.find(t => t.id === m.away)?.name} ${m.stadium} ${m.date}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  function schedule(e) {
    e.preventDefault(); const v = Object.fromEntries(new FormData(e.currentTarget))
    if (v.home === v.away) return setError('Elegí dos selecciones diferentes.')
    const ref = data.referees.find(r => r.name === v.referee)
    if (!ref || ref.available !== 'Disponible') return setError('El árbitro no está disponible.')
    const teams = data.teams.filter(t => [v.home, v.away].includes(t.id))
    if (teams.some(t => t.name === ref.country)) return setError('El árbitro no puede tener la nacionalidad de una selección participante.')
    if (data.phases.find(p => p.name === v.phase)?.type === 'Grupos' && teams.some(t => t.group !== v.group)) return setError('Ambas selecciones deben pertenecer al grupo elegido.')
    const start = Date.parse(`${v.date}T${v.time}`)
    const conflict = matches.some(m => Math.abs(Date.parse(`${m.date}T${m.time}`) - start) < 3 * 60 * 60 * 1000 && (m.stadium === v.stadium || m.referee === v.referee || [m.home, m.away].some(t => [v.home, v.away].includes(t))))
    if (conflict) return setError('Hay un conflicto de estadio, árbitro o selección dentro de las tres horas de este horario.')
    setMatches(prev => [...prev, { ...v, id: uid(), status: 'Programado', score: [0, 0], events: [], stock: 0 }]); setEditing(false); notify('Partido programado. Habilitá el stock desde su detalle.')
  }
  function result(e) {
    e.preventDefault(); const v = Object.fromEntries(new FormData(e.currentTarget))
    setMatches(prev => prev.map(m => m.id === current.id ? { ...m, score: [+v.home, +v.away], status: v.status } : m)); notify('Resultado guardado. Tabla de posiciones actualizada.')
  }
  function event(e) {
    e.preventDefault(); const v = Object.fromEntries(new FormData(e.currentTarget))
    setMatches(prev => prev.map(m => m.id === current.id ? { ...m, events: [...m.events, v] } : m)); e.currentTarget.reset(); notify('Evento agregado al partido.')
  }
  return <>
    <div className="section-toolbar"><div><h2>Fixture y resultados</h2><p>Todos los encuentros, en un solo lugar.</p></div>{admin && <button className="primary" onClick={() => { setEditing(true); setScheduledPhase(''); setError('') }}><Icon name="plus"/>Programar partido</button>}</div>
    <div className="panel"><div className="table-toolbar"><div className="tabs">{['Todos', 'Programado', 'Finalizado'].map(t => <button key={t} className={filter === t ? 'active' : ''} onClick={() => setFilter(t)}>{t}</button>)}</div><label className="search"><Icon name="search"/><input aria-label="Buscar partidos" placeholder="Selección, sede o fecha…" value={search} onChange={e => setSearch(e.target.value)}/></label></div>{visible.map(m => <MatchRow key={m.id} match={m} teams={data.teams} onClick={setSelected}/>)}{!visible.length && <Empty/>}</div>
    {editing && <Modal title="Programar partido" onClose={() => setEditing(false)}><form onSubmit={schedule}><div className="form-grid">{[['home', 'Selección local', data.teams.map(t => [t.id, t.name])], ['away', 'Selección visitante', data.teams.map(t => [t.id, t.name])], ['phase', 'Fase', data.phases.map(t => [t.name, t.name])], ['group', 'Grupo', data.groups.map(t => [t.name, t.name])], ['stadium', 'Estadio', data.stadiums.map(t => [t.name, t.name])], ['referee', 'Árbitro', data.referees.map(t => [t.name, t.name])]].map(([key, label, values]) => <Field label={label} key={key}><select name={key} required={key !== 'group' || data.phases.find(p => p.name === scheduledPhase)?.type === 'Grupos'} onChange={key === 'phase' ? e => setScheduledPhase(e.target.value) : undefined}><option value="">Seleccionar…</option>{values.map(([id, text]) => <option value={id} key={id}>{text}</option>)}</select></Field>)}<Field label="Fecha"><input type="date" name="date" required/></Field><Field label="Horario"><input type="time" name="time" required/></Field></div>{error && <p className="error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="secondary" onClick={() => setEditing(false)}>Cancelar</button><button className="primary">Programar partido</button></div></form></Modal>}
    {current && <Modal title="Detalle del partido" wide onClose={() => setSelected(null)}><div className="match-detail"><div><Flag team={home}/><h3>{home?.name}</h3></div><div><Badge tone="green">{current.status}</Badge><strong>{current.status === 'Finalizado' ? current.score.join(' : ') : current.time}</strong><span>{dateLabel(current.date)}{current.group ? ` · Grupo ${current.group}` : ''}</span></div><div><Flag team={away}/><h3>{away?.name}</h3></div></div><div className="info-strip"><span><Icon name="pin"/>{current.stadium}</span><span><Icon name="shield"/>{current.referee}</span></div>
      <h3>Eventos del encuentro</h3>{current.events.length ? current.events.map((ev, i) => <div className="list-row" key={i}><Badge>{ev.minute}′</Badge><strong>{ev.player}</strong><span>{ev.type}</span></div>) : <p className="muted">Todavía no se registraron eventos.</p>}
      {admin && <><form className="result-form" onSubmit={result}><h3>Registrar resultado</h3><div className="form-grid three"><Field label={home?.name}><input name="home" type="number" min="0" max="99" defaultValue={current.score[0]} required/></Field><Field label={away?.name}><input name="away" type="number" min="0" max="99" defaultValue={current.score[1]} required/></Field><Field label="Estado"><select name="status" defaultValue={current.status}><option>Programado</option><option>Finalizado</option></select></Field></div><button className="secondary">Guardar resultado</button></form>
      <form className="result-form" onSubmit={event}><h3>Agregar evento</h3><div className="form-grid three"><Field label="Jugador"><select name="player" required><option value="">Seleccionar…</option>{data.players.filter(p => [home?.name, away?.name].includes(p.team)).map(p => <option key={p.id}>{p.name}</option>)}</select></Field><Field label="Evento"><select name="type"><option>Gol</option><option>Tarjeta amarilla</option><option>Tarjeta roja</option><option>Jugador destacado</option></select></Field><Field label="Minuto"><input name="minute" type="number" min="0" max="130" required/></Field></div><p className="muted small-text">Los eventos describen el partido. Cargá el marcador final en el formulario de resultado.</p><button className="secondary">Agregar evento</button></form>
      {current.status !== 'Finalizado' && <form className="result-form" onSubmit={e => { e.preventDefault(); const stock = +new FormData(e.currentTarget).get('stock'); setMatches(prev => prev.map(m => m.id === current.id ? { ...m, stock } : m)); notify('Stock disponible actualizado.') }}><Field label="Cupo disponible para venta (hasta 40 asientos de muestra)"><input name="stock" type="number" min="0" max="40" defaultValue={current.stock} required/></Field><button className="secondary">Actualizar stock</button></form>}</>}
      <div className="modal-actions"><button className="secondary" onClick={() => setSelected(null)}>Cerrar</button>{!admin && current.status !== 'Finalizado' && <button className="primary" disabled={!current.stock} onClick={() => { setSelected(null); onBuy(current) }}>Elegir entradas <Icon name="arrow"/></button>}</div>
    </Modal>}
  </>
}
