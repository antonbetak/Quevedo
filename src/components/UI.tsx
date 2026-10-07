import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
export function Heading({ title, children }: { title: string; children: ReactNode }) { return <header className="page-heading"><h1>{title}</h1><p>{children}</p></header> }
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="field"><span>{label}</span>{children}</label> }
export function Notice({ children }: { children: ReactNode }) { return <div className="notice" role="status">{children}</div> }
export function Table({ headings, children, className = '' }: { headings: string[]; children: ReactNode; className?: string }) { return <div className={`table-wrap ${className}`}><table><thead><tr>{headings.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div> }
export function ActionLink({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) { return <Link className={`button ${secondary ? 'secondary' : ''}`} to={to}>{children}<ArrowRight size={16}/></Link> }
