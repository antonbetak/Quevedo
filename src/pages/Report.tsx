import { useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { groups, subjects, students } from '../lib/data'
import { useDemo } from '../lib/useDemo'
import { Heading, Field, Notice, Table, ActionLink } from '../components/UI'
export default function Report() {
  const { data } = useDemo()
  const [group, setGroup] = useState('primary')
  const [subject, setSubject] = useState('Todas las materias')
  const [month, setMonth] = useState('2026-10')
  const records = data.attendance.filter(r => r.group === group && (subject === 'Todas las materias' || r.subject === subject) && r.date.startsWith(month))
  const rows = students.filter(s => s.group === group).map(s => {
    const states = records.map(r => r.states[s.id])
    const count = (state: string) => states.filter(v => v === state).length
    return { student: s, present: count('Presente'), absent: count('Falta'), late: count('Retardo'), justified: count('Justificada'), percentage: states.length ? `${Math.round(count('Presente') / states.length * 100)}%` : '—' }
  })
  function csv() {
    const lines = [['Alumno', 'Presentes', 'Faltas', 'Retardos', 'Justificadas', 'Asistencia'], ...rows.map(r => [r.student.name, r.present, r.absent, r.late, r.justified, r.percentage])]
    const blob = new Blob(['\uFEFF' + lines.map(line => line.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `asistencia-${group}-${month}.csv`; a.click(); URL.revokeObjectURL(url)
  }
  return <><Heading title="Reporte de asistencia">Consulta el consolidado por grupo o materia.</Heading><div className="filters no-print"><Field label="Nivel y grupo"><select value={group} onChange={e => setGroup(e.target.value)}>{groups.map(g => <option key={g.id} value={g.id}>{g.level} · {g.name}</option>)}</select></Field><Field label="Materia"><select value={subject} onChange={e => setSubject(e.target.value)}>{['Todas las materias', ...subjects].map(s => <option key={s}>{s}</option>)}</select></Field><Field label="Periodo"><input type="month" value={month} onChange={e => setMonth(e.target.value)}/></Field></div><Notice>Resumen mensual · {rows.length} alumnos · {new Set(records.map(r => r.date)).size} días registrados · {records.length} listas · Datos de demostración</Notice><Table headings={['Alumno', 'Presentes', 'Faltas', 'Retardos', 'Asistencia']}>{rows.map(r => <tr key={r.student.id}><td>{r.student.name}</td><td>{r.present}</td><td>{r.absent}</td><td>{r.late}</td><td>{r.percentage}</td></tr>)}</Table>{records.length === 0 && <p className="empty">No hay listas guardadas para estos filtros.</p>}<p className="muted">Asistencia = presentes / registros. Retardos y justificadas se contabilizan por separado; el CSV incluye justificadas. Cada materia cuenta como un registro.</p><div className="actions no-print"><button className="button secondary" onClick={csv}><Download size={16}/>Exportar CSV</button><button className="button" onClick={() => window.print()}><Printer size={16}/>Preparar reporte PDF</button><ActionLink to="/asistencia" secondary>Volver a la lista</ActionLink></div><p className="muted small">Salida para padres o SEP: formato sujeto a validación institucional.</p></>
}
