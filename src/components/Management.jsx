import { useState } from 'react'
import { Badge, Empty, Field, Flag, Icon, Modal } from './UI'
import { uid } from '../data'

const configs = {
  teams: ['Selecciones', 'selección', [['name', 'País'], ['code', 'Código de tres letras'], ['group', 'Grupo', 'groups'], ['coach', 'Director técnico']]],
  players: ['Jugadores convocados', 'jugador', [['name', 'Nombre y apellido'], ['team', 'Selección', 'teams'], ['number', 'Dorsal', 'number'], ['position', 'Posición', ['Arquero', 'Defensor', 'Mediocampista', 'Delantero']], ['info', 'Datos deportivos']]],
  staff: ['Cuerpos técnicos', 'integrante', [['name', 'Nombre y apellido'], ['team', 'Selección', 'teams'], ['position', 'Cargo']]],
  referees: ['Árbitros', 'árbitro', [['name', 'Nombre y apellido'], ['country', 'Nacionalidad'], ['history', 'Antecedentes'], ['available', 'Disponibilidad', ['Disponible', 'No disponible']]]],
  cities: ['Sedes y ciudades', 'sede', [['name', 'Ciudad'], ['country', 'País'], ['location', 'Ubicación']]],
  stadiums: ['Estadios', 'estadio', [['name', 'Nombre'], ['city', 'Ciudad', 'cities'], ['capacity', 'Capacidad', 'number'], ['sectors', 'Sectores'], ['rows', 'Filas por sector', 'number'], ['seats', 'Asientos por fila', 'number']]],
  tournaments: ['Torneos', 'torneo', [['name', 'Nombre'], ['year', 'Año', 'number'], ['count', 'Cantidad de selecciones', 'number'], ['format', 'Formato', ['Grupos y eliminación directa', 'Eliminación directa']]]],
  phases: ['Fases del torneo', 'fase', [['name', 'Nombre'], ['type', 'Tipo', ['Grupos', 'Eliminación directa']], ['rule', 'Reglas de clasificación'], ['count', 'Cantidad de partidos', 'number']]],
  groups: ['Grupos', 'grupo', [['name', 'Nombre del grupo']]],
  users: ['Usuarios y roles', 'usuario', [['name', 'Nombre y apellido'], ['email', 'Correo electrónico', 'email'], ['role', 'Rol', ['Usuario registrado', 'Administrador FIFA']]]],
}

