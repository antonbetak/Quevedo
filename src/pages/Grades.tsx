import { useState } from 'react'
import { Save } from 'lucide-react'
import { groups, subjects, periods, students, gradeKey, average, formatGrade } from '../lib/data'
import type { Grade } from '../lib/data'
import { useDemo } from '../lib/useDemo'
import { Heading, Field, Notice, Table, ActionLink } from '../components/UI'
export default function Grades() {
  const { data, save } = useDemo()
  const [group, setGroup] = useState('primary')
  const [subject, setSubject] = useState(subjects[0])
  const [period, setPeriod] = useState(periods[0])
  const [drafts, setDrafts] = useState<Record<string, Record<string, Grade>>>({})
  const [saved, setSaved] = useState(false)
  const key = gradeKey(group, subject, period)
  const values = drafts[key] ?? data.grades[key]
  const roster = students.filter(s => s.group === group)
  const valid = Object.values(values).every(g => [g.activities, g.exam].every(n => n === '' || Number.isFinite(Number(n)) && Number(n) >= 0 && Number(n) <= 10))
  function edit(id: string, field: keyof Grade, value: string) { setSaved(false); setDrafts({ ...drafts, [key]: { ...values, [id]: { ...values[id], [field]: value } } }) }
  function submit() { if (valid && save({ ...data, grades: { ...data.grades, ...drafts } })) { setDrafts({}); setSaved(true) } }
  return <><Heading title="Calificaciones">Captura, revisa y prepara las boletas del periodo.</Heading><div className="filters"><Field label="Nivel y grupo"><select value={group} onChange={e => { setGroup(e.target.value); setSaved(false) }}>{groups.map(g => <option key={g.id} value={g.id}>{g.level} · {g.name}</option>)}</select></Field><Field label="Materia"><select value={subject} onChange={e => { setSubject(e.target.value); setSaved(false) }}>{subjects.map(s => <option key={s}>{s}</option>)}</select></Field><Field label="Periodo"><select value={period} onChange={e => { setPeriod(e.target.value); setSaved(false) }}>{periods.map(p => <option key={p}>{p}</option>)}</select></Field></div><Notice>{saved ? 'Borrador guardado. La boleta ya refleja tus cambios.' : 'Ejemplo: actividades 40% + examen 60%. Escala de demo: 0 a 10; ponderaciones por confirmar.'}</Notice><form onSubmit={e => { e.preventDefault(); submit() }}><Table headings={['Alumno', 'Actividades', 'Examen', 'Promedio', 'Estado']}>{roster.map(s => <tr key={s.id}><td>{s.name}</td>{(['activities', 'exam'] as const).map(field => <td key={field}><input className="grade-input" aria-label={`${field === 'activities' ? 'Actividades' : 'Examen'} de ${s.name}`} type="number" min="0" max="10" step="any" placeholder="—" value={values[s.id][field]} onChange={e => edit(s.id, field, e.target.value)}/></td>)}<td>{formatGrade(average(values[s.id]))}</td><td><span className={`status ${average(values[s.id]) === null ? 'status-Retardo' : 'status-Presente'}`}>{average(values[s.id]) === null ? 'Pendiente' : 'Completo'}</span></td></tr>)}</Table>{!valid && <p className="error" role="alert">Las calificaciones deben estar entre 0 y 10.</p>}<div className="actions"><button className="button" type="submit" disabled={!valid}><Save size={16}/>Guardar borrador</button><ActionLink to={`/boleta?alumno=${roster[0].id}&periodo=${encodeURIComponent(period)}`}>Revisar boleta de {roster[0].name.split(' ')[0]}</ActionLink></div></form><p className="muted">Las celdas vacías quedan pendientes; no se convierten automáticamente en cero.</p>{Object.keys(drafts).length > 0 && <p className="muted">Hay cambios sin guardar. Guarda el borrador antes de revisar la boleta.</p>}</>
}
