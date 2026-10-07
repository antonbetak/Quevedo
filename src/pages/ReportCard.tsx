import { useSearchParams } from 'react-router-dom'
import { Printer, Download } from 'lucide-react'
import { students, groups, subjects, periods, gradeKey, average, formatGrade } from '../lib/data'
import { useDemo } from '../lib/useDemo'
import { Heading, Field, Table, ActionLink } from '../components/UI'
export default function ReportCard() {
  const { data } = useDemo()
  const [params, setParams] = useSearchParams()
  const student = students.find(s => s.id === params.get('alumno')) ?? students[0]
  const group = groups.find(g => g.id === student.group)!
  const period = periods.includes(params.get('periodo') ?? '') ? params.get('periodo')! : periods[0]
  const grades = subjects.map(subject => ({ subject, value: average(data.grades[gradeKey(student.group, subject, period)][student.id]) }))
  const complete = grades.every(g => g.value !== null)
  const records = data.attendance.filter(r => r.group === student.group)
  const present = records.filter(r => r.states[student.id] === 'Presente').length
  const absent = records.filter(r => r.states[student.id] === 'Falta').length
  return <><Heading title="Vista previa de boleta">Revisa los datos antes de descargar o imprimir.</Heading><div className="filters no-print"><Field label="Alumno"><select value={student.id} onChange={e => setParams({ alumno: e.target.value, periodo: period })}>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Periodo"><select value={period} onChange={e => setParams({ alumno: student.id, periodo: e.target.value })}>{periods.map(p => <option key={p}>{p}</option>)}</select></Field></div><div className="actions no-print"><ActionLink to="/calificaciones" secondary>Volver a calificaciones</ActionLink><button className="button" onClick={() => window.print()}><Download size={16}/>Descargar PDF</button><button className="button secondary" onClick={() => window.print()}><Printer size={16}/>Imprimir</button></div><article className="card report-card"><p className="institution">CENTRO UNIVERSITARIO QUEVEDO</p><h2>Boleta de evaluación</h2><p className="eyebrow muted">BORRADOR · FORMATO PROPUESTO</p><hr/><h3>{student.name}</h3><p className="muted">{student.id} · {group.level} · {group.name} · {period} · 2026–2027</p><Table headings={['Asignatura', 'Calificación']}>{grades.map(g => <tr key={g.subject}><td>{g.subject}</td><td>{formatGrade(g.value)}</td></tr>)}<tr><td>Promedio de ejemplo</td><td><strong>{complete ? formatGrade(grades.reduce((sum, g) => sum + g.value!, 0) / grades.length) : 'Pendiente'}</strong></td></tr></Table><p>Asistencia: {records.length ? `${Math.round(present / records.length * 100)}%` : 'Sin registros'} · Faltas: {absent}</p><p className="muted small">Asistencia acumulada de las listas registradas en la demo, todas las materias.</p><p className="muted">Observaciones: {complete ? 'Evaluaciones completas para este periodo.' : 'Hay evaluaciones pendientes de captura.'}</p><div className="signatures"><span>Revisión de control escolar</span><span>Firma y sello</span></div></article><p className="muted no-print small">Para descargar el PDF, selecciona “Guardar como PDF” en el diálogo de impresión.</p></>
}
