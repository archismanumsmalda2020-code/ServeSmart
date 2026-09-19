import { users } from './store'

// Basic auth skeleton: stores which seeded user is "logged in" client-side.
// This does not enforce any permissions or restrictions — it only tracks
// who the current user is so pages can identify them.

export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('currentUser')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem('currentUser')
}

export function allUsers() {
  return users
}
