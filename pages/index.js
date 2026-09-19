import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { allUsers, getCurrentUser, setCurrentUser, logout } from '../lib/auth'

export default function Home() {
  const router = useRouter()
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    setCurrent(getCurrentUser())
  }, [])

  function login(user) {
    setCurrentUser(user)
    setCurrent(user)
    if (user.role === 'student') router.push('/tickets')
    else if (user.role === 'technician') router.push('/technician/dashboard')
    else if (user.role === 'admin') router.push('/admin/assign')
  }

  function handleLogout() {
    logout()
    setCurrent(null)
  }

  const users = allUsers()
  const students = users.filter((u) => u.role === 'student')
  const technicians = users.filter((u) => u.role === 'technician')
  const admins = users.filter((u) => u.role === 'admin')

  return (
    <div className="container">
      <div className="hero-block">
        <h1>ServeSmart</h1>
        <p className="subtitle">
          Campus service dispatch — raise a request, route it to a technician,
          track it through to resolution. Pick a seeded account below to sign in
          (no password, demo auth).
        </p>
      </div>

      {current && (
        <div className="panel panel-pad session-banner">
          <span>
            Signed in as <strong>{current.name}</strong> ({current.role})
          </span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}

      <div className="role-grid">
        <div className="panel panel-pad role-panel">
          <h2>Students</h2>
          <div className="role-list">
            {students.map((u) => (
              <button
                key={u.id}
                className="btn btn-secondary"
                onClick={() => login(u)}
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>

        <div className="panel panel-pad role-panel">
          <h2>Technicians</h2>
          <div className="role-list">
            {technicians.map((u) => (
              <button
                key={u.id}
                className="btn btn-secondary"
                onClick={() => login(u)}
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>

        <div className="panel panel-pad role-panel">
          <h2>Admin</h2>
          <div className="role-list">
            {admins.map((u) => (
              <button
                key={u.id}
                className="btn btn-secondary"
                onClick={() => login(u)}
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
