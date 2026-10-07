export const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
export const groups = [{ id: 'primary', level: 'Primaria', name: '2° A', teacher: 'María López' }, { id: 'secondary', level: 'Secundaria', name: '3° B', teacher: 'Carlos Pérez' }]
export const subjects = ['Matemáticas', 'Español', 'Ciencias naturales']
export const periods = ['Primer trimestre', 'Segundo trimestre', 'Tercer trimestre']
export const statuses = ['Presente', 'Falta', 'Retardo', 'Justificada'] as const
export type Status = typeof statuses[number]
const names = ['Ana Martínez López', 'Bruno García Díaz', 'Camila Hernández Ruiz', 'Diego Pérez Soto', 'Elena Torres Ríos', 'Fernanda Luna Vega', 'Gabriel Rivera Solís', 'Hugo Mendoza Lara', 'Isabel Moreno Cruz', 'Javier Castillo León']
export const students = names.map((name, i) => ({ id: `Q-026-${101 + i}`, name, group: i < 5 ? 'primary' : 'secondary' }))
export type Grade = { activities: string; exam: string }
export type Attendance = { group: string; subject: string; date: string; states: Record<string, Status> }
export type DemoData = { version: 1; attendance: Attendance[]; grades: Record<string, Record<string, Grade>> }
export const gradeKey = (group: string, subject: string, period: string) => `${group}|${subject}|${period}`
export const average = (g?: Grade) => g && g.activities !== '' && g.exam !== '' ? Number(g.activities) * .4 + Number(g.exam) * .6 : null
export const formatGrade = (n: number | null) => n === null ? '—' : n.toFixed(1)
export function initialData(): DemoData {
  const attendance: Attendance[] = []
  for (const group of groups) for (const subject of subjects) for (const date of ['2026-09-24', '2026-09-25', '2026-09-28', '2026-10-05']) {
    const states = Object.fromEntries(students.filter(s => s.group === group.id).map((s, i) => [s.id, i === 1 && date !== '2026-09-24' ? 'Falta' : i === 2 && date === '2026-09-28' ? 'Retardo' : i === 4 && date === '2026-09-28' ? 'Justificada' : 'Presente'])) as Record<string, Status>
    attendance.push({ group: group.id, subject, date, states })
  }
  const grades: DemoData['grades'] = {}
  for (const group of groups) for (const subject of subjects) for (const period of periods) {
    grades[gradeKey(group.id, subject, period)] = Object.fromEntries(students.filter(s => s.group === group.id).map((s, i) => [s.id, { activities: i === 3 ? '' : String(subject === 'Ciencias naturales' ? [10, 8, 10, 0, 9][i] : [9, 8, 10, 0, 9][i]), exam: i === 3 ? '' : String(subject === 'Español' ? [9, 8, 9, 0, 9][i] : subject === 'Ciencias naturales' ? [8, 8, 9, 0, 9][i] : [8, 7, 9, 0, 9][i]) }]))
  }
  return { version: 1, attendance, grades }
}
