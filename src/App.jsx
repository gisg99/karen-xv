import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Classic from './pages/Classic'
import Page3 from './pages/Page3'
import Welcome from './components/Welcome'

export default function App() {
  return (
    <BrowserRouter>
      <Welcome />
      <Routes>
        <Route path="/"        element={<Page3 />} />
        <Route path="/clasico" element={<Classic />} />
      </Routes>
    </BrowserRouter>
  )
}
