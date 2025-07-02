import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home.jsx'
import Boletos from './pages/Boletos.jsx'
import Despesas from './pages/Despesas.jsx'
import Vendas from './pages/Vendas.jsx'
import Fiados from './pages/Fiados.jsx'
import Relatorios from './pages/Relatorios.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/boletos" element={<Boletos />} />
        <Route path="/despesas" element={<Despesas />} />
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/fiados" element={<Fiados />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

