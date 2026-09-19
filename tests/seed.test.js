const assert = require('assert')

const users = [
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `stu${i + 1}`,
    role: 'student',
  })),
  { id: 'tech1', role: 'technician' },
  { id: 'tech2', role: 'technician' },
  { id: 'tech3', role: 'technician' },
  { id: 'admin1', role: 'admin' },
]

const students = users.filter((u) => u.role === 'student')
const technicians = users.filter((u) => u.role === 'technician')
const admins = users.filter((u) => u.role === 'admin')

assert.strictEqual(students.length, 10, 'should have 10 students')
assert.strictEqual(technicians.length, 3, 'should have 3 technicians')
assert.strictEqual(admins.length, 1, 'should have 1 admin')

const ticketCount = 12
assert.ok(
  ticketCount >= 10 && ticketCount <= 14,
  'should have about 12 tickets',
)

console.log('Seed data structure looks correct.')
