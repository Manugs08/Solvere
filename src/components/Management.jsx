import { useState } from 'react'
import { Badge, Empty, Field, Flag, Icon, Modal } from './UI'
import GroupTables from './GroupTables'
import { groupError } from '../groupRules'
import { uid } from '../data'

const configs = {
  teams: ['Selecciones', 'selección', [['name', 'País'], ['code', 'Código de tres letras'], ['group', 'Grupo', 'groups'], ['coach', 'Director técnico']]],
  players: ['Jugadores convocados', 'jugador', [['name', 'Nombre y apellido'], ['team', 'Selección', 'teams'], ['number', 'Dorsal', 'number'], ['position', 'Posición', ['Arquero', 'Defensor', 'Mediocampista', 'Delantero']], ['weight', 'Peso (kg)', 'number'], ['birthDate', 'Fecha de nacimiento', 'date'], ['height', 'Altura (cm)', 'number']]],
  staff: ['Cuerpos técnicos', 'integrante', [['name', 'Nombre y apellido'], ['team', 'Selección', 'teams'], ['position', 'Cargo']]],
  referees: ['Árbitros', 'árbitro', [['name', 'Nombre y apellido'], ['country', 'Nacionalidad'], ['history', 'Antecedentes'], ['available', 'Disponibilidad', ['Disponible', 'No disponible']]]],
  cities: ['Sedes y ciudades', 'sede', [['name', 'Ciudad'], ['country', 'País'], ['location', 'Ubicación']]],
  stadiums: ['Estadios', 'estadio', [['name', 'Nombre'], ['city', 'Ciudad', 'cities'], ['capacity', 'Capacidad', 'number'], ['sectors', 'Sectores'], ['rows', 'Filas por sector', 'number'], ['seats', 'Asientos por fila', 'number']]],
  tournaments: ['Torneos', 'torneo', [['name', 'Nombre'], ['year', 'Año', 'number'], ['count', 'Cantidad de selecciones', 'number'], ['groupCapacity', 'Máximo de equipos por grupo', 'number'], ['format', 'Formato', ['Grupos y eliminación directa', 'Eliminación directa']]]],
  phases: ['Fases del torneo', 'fase', [['name', 'Nombre'], ['type', 'Tipo', ['Grupos', 'Eliminación directa']], ['rule', 'Reglas de clasificación'], ['count', 'Cantidad de partidos', 'number']]],
  groups: ['Grupos', 'grupo', [['name', 'Nombre del grupo']]],
  users: ['Usuarios y roles', 'usuario', [['name', 'Nombre y apellido'], ['email', 'Correo electrónico', 'email'], ['role', 'Rol', ['Usuario registrado', 'Administrador FIFA']]]],
}