export default function Management({ kind, data, setData, matches, setMatches, admin, notify }) {
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')
  const [title, singular, fields] = configs[kind]
  const rows = data[kind].filter(row => Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase()))
  const open = (row = {}) => { setError(''); setEditor(row) }
  const options = type => Array.isArray(type) ? type : data[type]?.map(row => row.name)
  function save(e) {
    e.preventDefault()
    const values = Object.fromEntries(new FormData(e.currentTarget))
    if (Object.values(values).some(v => !v.trim())) return setError('Completá todos los campos con un valor válido.')
    if (data[kind].some(row => row.id !== editor.id && row.name.toLowerCase() === values.name.trim().toLowerCase())) return setError('Ya existe un registro con ese nombre.')
    if (kind === 'users' && data.users.some(u => u.id !== editor.id && u.email.toLowerCase() === values.email.toLowerCase())) return setError('Ese correo ya está registrado.')
    if (kind === 'teams' && !/^[a-zA-Z]{3}$/.test(values.code)) return setError('El código debe tener tres letras.')
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
      return next
    })
    const matchField = { referees: 'referee', stadiums: 'stadium', groups: 'group', phases: 'phase' }[kind]
    if (editor.id && matchField && editor.name !== record.name) setMatches(prev => prev.map(m => m[matchField] === editor.name ? { ...m, [matchField]: record.name } : m))
    setEditor(null); notify('Cambios guardados en la demostración.')
  }
  function remove() {
    const row = deleting
    if (kind === 'users' && ['u1', 'u2', 'u3'].includes(row.id)) { setDeleting(null); notify('Las tres cuentas base se conservan para recorrer la demostración.'); return }
    const linked = kind === 'referees' ? matches.some(m => m.referee === row.name && m.status !== 'Finalizado') : kind === 'teams' ? matches.some(m => [m.home, m.away].includes(row.id)) || data.players.some(p => p.team === row.name) : kind === 'stadiums' ? matches.some(m => m.stadium === row.name) : kind === 'cities' ? data.stadiums.some(s => s.city === row.name) : kind === 'groups' ? data.teams.some(t => t.group === row.name) : kind === 'phases' ? matches.some(m => m.phase === row.name) : false
    if (linked) { setDeleting(null); notify('No se puede eliminar: tiene registros o partidos asociados.'); return }
    setData(prev => ({ ...prev, [kind]: prev[kind].filter(r => r.id !== row.id) })); setDeleting(null); notify('Registro eliminado.')
  }
  return <>
    <div className="section-toolbar"><div><h2>{title}</h2><p>{data[kind].length} registros en esta edición</p></div>{admin && <button className="primary" onClick={() => open()}><Icon name="plus"/>Agregar {singular}</button>}</div>
    <div className="panel"><div className="table-toolbar"><label className="search"><Icon name="search"/><input aria-label={`Buscar ${title.toLowerCase()}`} placeholder={`Buscar ${title.toLowerCase()}…`} value={search} onChange={e => setSearch(e.target.value)}/></label><Badge>{rows.length} resultados</Badge></div>
    {kind === 'teams' ? <div className="teams-grid">{rows.map(row => <article className="team-card" key={row.id}><div className="spread"><Flag team={row}/><Badge>Grupo {row.group}</Badge></div><h3>{row.name}</h3><p>{row.coach}</p><div className="team-card-bottom"><span>{data.players.filter(p => p.team === row.name).length} convocados</span><button className="text-button" onClick={() => setDetails(row)}>Ver selección <Icon name="arrow" size={16}/></button></div>{admin && <div className="row-actions"><button onClick={() => open(row)}>Editar</button><button onClick={() => setDeleting(row)}>Eliminar</button></div>}</article>)}</div> : <div className="table-scroll"><table><thead><tr>{fields.slice(0, 4).map(([key, label]) => <th key={key}>{label}</th>)}<th>Acciones</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}>{fields.slice(0, 4).map(([key], i) => <td key={key}>{i === 0 ? <strong>{row[key]}</strong> : row[key]}</td>)}<td><div className="row-actions"><button onClick={() => setDetails(row)}>Ver</button>{admin && <><button onClick={() => open(row)}>Editar</button><button onClick={() => setDeleting(row)}>Eliminar</button></>}</div></td></tr>)}</tbody></table></div>}{rows.length === 0 && <Empty/>}</div>
    {editor && <Modal title={`${editor.id ? 'Editar' : 'Agregar'} ${singular}`} onClose={() => setEditor(null)}><form onSubmit={save}><div className="form-grid">{fields.map(([key, label, type]) => <Field label={label} key={key}>{options(type) ? <select name={key} defaultValue={editor[key] || ''} required><option value="" disabled>Seleccionar…</option>{options(type).map(v => <option key={v}>{v}</option>)}</select> : <input readOnly={kind === 'users' && key === 'email' && Boolean(editor.id)} name={key} type={type || 'text'} min={key === 'number' ? 1 : 1} max={key === 'number' ? 99 : undefined} defaultValue={editor[key] || ''} required/>}</Field>)}</div>{error && <p className="error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="secondary" onClick={() => setEditor(null)}>Cancelar</button><button className="primary">Guardar {singular}</button></div></form></Modal>}
    {deleting && <Modal title={`Eliminar ${singular}`} onClose={() => setDeleting(null)}><p>¿Querés eliminar a <strong>{deleting.name}</strong> de esta demostración?</p><div className="modal-actions"><button className="secondary" onClick={() => setDeleting(null)}>Cancelar</button><button className="danger" onClick={remove}>Eliminar</button></div></Modal>}
    {details && <Modal title={details.name} onClose={() => setDetails(null)}><dl className="details">{fields.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{details[key]}</dd></div>)}</dl>{kind === 'teams' && <><h3>Jugadores convocados</h3>{data.players.filter(p => p.team === details.name).map(p => <div className="list-row" key={p.id}><strong>#{p.number} · {p.name}</strong><span>{p.position}</span></div>)}{!data.players.some(p => p.team === details.name) && <p>Aún no hay jugadores cargados.</p>}<h3>Cuerpo técnico</h3>{data.staff.filter(p => p.team === details.name).map(p => <p key={p.id}>{p.name} · {p.position}</p>)}</>}{kind === 'groups' && <p>Selecciones: {data.teams.filter(t => t.group === details.name).map(t => t.name).join(', ') || 'Sin asignar'}. Las asignaciones se editan en Selecciones.</p>}<div className="modal-actions"><button className="primary" onClick={() => setDetails(null)}>Listo</button></div></Modal>}
  </>
}

