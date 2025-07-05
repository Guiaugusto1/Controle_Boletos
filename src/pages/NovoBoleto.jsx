import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useBoletos } from '../contexts/BoletoContext'

function NovoBoleto() {
  const toast = useToast()
  const { adicionarBoleto } = useBoletos()

  const [form, setForm] = useState({
    valor: '',
    vencimento: '',
    emissao: '',
    banco: '',
    cnpj: '',
    fornecedor: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSalvar = () => {
    const novoBoleto = {
      ...form,
      id: Date.now(),
      status: 'pendente',
    }

    adicionarBoleto(novoBoleto)

    toast({
      title: 'Boleto salvo com sucesso!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    setForm({
      valor: '',
      vencimento: '',
      emissao: '',
      banco: '',
      cnpj: '',
      fornecedor: '',
    })
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>Novo Boleto</Heading>

      <VStack spacing={4} maxW="500px">
        <FormControl isRequired>
          <FormLabel>Valor (R$)</FormLabel>
          <Input type="number" name="valor" value={form.valor} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Data de Vencimento</FormLabel>
          <Input type="date" name="vencimento" value={form.vencimento} onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Data de Emissão</FormLabel>
          <Input type="date" name="emissao" value={form.emissao} onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Banco</FormLabel>
          <Input name="banco" value={form.banco} onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>CNPJ do Fornecedor</FormLabel>
          <Input name="cnpj" value={form.cnpj} onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Nome do Fornecedor</FormLabel>
          <Input name="fornecedor" value={form.fornecedor} onChange={handleChange} />
        </FormControl>

        <Button colorScheme="teal" onClick={handleSalvar}>
          Salvar Boleto
        </Button>
      </VStack>
    </Box>
  )
}

export default NovoBoleto
