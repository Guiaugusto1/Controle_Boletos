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
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useBoletos } from '../contexts/BoletoContext'

function Boletos() {
  const { boletos } = useBoletos()

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
          </Tr>
        </Thead>
        <Tbody>
          {boletos.map((boleto) => (
            <Tr key={boleto.id}>
              <Td>{boleto.fornecedor}</Td>
              <Td>{parseFloat(boleto.valor).toFixed(2)}</Td>
              <Td>{boleto.vencimento}</Td>
              <Td>
                <Tag colorScheme={getStatusColor(boleto.status)}>
                  {boleto.status.toUpperCase()}
                </Tag>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default Boletos
