const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export async function sendPurchaseEmail({ profile, match, matchName, sector, seats, price, orderCode }) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS no está configurado: faltan variables VITE_EMAILJS_* en .env')
    return
  }
  const template_params = {
    to_email: profile.email,
    to_name: profile.name,
    order_code: orderCode,
    match_name: matchName,
    match_date: match.date,
    match_time: match.time,
    stadium: match.stadium,
    sector,
    seats: seats.join(', '),
    quantity: seats.length,
    unit_price: price,
    total_price: seats.length * price,
  }
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params,
    }),
  })
  if (!res.ok) throw new Error(`EmailJS respondió ${res.status}: ${await res.text()}`)
}
