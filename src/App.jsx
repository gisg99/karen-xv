import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Classic from './pages/Classic'
import Modern from './pages/Modern'
import Page3 from './pages/Page3'
import Welcome from './components/Welcome'

export default function App() {
  return (
    <BrowserRouter>
      <Welcome />
      <Routes>
        <Route path="/"       element={<Classic />} />
        <Route path="/modern" element={<Modern />} />
        <Route path="/page3"  element={<Page3 />} />
      </Routes>
    </BrowserRouter>
  )
}
