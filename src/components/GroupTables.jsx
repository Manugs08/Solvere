import { Badge, Empty, Flag } from './UI'
import { standings } from '../data'

export default function GroupTables({ groups, teams, matches, admin, onEdit, onDelete }) {
  if (!groups.length) return <Empty title="Sin grupos" text="Creá un grupo para empezar a asignar selecciones."/>
  return <div className="group-tables">{groups.map(group => {
    const rows = standings(teams, matches, group.name)
    return <section className="panel group-panel" key={group.id}>
      <div className="panel-heading"><h2>Grupo {group.name}</h2><Badge>{rows.length} selecciones</Badge></div>
      <div className="table-scroll"><table aria-label={`Posiciones del grupo ${group.name}`} className="standings"><thead><tr><th>#</th><th>Selección</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th></tr></thead><tbody>{rows.map((team, i) => <tr key={team.id}><td>{i + 1}</td><td><span className="team-name"><Flag team={team} small/><strong>{team.name}</strong></span></td><td>{team.played}</td><td>{team.won}</td><td>{team.drawn}</td><td>{team.lost}</td><td>{team.gf}</td><td>{team.ga}</td><td>{team.gf - team.ga}</td><td><strong>{team.points}</strong></td></tr>)}</tbody></table></div>
      {!rows.length && <p className="group-empty">Todavía no hay selecciones. Asignalas desde Selecciones → Editar → Grupo.</p>}
      {admin && <div className="group-actions"><button className="secondary" onClick={() => onEdit(group)}>Editar grupo {group.name}</button><button className="text-button" onClick={() => onDelete(group)}>Eliminar grupo {group.name}</button></div>}
    </section>
  })}</div>
}
