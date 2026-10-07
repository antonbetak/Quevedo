import { createContext, useContext } from 'react'
import type { DemoData } from './data'
import { initialData } from './data'
export const Context = createContext<{ data: DemoData; save: (next: DemoData) => boolean; reset: () => boolean; error: string }>({ data: initialData(), save: () => false, reset: () => false, error: '' })
export const useDemo = () => useContext(Context)
