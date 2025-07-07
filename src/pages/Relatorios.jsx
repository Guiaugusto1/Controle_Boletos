// 📄 src/pages/Relatorios.jsx
import {
  Box,
  Heading,
  Input,
  Stack,
  Text,
  Divider,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'

function Relatorios() {
  const [mesSelecionado, setMesSelecionado] = useState('')

  const [vendas, setVendas] = useState([])
  const [despesas, setDespesas] = useState([])
  const [boletos, setBoletos] = useState([])
  const [fiado, setFiado] = useState([])

  useEffect(() => {
    const v = JSON.parse(localStorage.getItem('vendas') || '[]')
    const d = JSON.parse(localStorage.getItem('despesas') || '[]')
    const b = JSON.parse(localStorage.getItem('boletos') || '[]')
    const f = JSON.parse(localStorage.getItem('fiado') || '[]')

    setVendas(v)
    setDespesas(d)
    setBoletos(b)
    setFiado(f)
  }, [])

  const filtrarPorMes = (lista, campo) => {
    return lista.filter((item) => item[campo]?.startsWith(mesSelecionado))
  }

  const totalVendas = filtrarPorMes(vendas, 'mes').reduce((acc, v) => acc + v.valor, 0)
  const totalDespesas = filtrarPorMes(despesas, 'data').reduce((acc, d) => acc + d.valor, 0)
  const totalBoletos = filtrarPorMes(boletos.filter((b) => b.status === 'pago'), 'vencimento').reduce((acc, b) => acc + b.valor, 0)

  const totalFiado = fiado.reduce((acc, cliente) => {
    const pendentes = cliente.dividas.filter((d) => d.data?.startsWith(mesSelecionado) && !d.pago)
    const soma = pendentes.reduce((a, d) => a + d.valor, 0)
    return acc + soma
  }, 0)

  const lucro = totalVendas - (totalDespesas + totalBoletos + totalFiado)

  return (
    <Box>
      <Heading size="lg" mb={4}>Relatório Mensal</Heading>

      <Stack maxW="300px" mb={6}>
        <Input
          type="month"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
        />
      </Stack>

      {mesSelecionado && (
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Text><strong>Vendas:</strong> R$ {totalVendas.toFixed(2)}</Text>
          <Text><strong>Despesas:</strong> R$ {totalDespesas.toFixed(2)}</Text>
          <Text><strong>Boletos Pagos:</strong> R$ {totalBoletos.toFixed(2)}</Text>
          <Text><strong>Fiado Pendente:</strong> R$ {totalFiado.toFixed(2)}</Text>
          <Divider my={3} />
          <Text fontSize="xl"><strong>Lucro:</strong> R$ {lucro.toFixed(2)}</Text>
        </Box>
      )}
    </Box>
  )
}

export default Relatorios
