import { createContext, useContext, useState } from 'react'

const BoletoContext = createContext()

export function BoletoProvider({ children }) {
  const [boletos, setBoletos] = useState([])

  const adicionarBoleto = (boleto) => {
    setBoletos((prev) => [...prev, boleto])
  }

  return (
    <BoletoContext.Provider value={{ boletos, adicionarBoleto }}>
      {children}
    </BoletoContext.Provider>
  )
}

export function useBoletos() {
  return useContext(BoletoContext)
}
