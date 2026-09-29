import { useState } from 'react'
import { Badge, Field, Icon, Modal } from './UI'
import { dateLabel, money, uid } from '../data'
import { sendPurchaseEmail } from '../emailNotifications'

export default function TicketFlow({ match, data, tickets, profile, onClose, onComplete }) {
  const [step, setStep] = useState(1), [sector, setSector] = useState('Norte'), [seats, setSeats] = useState([]), [error, setError] = useState(''), [method, setMethod] = useState('Tarjeta de demostración')
  const price = sector === 'Preferencial' ? 180 : 95
  const home = data.teams.find(t => t.id === match.home), away = data.teams.find(t => t.id === match.away)
  const busy = tickets.filter(t => t.matchId === match.id && t.sector === sector).map(t => t.seat)
  const selectSeat = seat => { setError(''); setSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : prev.length < Math.min(4, match.stock) ? [...prev, seat] : prev) }
  function pay() {
    if (seats.some(s => busy.includes(s)) || seats.length > match.stock) { setError('La disponibilidad cambió. Volvé a seleccionar asientos.'); return }
    const orderCode = `SOL-${uid().slice(0, 8).toUpperCase()}`
    const issued = seats.map(seat => ({ id: uid(), code: orderCode, matchId: match.id, sector, seat, owner: profile.email, name: profile.name, status: 'Válida', price }))
    onComplete(issued); setStep(3)
    sendPurchaseEmail({ profile, match, matchName: `${home?.name} vs. ${away?.name}`, sector, seats, price, orderCode })
      .catch(err => console.error('No se pudo enviar el mail de confirmación:', err))
  }
  return <Modal title="Tus entradas al Mundial" wide onClose={onClose}><div className="steps">{['Elegí tu lugar', 'Revisá y confirmá', 'Todo listo'].map((text, i) => <span key={text} className={step >= i + 1 ? 'active' : ''}><b>{i + 1}</b>{text}</span>)}</div><h3>{home?.name} vs. {away?.name}</h3><p className="muted">{dateLabel(match.date)} · {match.time} h · {match.stadium}</p>
    {step === 1 && <><Field label="Sector"><select value={sector} onChange={e => { setSector(e.target.value); setSeats([]) }}><option>Norte</option><option>Sur</option><option>Preferencial</option></select></Field><div className="seat-map"><div className="mini-pitch"><span>CAMPO DE JUEGO</span></div><div className="seats">{Array.from({ length: 40 }, (_, i) => `A${i + 1}`).map(seat => <button key={seat} disabled={busy.includes(seat)} aria-label={`Asiento ${seat}${busy.includes(seat) ? ', ocupado' : ''}`} aria-pressed={seats.includes(seat)} className={seats.includes(seat) ? 'chosen' : ''} onClick={() => selectSeat(seat)}>{seat}</button>)}</div><p>Gris: ocupado · Violeta: tu selección · Hasta {Math.min(4, match.stock)} por compra</p></div><div className="purchase-summary"><span>{seats.length} entradas · {money(price)} cada una</span><strong>{money(seats.length * price)}</strong></div><p className="muted small-text">Mapa simplificado de muestra. Cupo disponible del partido: {match.stock}.</p><div className="modal-actions"><button className="secondary" onClick={onClose}>Cancelar</button><button className="primary" disabled={!seats.length} onClick={() => setStep(2)}>Continuar <Icon name="arrow"/></button></div></>}
    {step === 2 && <><dl className="details"><div><dt>Titular</dt><dd>{profile.name}</dd></div><div><dt>Sector y asientos</dt><dd>{sector} · {seats.join(', ')}</dd></div><div><dt>Total</dt><dd>{money(seats.length * price)}</dd></div></dl><Field label="Medio de pago simulado"><select value={method} onChange={e => setMethod(e.target.value)}><option>Tarjeta de demostración</option><option>Billetera de demostración</option></select></Field><div className="notice">Esta compra es una simulación. No ingreses datos bancarios: no se realizará ningún cobro.</div>{error && <p className="error" role="alert">{error}</p>}<div className="modal-actions"><button className="secondary" onClick={() => setStep(1)}>Volver</button><button className="secondary" onClick={() => setError('Pago rechazado de prueba. Podés reintentar o cambiar el medio de pago.')}>Simular rechazo</button><button className="primary" onClick={pay}>Confirmar pago simulado</button></div></>}
    {step === 3 && <div className="success-state"><div className="success-icon"><Icon name="check" size={36}/></div><Badge tone="green">Compra confirmada</Badge><h2>¡Nos vemos en la cancha!</h2><p>Tus {seats.length} entradas ya están en «Mis entradas».<br/>También agregamos una notificación a tu cuenta.</p><button className="primary" onClick={onClose}>Ver mis entradas <Icon name="arrow"/></button></div>}
  </Modal>
}
