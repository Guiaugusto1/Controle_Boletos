// 📄 src/pages/Fiados.jsx
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
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from '@chakra-ui/react'
import { useState } from 'react'

function Fiados() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState('')

  const [valorDivida, setValorDivida] = useState('')
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [clienteHistorico, setClienteHistorico] = useState(null)

  const {
    isOpen: isOpenDivida,
    onOpen: onOpenDivida,
    onClose: onCloseDivida
  } = useDisclosure()
  const {
    isOpen: isOpenHistorico,
    onOpen: onOpenHistorico,
    onClose: onCloseHistorico
  } = useDisclosure()

  const toast = useToast()

  const adicionarCliente = () => {
    if (!nome) {
      toast({ title: 'Informe o nome do cliente.', status: 'warning', isClosable: true })
      return
    }
    const novo = {
      id: Date.now(),
      nome,
      telefone,
      dividas: [],
    }
    setClientes([...clientes, novo])
    setNome('')
    setTelefone('')
  }

  const adicionarDivida = (clienteId, valor) => {
    setClientes(clientes.map(c => {
      if (c.id === clienteId) {
        return {
          ...c,
          dividas: [...c.dividas, { valor: parseFloat(valor), pago: false, data: new Date().toISOString().split('T')[0] }]
        }
      }
      return c
    }))
  }

  const registrarPagamentoParcial = (clienteId, valorPago) => {
    setClientes(clientes.map(c => {
      if (c.id === clienteId) {
        const novas = [...c.dividas]
        let restante = parseFloat(valorPago)
        for (let d of novas) {
          if (!d.pago && restante > 0) {
            if (restante >= d.valor) {
              restante -= d.valor
              d.pago = true
            } else {
              d.valor -= restante
              restante = 0
            }
          }
        }
        return { ...c, dividas: novas }
      }
      return c
    }))
  }

  const calcularTotal = (dividas) => {
    return dividas.filter(d => !d.pago).reduce((acc, d) => acc + d.valor, 0)
  }

  const abrirDivida = (cliente) => {
    setClienteSelecionado(cliente)
    setValorDivida('')
    onOpenDivida()
  }

  const abrirHistorico = (cliente) => {
    setClienteHistorico(cliente)
    onOpenHistorico()
  }

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const totalGeral = clientes.reduce((acc, c) => acc + calcularTotal(c.dividas), 0)

  return (
    <Box>
      <Heading size="lg" mb={4}>Fiado</Heading>

      <Stack spacing={4} maxW="400px">
        <FormControl>
          <FormLabel>Nome do Cliente</FormLabel>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Telefone</FormLabel>
          <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" onClick={adicionarCliente}>Cadastrar Cliente</Button>
      </Stack>

      <Box mt={10}>
        <Heading size="md" mb={3}>Clientes com Fiado</Heading>
        <Input
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          maxW="300px"
          mb={4}
        />
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Telefone</Th>
              <Th>Total Devido</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clientesFiltrados.map((c) => {
              const total = calcularTotal(c.dividas)
              return (
                <Tr key={c.id} bg={total > 0 ? 'red.50' : 'green.50'}>
                  <Td>{c.nome}</Td>
                  <Td>{c.telefone}</Td>
                  <Td><strong>R$ {total.toFixed(2)}</strong></Td>
                  <Td>
                    <HStack>
                      <Button size="xs" onClick={() => abrirDivida(c)}>Nova Dívida</Button>
                      <Button size="xs" onClick={() => registrarPagamentoParcial(c.id, prompt('Valor pago?'))}>Pagamento</Button>
                      <Button size="xs" onClick={() => abrirHistorico(c)}>Histórico</Button>
                    </HStack>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
        <Text mt={4}><strong>Total geral pendente:</strong> R$ {totalGeral.toFixed(2)}</Text>
      </Box>

      {/* Modal de Nova Dívida */}
      <Modal isOpen={isOpenDivida} onClose={onCloseDivida} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nova Dívida para {clienteSelecionado?.nome}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Valor</FormLabel>
              <Input
                type="number"
                value={valorDivida}
                onChange={(e) => setValorDivida(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseDivida}>Cancelar</Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                adicionarDivida(clienteSelecionado.id, valorDivida)
                onCloseDivida()
              }}
            >Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Histórico */}
      <Modal isOpen={isOpenHistorico} onClose={onCloseHistorico} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Histórico de Dívidas - {clienteHistorico?.nome}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {clienteHistorico?.dividas.map((d, idx) => (
              <Box key={idx} mb={2} p={2} borderWidth="1px" borderRadius="md">
                <Text>Valor: R$ {d.valor.toFixed(2)}</Text>
                <Text>Status: {d.pago ? 'Pago' : 'Pendente'}</Text>
                <Text>Data: {d.data}</Text>
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseHistorico}>Fechar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Fiados
