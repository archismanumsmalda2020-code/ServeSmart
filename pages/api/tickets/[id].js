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

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found.' })
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ticket })
  }

  if (req.method === 'PATCH') {
    return handlePatch(req, res, ticket)
  }

  res.setHeader('Allow', ['GET', 'PATCH'])
  return res.status(405).json({ error: 'Method not allowed' })
}

function handlePatch(req, res, ticket) {
  const { technicianId, status } = req.body || {}
  const now = new Date().toISOString()

  // ---------------------------------------------------------
  // IDENTIFY THE CALLER
  // ---------------------------------------------------------
  const callerId = req.headers['x-user-id']

  if (!callerId) {
    return res.status(401).json({
      error: 'User identity is required.',
    })
  }

  const caller = findUser(callerId)

  if (!caller) {
    return res.status(401).json({
      error: 'Unknown user.',
    })
  }

  // ---------------------------------------------------------
  // ASSIGNMENT / REASSIGNMENT
  // ---------------------------------------------------------
  const isAssignmentRequest = technicianId !== undefined

  if (isAssignmentRequest) {
    // Only admins may assign or reassign tickets.
    if (caller.role !== 'admin') {
      return res.status(403).json({
        error: 'Only admins can assign or reassign tickets.',
      })
    }

    const tech = findUser(technicianId)

    if (!tech || tech.role !== 'technician') {
      return res.status(400).json({
        error: 'Choose a valid technician.',
      })
    }

    const isNewAssignment = !ticket.technicianId
    const isReassignment =
      ticket.technicianId && ticket.technicianId !== technicianId

    // Same technician = nothing to change.
    if (ticket.technicianId === technicianId) {
      return res.status(200).json({ ticket })
    }

    ticket.technicianId = tech.id

    // Assigning an Open ticket automatically changes it to Assigned.
    if (ticket.status === 'Open') {
      ticket.status = 'Assigned'

      ticket.activity.push({
        id: `a${ticket.activity.length + 1}`,
        type: 'status',
        message: 'Status changed to Assigned',
        at: now,
      })
    }

    ticket.activity.push({
      id: `a${ticket.activity.length + 1}`,
      type: 'assigned',
      message: `${
        isReassignment ? 'Reassigned' : isNewAssignment ? 'Assigned' : 'Assigned'
      } to ${tech.name}`,
      at: now,
    })

    ticket.updatedAt = now

    return res.status(200).json({ ticket })
  }

  // ---------------------------------------------------------
  // STATUS UPDATE
  // ---------------------------------------------------------

  // Only technicians can change ticket status.
  if (caller.role !== 'technician') {
    return res.status(403).json({
      error: 'Only technicians can update ticket status.',
    })
  }

  // Technician can only update tickets assigned to them.
  if (ticket.technicianId !== caller.id) {
    return res.status(403).json({
      error: 'You can only update tickets assigned to you.',
    })
  }

  // No status supplied.
  if (!status) {
    return res.status(400).json({
      error: 'No supported update provided.',
    })
  }

  // Validate status.
  if (!STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Unknown status.',
    })
  }

  // Same status is not a transition.
  if (status === ticket.status) {
    return res.status(200).json({ ticket })
  }

  // Enforce sequential status transitions.
  if (NEXT_STATUS[ticket.status] !== status) {
    return res.status(400).json({
      error: `A ticket cannot move from ${ticket.status} to ${status}.`,
    })
  }

  ticket.status = status

  ticket.activity.push({
    id: `a${ticket.activity.length + 1}`,
    type: 'status',
    message: `Status changed to ${status}`,
    at: now,
  })

  ticket.updatedAt = now

  return res.status(200).json({ ticket })
}