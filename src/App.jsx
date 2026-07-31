import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Page3 from './pages/Page3'
import Admin from './pages/Admin'
import Welcome from './components/Welcome'

/* El sobre de bienvenida solo va en las invitaciones, no en /admin */
const Invitacion = ({ children }) => (
  <>
    <Welcome />
    {children}
  </>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<Invitacion><Page3 /></Invitacion>} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
