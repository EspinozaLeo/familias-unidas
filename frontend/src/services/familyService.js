const BASE = '/api/v1'

// ── Families (Person = head of household) ──────────────────────────────────

export async function getAllFamilies() {
  const res = await fetch(`${BASE}/person`)
  if (!res.ok) throw new Error('Failed to fetch families')
  return res.json()
}

export async function getFamilyById(id) {
  const res = await fetch(`${BASE}/person/${id}`)
  if (!res.ok) throw new Error('Failed to fetch family')
  return res.json()
}

export async function searchFamilies(name) {
  const res = await fetch(`${BASE}/person/search?name=${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error('Failed to search families')
  return res.json()
}

export async function addFamily(person) {
  const res = await fetch(`${BASE}/person/addPerson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person),
  })
  if (!res.ok) throw new Error('Failed to add family')
  return res.json()
}

export async function updateFamily(id, person) {
  const res = await fetch(`${BASE}/person/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person),
  })
  if (!res.ok) throw new Error('Failed to update family')
  return res.json()
}

export async function deleteFamily(id) {
  const res = await fetch(`${BASE}/person/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete family')
}

// ── Family Members ──────────────────────────────────────────────────────────

export async function addFamilyMember(member) {
  const res = await fetch(`${BASE}/familymembers/addFamilyMember`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  })
  if (!res.ok) throw new Error('Failed to add family member')
  return res.json()
}

export async function updateFamilyMember(id, member) {
  const res = await fetch(`${BASE}/familymembers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  })
  if (!res.ok) throw new Error('Failed to update family member')
  return res.json()
}

export async function deleteFamilyMember(id) {
  const res = await fetch(`${BASE}/familymembers/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete family member')
}
