import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DemoProvider } from './lib/storage'
import Layout from './components/Layout'
import Home from './pages/Home'
import Attendance from './pages/Attendance'
import Grades from './pages/Grades'
import Report from './pages/Report'
import ReportCard from './pages/ReportCard'
export default function App() { return <DemoProvider><BrowserRouter><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="asistencia" element={<Attendance/>}/><Route path="reporte" element={<Report/>}/><Route path="calificaciones" element={<Grades/>}/><Route path="boleta" element={<ReportCard/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes></BrowserRouter></DemoProvider> }
