import { useState } from 'react'
import type { ReactNode } from 'react'
import { groups, subjects, periods, statuses, students, initialData, gradeKey } from './data'
import type { DemoData } from './data'
import { Context } from './useDemo'
const KEY = 'quevedo-demo-v1'
function valid(value: unknown): value is DemoData {
  if (!value || typeof value !== 'object') return false
  const d = value as DemoData
  if (d.version !== 1 || !Array.isArray(d.attendance) || !d.grades || typeof d.grades !== 'object') return false
  if (!d.attendance.every(r => r && groups.some(g => g.id === r.group) && subjects.includes(r.subject) && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.states && students.filter(s => s.group === r.group).every(s => statuses.includes(r.states[s.id])))) return false
  return groups.every(group => subjects.every(subject => periods.every(period => {
    const record = d.grades[gradeKey(group.id, subject, period)]
    return record && students.filter(s => s.group === group.id).every(s => {
      const g = record[s.id]
      return g && [g.activities, g.exam].every(n => typeof n === 'string' && (n === '' || Number.isFinite(Number(n)) && Number(n) >= 0 && Number(n) <= 10))
    })
  })))
}
function read(): DemoData {
  try { const raw = localStorage.getItem(KEY); if (raw) { const parsed: unknown = JSON.parse(raw); if (valid(parsed)) return parsed } } catch { /* Fall back to fictional seed. */ }
  const seed = initialData()
  try { localStorage.setItem(KEY, JSON.stringify(seed)) } catch { /* Provider reports write errors on save. */ }
  return seed
}
export function DemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(read)
  const [error, setError] = useState('')
  function save(next: DemoData) {
    try { localStorage.setItem(KEY, JSON.stringify(next)); setData(next); setError(''); return true }
    catch { setError('No fue posible guardar en este navegador. Habilita el almacenamiento local e intenta de nuevo.'); return false }
  }
  return <Context.Provider value={{ data, save, reset: () => save(initialData()), error }}>{children}</Context.Provider>
}
