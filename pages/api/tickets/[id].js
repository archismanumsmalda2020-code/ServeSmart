import { tickets, findUser, STATUSES } from '../../../lib/store'

// A ticket moves forward one step at a time.
const NEXT_STATUS = {
  Open: 'Assigned',
  Assigned: 'In Progress',
  'In Progress': 'Resolved',
  Resolved: 'Closed',
}

export default function handler(req, res) {
  const { id } = req.query
  const ticket = tickets.find((t) => t.id === id)
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' })

  if (req.method === 'GET') return res.status(200).json({ ticket })

  if (req.method === 'PATCH') return handlePatch(req, res, ticket)

  res.setHeader('Allow', ['GET', 'PATCH'])
  return res.status(405).json({ error: 'Method not allowed' })
}

function handlePatch(req, res, ticket) {
  const { technicianId, status } = req.body || {}
  const now = new Date().toISOString()

  // Validate everything first so a bad request never half-applies.
  const tech = technicianId ? findUser(technicianId) : null
  if (technicianId && (!tech || tech.role !== 'technician')) {
    return res.status(400).json({ error: 'Choose a valid technician.' })
  }
  const assigning = Boolean(tech) && tech.id !== ticket.technicianId
  // Assigning an Open ticket moves it to Assigned automatically.
  const current =
    assigning && ticket.status === 'Open' ? 'Assigned' : ticket.status

  if (status && status !== current) {
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Unknown status.' })
    }
    if (!tech && !ticket.technicianId) {
      return res
        .status(400)
        .json({ error: 'Assign a technician before changing status.' })
    }
    if (NEXT_STATUS[current] !== status) {
      return res
        .status(400)
        .json({ error: `A ticket cannot move from ${current} to ${status}.` })
    }
  }

  let changed = false

  if (assigning) {
    const wasAssigned = Boolean(ticket.technicianId)
    ticket.technicianId = tech.id
    if (ticket.status === 'Open') ticket.status = 'Assigned'
    ticket.activity.push({
      id: `a${ticket.activity.length + 1}`,
      type: 'assigned',
      message: `${wasAssigned ? 'Reassigned' : 'Assigned'} to ${tech.name}`,
      at: now,
    })
    changed = true
  }

  if (status && status !== ticket.status) {
    ticket.status = status
    ticket.activity.push({
      id: `a${ticket.activity.length + 1}`,
      type: 'status',
      message: `Status changed to ${status}`,
      at: now,
    })
    changed = true
  }

  if (changed) ticket.updatedAt = now
  return res.status(200).json({ ticket })
}
