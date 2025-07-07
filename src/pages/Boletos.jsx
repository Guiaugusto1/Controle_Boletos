// 📄 src/pages/Boletos.jsx
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Tag,
  Link,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Input,
  Select,
  Flex,
  InputGroup,
  InputLeftAddon,
  Divider,
  Stack,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'
import { useBoletos } from '../contexts/BoletoContext'

function Boletos() {
  const { boletos, marcarComoPago, removerBoleto } = useBoletos()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [boletoSelecionado, setBoletoSelecionado] = useState(null)

  const [statusFiltro, setStatusFiltro] = useState('')
  const [fornecedorFiltro, setFornecedorFiltro] = useState('')
  const [valorMinimo, setValorMinimo] = useState('')
  const [valorMaximo, setValorMaximo] = useState('')
  const [ordem, setOrdem] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'pago':
        return 'green'
      case 'pendente':
        return 'yellow'
      case 'vencido':
        return 'red'
      default:
        return 'gray'
    }
  }

  const abrirDetalhes = (boleto) => {
    setBoletoSelecionado(boleto)
    onOpen()
  }

  let boletosFiltrados = boletos.filter((b) => {
    const fornecedorOk = fornecedorFiltro.trim() === '' || b.fornecedor?.toLowerCase().includes(fornecedorFiltro.toLowerCase())
    const statusOk = statusFiltro === '' || b.status === statusFiltro
    const valorOk =
      (!valorMinimo || parseFloat(b.valor) >= parseFloat(valorMinimo)) &&
      (!valorMaximo || parseFloat(b.valor) <= parseFloat(valorMaximo))
    return fornecedorOk && statusOk && valorOk
  })

  if (ordem === 'valor_asc') {
    boletosFiltrados.sort((a, b) => a.valor - b.valor)
  } else if (ordem === 'valor_desc') {
    boletosFiltrados.sort((a, b) => b.valor - a.valor)
  } else if (ordem === 'data_asc') {
    boletosFiltrados.sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento))
  } else if (ordem === 'data_desc') {
    boletosFiltrados.sort((a, b) => new Date(b.vencimento) - new Date(a.vencimento))
  }

  const totalFiltrado = boletosFiltrados.reduce((acc, b) => acc + parseFloat(b.valor || 0), 0)

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Lista de Boletos
      </Heading>

      <Link as={RouterLink} to="/boletos/novo">
        <Button colorScheme="teal" mb={4}>
          Novo Boleto
        </Button>
      </Link>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={4} flexWrap="wrap">
        <Input
          placeholder="Fornecedor"
          value={fornecedorFiltro}
          onChange={(e) => setFornecedorFiltro(e.target.value)}
          maxW="200px"
        />
        <Select
          placeholder="Status"
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          maxW="150px"
        >
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
          <option value="vencido">Vencido</option>
        </Select>
        <InputGroup maxW="150px">
          <InputLeftAddon>Min R$</InputLeftAddon>
          <Input
            type="number"
            value={valorMinimo}
            onChange={(e) => setValorMinimo(e.target.value)}
          />
        </InputGroup>
        <InputGroup maxW="150px">
          <InputLeftAddon>Max R$</InputLeftAddon>
          <Input
            type="number"
            value={valorMaximo}
            onChange={(e) => setValorMaximo(e.target.value)}
          />
        </InputGroup>
        <Select
          placeholder="Ordenar por"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
          maxW="180px"
        >
          <option value="valor_asc">Valor crescente</option>
          <option value="valor_desc">Valor decrescente</option>
          <option value="data_asc">Data mais próxima</option>
          <option value="data_desc">Data mais distante</option>
        </Select>
      </Stack>

      <Text fontSize="sm" mb={2} color="gray.600">
        <strong>{boletosFiltrados.length}</strong> boletos encontrados — Total: <strong>R$ {totalFiltrado.toFixed(2)}</strong>
      </Text>
      <Divider mb={4} />

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Fornecedor</Th>
            <Th>Valor (R$)</Th>
            <Th>Vencimento</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {boletosFiltrados.map((boleto) => (
            <Tr key={boleto.id}>
              <Td>{boleto.fornecedor || '-'}</Td>
              <Td>{parseFloat(boleto.valor || 0).toFixed(2)}</Td>
              <Td>{boleto.vencimento || '-'}</Td>
              <Td>
                <Tag colorScheme={getStatusColor(boleto.status)}>
                  {boleto.status?.toUpperCase()}
                </Tag>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Button size="sm" onClick={() => abrirDetalhes(boleto)}>
                    Detalhes
                  </Button>
                  {boleto.status !== 'pago' && (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => marcarComoPago(boleto.id)}
                    >
                      Marcar como Pago
                    </Button>
                  )}
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => removerBoleto(boleto.id)}
                  >
                    Excluir
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhes do Boleto</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {boletoSelecionado && (
              <Box>
                <Text><strong>Fornecedor:</strong> {boletoSelecionado.fornecedor}</Text>
                <Text><strong>Valor:</strong> R$ {parseFloat(boletoSelecionado.valor || 0).toFixed(2)}</Text>
                <Text><strong>Vencimento:</strong> {boletoSelecionado.vencimento}</Text>
                <Text><strong>Emissão:</strong> {boletoSelecionado.emissao}</Text>
                <Text><strong>Banco:</strong> {boletoSelecionado.banco}</Text>
                <Text><strong>CNPJ:</strong> {boletoSelecionado.cnpj}</Text>
                <Text><strong>Status:</strong> {boletoSelecionado.status}</Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Boletos
