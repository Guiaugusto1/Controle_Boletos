// 📄 src/pages/Vendas.jsx
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Stack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Select,
  HStack,
} from '@chakra-ui/react'
import { useState } from 'react'

function Vendas() {
  const [valor, setValor] = useState('')
  const [mes, setMes] = useState('')
  const [vendas, setVendas] = useState([])
  const [editandoId, setEditandoId] = useState(null)

  const [filtroMes, setFiltroMes] = useState('')
  const [ordenarPor, setOrdenarPor] = useState('')

  const toast = useToast()

  const handleSalvar = () => {
    if (!valor || !mes) {
      toast({ title: 'Preencha todos os campos.', status: 'warning', isClosable: true })
      return
    }

    if (editandoId) {
      setVendas(
        vendas.map((v) =>
          v.id === editandoId ? { ...v, valor: parseFloat(valor), mes } : v
        )
      )
      toast({ title: 'Venda atualizada.', status: 'info', isClosable: true })
      setEditandoId(null)
    } else {
      const nova = {
        id: Date.now(),
        valor: parseFloat(valor),
        mes,
      }
      setVendas([...vendas, nova])
      toast({ title: 'Venda registrada.', status: 'success', isClosable: true })
    }

    setValor('')
    setMes('')
  }

  const handleEditar = (venda) => {
    setEditandoId(venda.id)
    setValor(venda.valor.toString())
    setMes(venda.mes)
  }

  const handleRemover = (id) => {
    setVendas(vendas.filter((v) => v.id !== id))
  }

  let listaFiltrada = [...vendas]

  if (filtroMes) {
    listaFiltrada = listaFiltrada.filter((v) => v.mes === filtroMes)
  }

  if (ordenarPor === 'mes_asc') {
    listaFiltrada.sort((a, b) => a.mes.localeCompare(b.mes))
  } else if (ordenarPor === 'mes_desc') {
    listaFiltrada.sort((a, b) => b.mes.localeCompare(a.mes))
  } else if (ordenarPor === 'valor_asc') {
    listaFiltrada.sort((a, b) => a.valor - b.valor)
  } else if (ordenarPor === 'valor_desc') {
    listaFiltrada.sort((a, b) => b.valor - a.valor)
  }

  const total = listaFiltrada.reduce((acc, v) => acc + v.valor, 0)

  return (
    <Box>
      <Heading size="lg" mb={4}>Vendas</Heading>

      <Stack spacing={4} maxW="500px">
        <FormControl>
          <FormLabel>Valor Total do Mês (R$)</FormLabel>
          <Input type="number" value={valor} onChange={(e) => setValor(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Mês</FormLabel>
          <Input type="month" value={mes} onChange={(e) => setMes(e.target.value)} />
        </FormControl>
        <Stack direction="row" justify="flex-end">
          <Button variant="ghost" onClick={() => { setValor(''); setMes(''); setEditandoId(null) }}>Cancelar</Button>
          <Button colorScheme="teal" onClick={handleSalvar}>{editandoId ? 'Atualizar' : 'Salvar'}</Button>
        </Stack>
      </Stack>

      <Box mt={10}>
        <Heading size="md" mb={3}>Histórico de Vendas</Heading>
        <HStack spacing={4} mb={3} wrap="wrap">
          <Input
            type="month"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            maxW="200px"
          />
          <Select
            placeholder="Ordenar por..."
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
            maxW="200px"
          >
            <option value="mes_asc">Mês crescente</option>
            <option value="mes_desc">Mês decrescente</option>
            <option value="valor_asc">Valor crescente</option>
            <option value="valor_desc">Valor decrescente</option>
          </Select>
        </HStack>

        <Text mb={2}>Total: <strong>R$ {total.toFixed(2)}</strong></Text>

        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Valor</Th>
              <Th>Mês</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {listaFiltrada.map((v) => (
              <Tr key={v.id}>
                <Td>R$ {v.valor.toFixed(2)}</Td>
                <Td>{v.mes}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button size="xs" colorScheme="blue" onClick={() => handleEditar(v)}>
                      Editar
                    </Button>
                    <Button size="xs" colorScheme="red" onClick={() => handleRemover(v.id)}>
                      Excluir
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default Vendas
