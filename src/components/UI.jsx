import { cloneElement, useEffect, useId, useRef } from 'react'

export function Icon({ name = 'grid', size = 20 }) {
  const paths = {
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
    moon: <path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z"/>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    trophy: <><path d="M8 3h8v6a4 4 0 0 1-8 0V3ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 13v7m-4 1h8"/></>,
    people: <><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5v2"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2m-8 3h2"/></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    ticket: <><path d="M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Z"/><path d="M15 5v3m0 3v2m0 3v3"/></>,
    chart: <><path d="M4 3v18h18M8 16v-5m5 5V7m5 9V4"/></>,
    bell: <><path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 3h4"/></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    logout: <><path d="M10 4H4v16h6m4-12 4 4-4 4m-6-4h10"/></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/></>,
    chevron: <path d="m9 5 7 7-7 7"/>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>
}
export function Badge({ children, tone = '' }) { return <span className={`badge ${tone}`}>{children}</span> }
export function Flag({ team, small = false }) { return <span className={`flag ${small ? 'small' : ''} flag-${team?.code}`} style={{ '--flag': team?.color || '#8290a8' }} aria-label={team?.name}>{team?.code || '?'}</span> }
export function Empty({ title = 'No hay resultados', text = 'Probá con otros filtros.' }) { return <div className="empty"><Icon name="search" size={30}/><h3>{title}</h3><p>{text}</p></div> }
export function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null)
  const titleId = useId()
  useEffect(() => { const d = ref.current; d.showModal(); return () => d.close() }, [])
  return <dialog ref={ref} aria-labelledby={titleId} className={wide ? 'wide' : ''} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose() }}><div className="modal-head"><h2 id={titleId}>{title}</h2><button className="icon-button" aria-label="Cerrar" onClick={onClose}><Icon name="close"/></button></div>{children}</dialog>
}
export function Field({ label, children }) { const id = useId(); return <label className="field" htmlFor={id}><span id={`${id}-label`}>{label}</span>{cloneElement(children, { id, 'aria-labelledby': `${id}-label` })}</label> }
export function Stat({ label, value, note, icon, color = '' }) { return <article className="stat"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${color}`}><Icon name={icon}/></span></div><strong>{value}</strong><small>{note}</small></article> }
