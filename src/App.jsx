import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Classic from './pages/Classic'
import Modern from './pages/Modern'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<Classic />} />
        <Route path="/modern" element={<Modern />} />
      </Routes>
    </BrowserRouter>
  )
}
