import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SplashScreen from './components/SplashScreen'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Contact from './pages/Contact'
import Reservas from './pages/Reservas'
import Recepcion from './pages/Recepcion'

function App() {
  return (
    <>
      <SplashScreen />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/recepcion" element={<Recepcion />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
