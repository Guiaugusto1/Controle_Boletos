import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Boletos from './pages/Boletos'
import Despesas from './pages/Despesas'
import Vendas from './pages/Vendas'
import Fiados from './pages/Fiados'
import Relatorios from './pages/Relatorios'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/boletos" element={<Boletos />} />
      <Route path="/despesas" element={<Despesas />} />
      <Route path="/vendas" element={<Vendas />} />
      <Route path="/fiados" element={<Fiados />} />
      <Route path="/relatorios" element={<Relatorios />} />
    </Routes>
  )
}

export default AppRoutes


