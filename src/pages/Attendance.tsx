import { useState } from 'react'
import { Save, CheckCircle2 } from 'lucide-react'
import { groups, subjects, students, statuses, today } from '../lib/data'
import type { Status } from '../lib/data'
import { useDemo } from '../lib/useDemo'
import { Heading, Field, Notice, Table, ActionLink } from '../components/UI'
export default function Attendance() {
  const { data, save } = useDemo()
  const [group, setGroup] = useState('primary')
  const [subject, setSubject] = useState(subjects[0])
  const [date, setDate] = useState(today)
  const [search, setSearch] = useState('')
  const [drafts, setDrafts] = useState<Record<string, Record<string, Status>>>({})
  const [saved, setSaved] = useState('')
  const key = `${group}|${subject}|${date}`
  const roster = students.filter(s => s.group === group)
  const record = data.attendance.find(r => r.group === group && r.subject === subject && r.date === date)
  const states = drafts[key] ?? record?.states ?? Object.fromEntries(roster.map(s => [s.id, statuses[0]]))
  const count = (status: Status) => roster.filter(s => states[s.id] === status).length
  function change(next: Record<string, Status>) { setDrafts({ ...drafts, [key]: next }); setSaved('') }
  function submit() {
    if (!date) return
    const next = { group, subject, date, states }
    if (save({ ...data, attendance: [...data.attendance.filter(r => !(r.group === group && r.subject === subject && r.date === date)), next] })) { setSaved(key); setDrafts(prev => { const copy = { ...prev }; delete copy[key]; return copy }) }
  }
  return <><Heading title="Pasar lista">Registra la asistencia y revisa antes de guardar.</Heading><div className="filters four"><Field label="Nivel"><select value={group} onChange={e => { setGroup(e.target.value); setSaved('') }}>{groups.map(g => <option key={g.id} value={g.id}>{g.level}</option>)}</select></Field><Field label="Grupo"><select value={group} onChange={e => { setGroup(e.target.value); setSaved('') }}>{groups.map(g => <option key={g.id} value={g.id}>{g.name} · {g.level}</option>)}</select></Field><Field label="Materia"><select value={subject} onChange={e => { setSubject(e.target.value); setSaved('') }}>{subjects.map(s => <option key={s}>{s}</option>)}</select></Field><Field label="Fecha"><input type="date" required value={date} onChange={e => { setDate(e.target.value); setSaved('') }}/></Field></div><Notice>{saved === key ? <><CheckCircle2 size={18}/>Asistencia guardada · {roster.length} alumnos. Puedes corregir los estados y volver a guardar.</> : <>{record && !drafts[key] ? 'Lista guardada' : 'Borrador'} · {roster.length} de {roster.length} registrados. Revisa los estados antes de confirmar.</>}</Notice><div className="list-tools"><Field label="Buscar alumno"><input type="search" placeholder="Nombre o matrícula" value={search} onChange={e => setSearch(e.target.value)}/></Field><button className="button secondary" onClick={() => change(Object.fromEntries(roster.map(s => [s.id, 'Presente'])))}>Marcar todos presentes</button><ActionLink to="/reporte" secondary>Ver reporte</ActionLink></div><Table headings={['Alumno', 'Matrícula', 'Estado', 'Acción']} className="attendance-table">{roster.filter(s => `${s.name} ${s.id}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map(s => <tr key={s.id}><td data-label="Alumno">{s.name}</td><td data-label="Matrícula">{s.id}</td><td data-label="Estado"><span className={`status status-${states[s.id]}`}>{states[s.id]}</span></td><td data-label="Acción"><select aria-label={`Cambiar estado de ${s.name}`} value={states[s.id]} onChange={e => change({ ...states, [s.id]: e.target.value as Status })}>{statuses.map(status => <option key={status}>{status}</option>)}</select></td></tr>)}</Table>{roster.filter(s => `${s.name} ${s.id}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())).length === 0 && <p className="empty">No se encontraron alumnos.</p>}<div className="save-row"><p>{count('Presente')} presentes · {count('Falta')} faltas · {count('Retardo')} retardos · {count('Justificada')} justificadas</p><button className="button" disabled={!date} onClick={submit}><Save size={17}/>{record ? 'Guardar correcciones' : 'Confirmar y guardar'}</button></div></>
}