export default function Management({ kind, data, setData, matches, setMatches, admin, notify, activeTournamentId, onSelectTournament }) {
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')
  const [title, singular, fields] = configs[kind]
  const tournament = data.tournaments.find(t => t.id === activeTournamentId)
  const groupOptional = kind === 'teams' && data.tournaments.find(t => t.id === activeTournamentId)?.format === 'Eliminación directa'
  const visibleFields = kind === 'players' ? fields : fields.slice(0, 4)
  const displayValue = (row, key) => key === 'birthDate' && row[key] ? new Date(row[key] + 'T12:00:00').toLocaleDateString('es-AR') : row[key]
  const rows = data[kind].filter(row => Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()))
  const open = (row = {}) => { setError(''); setEditor(kind === 'tournaments' ? { groupCapacity: '4', ...row } : row) }
  const options = type => Array.isArray(type) ? type : data[type]?.map(row => row.name)
  function save(e) {
    e.preventDefault()
    const values = Object.fromEntries([...new FormData(e.currentTarget)].map(([k,v]) => [k,v.trim()]))
    if (Object.entries(values).some(([key, v]) => !(groupOptional && key === 'group') && !v.trim())) return setError('Completá todos los campos con un valor válido.')
    if (data[kind].some(row => row.id !== editor.id && row.name.toLowerCase() === values.name.trim().toLowerCase())) return setError('Ya existe un registro con ese nombre.')
    if (kind === 'users' && data.users.some(u => u.id !== editor.id && u.email.toLowerCase() === values.email.toLowerCase())) return setError('Ese correo ya está registrado.')
    if (kind === 'teams' && !/^[a-zA-Z]{3}$/.test(values.code)) return setError('El código debe tener tres letras.')
    if (kind === 'players') {
      if (Number(values.weight) <= 0 || Number(values.weight) > 250 || Number(values.height) < 100 || Number(values.height) > 250) return setError('Revisá el peso (hasta 250 kg) y la altura (100 a 250 cm).')
      if (values.birthDate > new Date().toLocaleDateString('en-CA')) return setError('La fecha de nacimiento no puede estar en el futuro.')
      if (data.players.some(p => p.id !== editor.id && p.team === values.team && Number(p.number) === Number(values.number))) return setError('Ese dorsal ya está asignado en la selección.')
    }
    if (kind === 'tournaments' && (Number(values.count) < 2 || Number(values.count) > 64 || !Number.isInteger(Number(values.count)))) return setError('Ingresá entre 2 y 64 selecciones.')
    if (kind === 'tournaments') {
      const capacity = Number(values.groupCapacity)
      if (values.format === 'Grupos y eliminación directa' && (!Number.isInteger(capacity) || capacity < 2 || capacity > 32 || Number(values.count) % capacity !== 0)) return setError('El máximo por grupo debe ser de 2 a 32 y dividir exactamente la cantidad de selecciones para formar grupos iguales.')
      if (editor.id && ['count', 'format', 'groupCapacity'].some(k => String(values[k]) !== String(editor[k]))) return setError('La estructura de una edición creada se conserva. Creá otro torneo para cambiar el formato o los cupos.')
    }
    if (kind === 'groups' && !editor.id) {
      if (tournament.format !== 'Grupos y eliminación directa') return setError('Este torneo es de eliminación directa y no utiliza grupos.')
      const limit = Number(tournament.count) / Number(tournament.groupCapacity || 4)
      if (data.groups.length >= limit) return setError(`Este torneo admite ${limit} grupos de ${tournament.groupCapacity || 4} selecciones.`)
    }
    if (kind === 'teams') {
      const candidates = [...data.teams.filter(t => t.id !== editor.id), values]
      const problem = groupError(candidates, data.groups, tournament)
      if (problem) return setError(problem)
      if (candidates.length > Number(tournament.count)) return setError('Ya se alcanzó la cantidad de selecciones del torneo.')
    }
    if (kind === 'staff' && editor.teamId && (values.team !== editor.team || values.position !== editor.position)) return setError('El director técnico está vinculado a su selección. Modificá la selección para cambiarlo.')
    const record = { ...editor, ...values, id: editor.id || uid() }
    if (kind === 'teams') record.code = record.code.toUpperCase()
    setData(prev => {
      const next = { ...prev, [kind]: editor.id ? prev[kind].map(row => row.id === editor.id ? record : row) : [...prev[kind], record] }
      if (editor.id && editor.name !== record.name) {
        if (kind === 'teams') {
          next.players = prev.players.map(p => p.team === editor.name ? { ...p, team: record.name } : p)
          next.staff = prev.staff.map(p => p.team === editor.name ? { ...p, team: record.name } : p)
        }
        if (kind === 'cities') next.stadiums = prev.stadiums.map(s => s.city === editor.name ? { ...s, city: record.name } : s)
        if (kind === 'groups') next.teams = prev.teams.map(t => t.group === editor.name ? { ...t, group: record.name } : t)
      }
      if (kind === 'teams') {
        const coach = next.staff.find(p => p.teamId === record.id || (p.team === record.name && p.position === 'Director técnico'))
        const member = { id: coach?.id || uid(), teamId: record.id, name: record.coach, team: record.name, position: 'Director técnico' }
        next.staff = coach ? next.staff.map(p => p.id === coach.id ? member : p) : [...next.staff, member]
      }
      if (kind === 'staff' && record.teamId) next.teams = prev.teams.map(t => t.id === record.teamId ? { ...t, coach: record.name } : t)
      return next
    })
    const matchField = { referees: 'referee', stadiums: 'stadium', groups: 'group', phases: 'phase' }[kind]
    if (editor.id && matchField && editor.name !== record.name) setMatches(prev => prev.map(m => m[matchField] === editor.name ? { ...m, [matchField]: record.name } : m))
    setEditor(null); notify('Cambios guardados en la demostración.')
  }
  function remove() {
    const row = deleting
    if (kind === 'tournaments' && row.id === activeTournamentId) { setDeleting(null); notify('No se puede eliminar el torneo activo. Elegí otra edición primero.'); return }
    if (kind === 'users' && ['u1', 'u2', 'u3'].includes(row.id)) { setDeleting(null); notify('Las tres cuentas base se conservan para recorrer la demostración.'); return }
    if (kind === 'groups') { setDeleting(null); notify('Los grupos se conservan para respetar la distribución del torneo. Podés editar sus nombres.'); return }
    if (kind === 'staff' && row.teamId) { setDeleting(null); notify('Editá el director técnico desde su selección para reemplazarlo.'); return }
    if (kind === 'teams') {
      const problem = groupError(data.teams.filter(t => t.id !== row.id), data.groups, tournament)
      if (problem) { setDeleting(null); notify(problem); return }
    }
    const linked = kind === 'referees' ? matches.some(m => m.referee === row.name && m.status !== 'Finalizado') : kind === 'teams' ? matches.some(m => [m.home, m.away].includes(row.id)) || data.players.some(p => p.team === row.name) : kind === 'stadiums' ? matches.some(m => m.stadium === row.name) : kind === 'cities' ? data.stadiums.some(s => s.city === row.name) : kind === 'groups' ? data.teams.some(t => t.group === row.name) : kind === 'phases' ? matches.some(m => m.phase === row.name) : false
    if (linked) { setDeleting(null); notify('No se puede eliminar: tiene registros o partidos asociados.'); return }
    setData(prev => ({ ...prev, [kind]: prev[kind].filter(r => r.id !== row.id), ...(kind === 'teams' ? { staff: prev.staff.filter(p => p.team !== row.name) } : {}) })); setDeleting(null); notify('Registro eliminado.')
  }
  return <>
    <div className="section-toolbar"><div><h2>{title}</h2><p>{data[kind].length} registros en esta edición</p></div>{admin && (kind !== 'groups' || tournament.format === 'Grupos y eliminación directa') && <button className="primary" onClick={() => open()}><Icon name="plus"/>Agregar {singular}</button>}</div>
    <div className="panel">{kind === 'groups' && tournament.format === 'Grupos y eliminación directa' && <p className="group-empty">Creá {Number(tournament.count) / Number(tournament.groupCapacity || 4)} grupos de {tournament.groupCapacity || 4} selecciones antes de cargar los equipos. Grupos creados: {data.groups.length}.</p>}<div className="table-toolbar"><label className="search"><Icon name="search"/><input aria-label={`Buscar ${title.toLowerCase()}`} placeholder={`Buscar ${title.toLowerCase()}…`} value={search} onChange={e => setSearch(e.target.value)}/></label><Badge>{rows.length} resultados</Badge></div>
    {kind === 'groups' ? <GroupTables groups={rows} teams={data.teams} matches={matches} admin={admin} onEdit={open} capacity={tournament.groupCapacity || 4}/> : kind === 'teams' ? <div className="teams-grid">{rows.map(row => <article className="team-card" key={row.id}><div className="spread"><Flag team={row}/><Badge>{row.group ? `Grupo ${row.group}` : 'Eliminación directa'}</Badge></div><h3>{row.name}</h3><p>{row.coach}</p><div className="team-card-bottom"><span>{data.players.filter(p => p.team === row.name).length} convocados</span><button className="text-button" onClick={() => setDetails(row)}>Ver selección <Icon name="arrow" size={16}/></button></div>{admin && <div className="row-actions"><button onClick={() => open(row)}>Editar</button><button onClick={() => setDeleting(row)}>Eliminar</button></div>}</article>)}</div> : <div className="table-scroll"><table><thead><tr>{visibleFields.map(([key, label]) => <th key={key}>{label}</th>)}<th>Acciones</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}>{visibleFields.map(([key], i) => <td key={key}>{i === 0 ? <strong>{displayValue(row, key)}</strong> : displayValue(row, key)}</td>)}<td><div className="row-actions">{kind === 'tournaments' && <button disabled={row.id === activeTournamentId} onClick={() => onSelectTournament(row.id)}>{row.id === activeTournamentId ? 'Torneo activo' : admin ? 'Administrar' : 'Consultar torneo'}</button>}<button onClick={() => setDetails(row)}>Ver</button>{admin && <><button onClick={() => open(row)}>Editar</button><button onClick={() => setDeleting(row)}>Eliminar</button></>}</div></td></tr>)}</tbody></table></div>}{rows.length === 0 && kind !== 'groups' && <Empty/>}</div>
    {editor && <Modal title={`${editor.id ? 'Editar' : 'Agregar'} ${singular}`} onClose={() => setEditor(null)}><form onSubmit={save}>{kind === 'tournaments' && !editor.id && <p className="notice">La nueva edición comienza sin grupos, selecciones ni partidos. Creá los grupos desde Torneo → Grupos. Después de guardarla, elegila en el selector de torneo para administrarla.</p>}<p className="muted">{kind === 'teams' && !groupOptional ? `Creá primero todos los grupos desde Torneo → Grupos. Máximo ${tournament.groupCapacity || 4} equipos por grupo. Cargá primero los grupos con menos selecciones.` : kind === 'tournaments' ? 'El cupo por grupo se aplica al formato con grupos. La estructura queda fijada al crear la edición.' : ''}</p><div className="form-grid">{fields.map(([key, label, type]) => <Field label={label} key={key}>{options(type) ? <select name={key} defaultValue={editor[key] || ''} required={!(groupOptional && key === 'group')}><option value="" disabled={!(groupOptional && key === 'group')}>{groupOptional && key === 'group' ? 'Sin grupo' : 'Seleccionar…'}</option>{options(type).map(v => <option key={v}>{v}</option>)}</select> : <input readOnly={kind === 'users' && key === 'email' && Boolean(editor.id)} name={key} type={type || 'text'} min={key === 'height' ? 100 : key === 'weight' ? 0.1 : type === 'number' ? 1 : undefined} step={key === 'weight' || key === 'height' ? '0.1' : undefined} max={key === 'number' ? 99 : key === 'height' || key === 'weight' ? 250 : key === 'birthDate' ? new Date().toLocaleDateString('en-CA') : undefined} defaultValue={editor[key] || ''} required/>}</Field>)}</div>{error && <p className="error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="secondary" onClick={() => setEditor(null)}>Cancelar</button><button className="primary">Guardar {singular}</button></div></form></Modal>}
    {deleting && <Modal title={`Eliminar ${singular}`} onClose={() => setDeleting(null)}><p>¿Querés eliminar a <strong>{deleting.name}</strong> de esta demostración?</p><div className="modal-actions"><button className="secondary" onClick={() => setDeleting(null)}>Cancelar</button><button className="danger" onClick={remove}>Eliminar</button></div></Modal>}
    {details && <Modal title={details.name} onClose={() => setDetails(null)}><dl className="details">{fields.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{displayValue(details, key)}</dd></div>)}</dl>{kind === 'teams' && <><h3>Jugadores convocados</h3>{data.players.filter(p => p.team === details.name).map(p => <div className="list-row" key={p.id}><strong>#{p.number} · {p.name}</strong><span>{p.position}</span></div>)}{!data.players.some(p => p.team === details.name) && <p>Aún no hay jugadores cargados.</p>}<h3>Cuerpo técnico</h3>{data.staff.filter(p => p.team === details.name).map(p => <p key={p.id}>{p.name} · {p.position}</p>)}</>}{kind === 'groups' && <p>Selecciones: {data.teams.filter(t => t.group === details.name).map(t => t.name).join(', ') || 'Sin asignar'}. Las asignaciones se editan en Selecciones.</p>}<div className="modal-actions"><button className="primary" onClick={() => setDetails(null)}>Listo</button></div></Modal>}
  </>
}

