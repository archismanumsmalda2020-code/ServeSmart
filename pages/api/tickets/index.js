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

  // Admin authorization check for unassigned tickets (from your code)
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
  const {
    title,
    description,
    category,
    location,
    priority,
    studentId,
  } = req.body || {}

  // Comprehensive field validation (from friend's code)
  if (!title || !title.trim()) {
    return res.status(400).json({
      error: 'Title is required.',
    })
  }

  if (!description || !description.trim()) {
    return res.status(400).json({
      error: 'Description is required.',
    })
  }

  if (description.trim().length < 20) {
    return res.status(400).json({
      error: 'Description must be at least 20 characters long.',
    })
  }

  if (!category || !CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: 'A valid category is required.',
    })
  }

  if (!location || !location.trim()) {
    return res.status(400).json({
      error: 'Location is required.',
    })
  }

  if (!priority || !PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: 'A valid priority is required.',
    })
  }

  const now = new Date().toISOString()
  const student = findUser(studentId)

  const ticket = {
    id: generateId(),
    title: title.trim(),
    description: description.trim(),
    category,
    location: location.trim(),
    priority,
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

  return res.status(201).json({
    ticket,
  })
}