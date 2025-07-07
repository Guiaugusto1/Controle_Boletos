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
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'
import { useBoletos } from '../contexts/BoletoContext'

function Boletos() {
  const { boletos, marcarComoPago, removerBoleto } = useBoletos()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [boletoSelecionado, setBoletoSelecionado] = useState(null)

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
          {boletos.map((boleto) => (
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
