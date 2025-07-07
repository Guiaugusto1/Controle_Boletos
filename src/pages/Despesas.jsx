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

function Despesas() {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState('')
  const [lista, setLista] = useState([])
  const [editandoId, setEditandoId] = useState(null)

  const [filtroData, setFiltroData] = useState('')
  const [ordenarPor, setOrdenarPor] = useState('')

  const toast = useToast()

  const handleSalvar = () => {
    if (!descricao || !valor || !data) {
      toast({ title: 'Preencha todos os campos.', status: 'warning', isClosable: true })
      return
    }

    if (editandoId) {
      setLista(
        lista.map((d) =>
          d.id === editandoId ? { ...d, descricao, valor: parseFloat(valor), data } : d
        )
      )
      toast({ title: 'Despesa editada com sucesso.', status: 'info', isClosable: true })
      setEditandoId(null)
    } else {
      const nova = {
        id: Date.now(),
        descricao,
        valor: parseFloat(valor),
        data,
      }
      setLista([...lista, nova])
      toast({ title: 'Despesa adicionada!', status: 'success', isClosable: true })
    }

    setDescricao('')
    setValor('')
    setData('')
  }

  const handleEditar = (item) => {
    setEditandoId(item.id)
    setDescricao(item.descricao)
    setValor(item.valor.toString())
    setData(item.data)
  }

  const handleRemover = (id) => {
    setLista(lista.filter((d) => d.id !== id))
  }

  let listaFiltrada = [...lista]

  if (filtroData) {
    listaFiltrada = listaFiltrada.filter((d) => d.data.startsWith(filtroData))
  }

  if (ordenarPor === 'data_asc') {
    listaFiltrada.sort((a, b) => new Date(a.data) - new Date(b.data))
  } else if (ordenarPor === 'data_desc') {
    listaFiltrada.sort((a, b) => new Date(b.data) - new Date(a.data))
  } else if (ordenarPor === 'valor_asc') {
    listaFiltrada.sort((a, b) => a.valor - b.valor)
  } else if (ordenarPor === 'valor_desc') {
    listaFiltrada.sort((a, b) => b.valor - a.valor)
  }

  const total = listaFiltrada.reduce((acc, d) => acc + d.valor, 0)

  return (
    <Box>
      <Heading size="lg" mb={4}>Despesas</Heading>

      <Stack spacing={4} maxW="500px">
        <FormControl>
          <FormLabel>Descrição</FormLabel>
          <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Valor (R$)</FormLabel>
          <Input type="number" value={valor} onChange={(e) => setValor(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Data</FormLabel>
          <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </FormControl>
        <Stack direction="row" justify="flex-end">
          <Button variant="ghost" onClick={() => { setDescricao(''); setValor(''); setData(''); setEditandoId(null) }}>Cancelar</Button>
          <Button colorScheme="teal" onClick={handleSalvar}>{editandoId ? 'Atualizar' : 'Salvar'}</Button>
        </Stack>
      </Stack>

      <Box mt={10}>
        <Heading size="md" mb={3}>Despesas do Mês</Heading>
        <HStack spacing={4} mb={3} wrap="wrap">
          <Input
            type="month"
            placeholder="Filtrar por mês"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            maxW="200px"
          />
          <Select
            placeholder="Ordenar por..."
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
            maxW="200px"
          >
            <option value="data_asc">Data crescente</option>
            <option value="data_desc">Data decrescente</option>
            <option value="valor_asc">Valor crescente</option>
            <option value="valor_desc">Valor decrescente</option>
          </Select>
        </HStack>
        <Text mb={2}>Total: <strong>R$ {total.toFixed(2)}</strong></Text>

        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Descrição</Th>
              <Th>Valor</Th>
              <Th>Data</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {listaFiltrada.map((d) => (
              <Tr key={d.id}>
                <Td>{d.descricao}</Td>
                <Td>R$ {d.valor.toFixed(2)}</Td>
                <Td>{d.data}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button size="xs" colorScheme="blue" onClick={() => handleEditar(d)}>
                      Editar
                    </Button>
                    <Button size="xs" colorScheme="red" onClick={() => handleRemover(d.id)}>
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

export default Despesas
