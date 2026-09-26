import {
  tickets,
  generateId,
  findUser,
  CATEGORIES,
  PRIORITIES,
} from '../../../lib/store'

export default function handler(req, res) {
  if (req.method === 'GET') return handleGet(req, res)
  if (req.method === 'POST') return handlePost(req, res)
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed' })
}

function handleGet(req, res) {
  const { studentId, technicianId, unassigned } = req.query

  // Admin-only endpoint for unassigned tickets.
  if (unassigned === 'true') {
    const callerId = req.headers['x-user-id']
    const caller = findUser(callerId)

    if (!caller) {
      return res.status(401).json({
        error: 'Unknown user.',
      })
    }

    if (caller.role !== 'admin') {
      return res.status(403).json({
        error: 'Only admins can view unassigned tickets.',
      })
    }
  }

  let result = tickets

  if (studentId) {
    result = result.filter((t) => t.studentId === studentId)
  }

  if (technicianId) {
    result = result.filter((t) => t.technicianId === technicianId)
  }

  if (unassigned === 'true') {
    result = result.filter((t) => !t.technicianId)
  }

  return res.status(200).json({ tickets: result })
}

function handlePost(req, res) {
  const { title, description, category, location, priority, studentId } =
    req.body || {}

  if (!title || !title.trim() || !location || !location.trim()) {
    return res.status(400).json({ error: 'Title and location are required.' })
  }
  if (category && !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Unknown category.' })
  }
  if (priority && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: 'Unknown priority.' })
  }
  const now = new Date().toISOString()
  const student = findUser(studentId)

  const ticket = {
    id: generateId(),
    title: title.trim(),
    description: (description || '').trim(),
    category: category || CATEGORIES[0],
    location: location.trim(),
    priority: priority || 'P4',
    status: 'Open',
    studentId: studentId || null,
    technicianId: null,
    createdAt: now,
    updatedAt: now,
    activity: [
      {
        id: 'a1',
        type: 'created',
        message: `Submitted by ${student ? student.name : 'student'}`,
        at: now,
      },
    ],
  }

  tickets.push(ticket)
  return res.status(201).json({ ticket })
}