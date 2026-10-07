import assert from 'node:assert/strict'
import { initialData, students, groups, subjects, periods, gradeKey, average, formatGrade } from '../src/lib/data.ts'
const seed = initialData()
assert.equal(students.length, 10)
assert.equal(seed.attendance.length, 24)
for (const list of seed.attendance) {
  assert.deepEqual(Object.keys(list.states).sort(), students.filter(s => s.group === list.group).map(s => s.id).sort())
}
for (const group of groups) for (const subject of subjects) for (const period of periods) {
  const grades = seed.grades[gradeKey(group.id, subject, period)]
  assert.equal(Object.keys(grades).length, 5)
  assert.equal(Object.values(grades).filter(g => average(g) === null).length, 1)
}
assert.equal(formatGrade(average({ activities: '9', exam: '8' })), '8.4')
assert.equal(average({ activities: '', exam: '8' }), null)
assert.equal(average({ activities: '0', exam: '0' }), 0)
const restored = JSON.parse(JSON.stringify(seed))
assert.deepEqual(restored, seed)
restored.grades[gradeKey('primary', 'Matemáticas', periods[0])][students[0].id] = { activities: '10', exam: '8' }
assert.equal(formatGrade(average(restored.grades[gradeKey('primary', 'Matemáticas', periods[0])][students[0].id])), '8.8')
assert.equal(formatGrade(average(initialData().grades[gradeKey('primary', 'Matemáticas', periods[0])][students[0].id])), '8.4')
console.log('Datos, ponderaciones, pendientes, serialización y restablecimiento: OK')
