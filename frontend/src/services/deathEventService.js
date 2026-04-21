const BASE = '/api/v1'

// ── Death Events ────────────────────────────────────────────────────────────

export async function getAllDeathEvents() {
  const res = await fetch(`${BASE}/death-events`)
  if (!res.ok) throw new Error('Failed to fetch death events')
  return res.json()
}

export async function getDeathEventById(id) {
  const res = await fetch(`${BASE}/death-events/${id}`)
  if (!res.ok) throw new Error('Failed to fetch death event')
  return res.json()
}

export async function createDeathEvent(payload) {
  const res = await fetch(`${BASE}/death-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create death event')
  return res.json()
}

export async function deleteDeathEvent(id) {
  const res = await fetch(`${BASE}/death-events/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete death event')
}

// ── Donation Payments ───────────────────────────────────────────────────────

export async function getPaymentsByDeathEvent(deathEventId) {
  const res = await fetch(`${BASE}/payments/death-event/${deathEventId}`)
  if (!res.ok) throw new Error('Failed to fetch payments')
  return res.json()
}

export async function markAsPaid(paymentId, paidDate) {
  const res = await fetch(`${BASE}/payments/${paymentId}/paid`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paidDate ? { paidDate } : {}),
  })
  if (!res.ok) throw new Error('Failed to mark as paid')
  return res.json()
}

export async function markAsUnpaid(paymentId) {
  const res = await fetch(`${BASE}/payments/${paymentId}/unpaid`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to mark as unpaid')
  return res.json()
}
