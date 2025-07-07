// 📄 src/contexts/BoletoContext.jsx
import { createContext, useContext, useState } from 'react'

const BoletoContext = createContext()

export function BoletoProvider({ children }) {
  const [boletos, setBoletos] = useState([])

  const adicionarBoleto = (boleto) => {
    setBoletos((prev) => [...prev, boleto])
  }

  const marcarComoPago = (id) => {
    setBoletos((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'pago' } : b))
    )
  }

  const removerBoleto = (id) => {
    setBoletos((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <BoletoContext.Provider
      value={{ boletos, adicionarBoleto, marcarComoPago, removerBoleto }}
    >
      {children}
    </BoletoContext.Provider>
  )
}

export function useBoletos() {
  return useContext(BoletoContext)
}
