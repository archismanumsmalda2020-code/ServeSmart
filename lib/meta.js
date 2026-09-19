import { PRIORITIES, STATUSES } from './store'

export const PRIORITY_META = {
  P1: { label: 'P1 · Urgent', tone: 'rust' },
  P2: { label: 'P2 · High', tone: 'amber' },
  P3: { label: 'P3 · Normal', tone: 'blue' },
  P4: { label: 'P4 · Low', tone: 'muted' },
}

export const STATUS_META = {
  Open: { tone: 'rust' },
  Assigned: { tone: 'blue' },
  'In Progress': { tone: 'amber' },
  Resolved: { tone: 'moss' },
  Closed: { tone: 'muted' },
}

export function ticketCode(id) {
  return `TKT-${String(id).padStart(4, '0')}`
}

export function priorityOrder(priority) {
  const i = PRIORITIES.indexOf(priority)
  return i === -1 ? PRIORITIES.length : i
}

export function statusOrder(status) {
  const i = STATUSES.indexOf(status)
  return i === -1 ? STATUSES.length : i
}

export function timeAgo(iso) {
  if (!iso) return '—'
  const time = new Date(iso).getTime()
  if (Number.isNaN(time)) return '—'
  const mins = Math.floor((Date.now() - time) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(time).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
