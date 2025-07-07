import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Stack,
  Select,
  useToast,
  Flex,
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef } from 'react'
import { useBoletos } from '../contexts/BoletoContext'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

function NovoBoleto() {
  const { adicionarBoleto } = useBoletos()
  const navigate = useNavigate()
  const toast = useToast()
  const location = useLocation()
  const dadosImportados = location.state || {}
  const fileInputRef = useRef(null)

  const [fornecedor, setFornecedor] = useState(dadosImportados.fornecedor || '')
  const [valor, setValor] = useState(dadosImportados.valor || '')
  const [vencimento, setVencimento] = useState(dadosImportados.vencimento || '')
  const [emissao, setEmissao] = useState(dadosImportados.emissao || '')
  const [banco, setBanco] = useState(dadosImportados.banco || '')
  const [cnpj, setCnpj] = useState(dadosImportados.cnpj || '')
  const [status, setStatus] = useState(dadosImportados.status || 'pendente')

  const handleSalvar = () => {
    if (!valor || !vencimento) {
      toast({ title: 'Preencha pelo menos o valor e a data de vencimento.', status: 'warning', isClosable: true })
      return
    }

    adicionarBoleto({
      id: Date.now(),
      fornecedor,
      valor,
      vencimento,
      emissao,
      banco,
      cnpj,
      status,
    })

    toast({ title: 'Boleto cadastrado com sucesso!', status: 'success', isClosable: true })
    navigate('/boletos')
  }

  const handleImportarPDF = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()

    reader.onload = async function () {
      const typedarray = new Uint8Array(reader.result)
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise
      let textoCompleto = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        textoCompleto += content.items.map((item) => item.str).join(' ')
      }

      const valorExtraido = textoCompleto.match(/R\$\s?(\d+[\.,]?\d*)/i)?.[1]?.replace(',', '.') || ''
      const vencimentoExtraido = textoCompleto.match(/vencimento\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i)?.[1] || ''
      const emissaoExtraida = textoCompleto.match(/emiss[aã]o\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i)?.[1] || ''
      const bancoExtraido = textoCompleto.match(/Banco\s*(\d{3})/)?.[1] || ''
      const cnpjExtraido = textoCompleto.match(/(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/)?.[1] || ''
      const fornecedorExtraido = textoCompleto.match(/Fornecedor\s*[:\-]?\s*([\w\s]+)/i)?.[1] || ''

      setValor(valorExtraido)
      setVencimento(vencimentoExtraido)
      setEmissao(emissaoExtraida)
      setBanco(bancoExtraido)
      setCnpj(cnpjExtraido)
      setFornecedor(fornecedorExtraido)

      toast({ title: 'Dados preenchidos a partir do PDF. Revise antes de salvar.', status: 'info', isClosable: true })
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <Box maxW="600px" mx="auto">
      <Heading size="md" mb={4}>Cadastrar Novo Boleto</Heading>

      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Fornecedor</FormLabel>
          <Input value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Valor (R$)</FormLabel>
          <Input type="number" value={valor} onChange={(e) => setValor(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Vencimento</FormLabel>
          <Input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Emissão</FormLabel>
          <Input type="date" value={emissao} onChange={(e) => setEmissao(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Banco</FormLabel>
          <Input value={banco} onChange={(e) => setBanco(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>CNPJ</FormLabel>
          <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Status</FormLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="vencido">Vencido</option>
          </Select>
        </FormControl>

        <Flex gap={3} justify="flex-end" wrap="wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleImportarPDF}
            style={{ display: 'none' }}
          />
          <Button onClick={() => fileInputRef.current.click()} variant="outline">Importar PDF</Button>
          <Button onClick={() => navigate('/boletos')} variant="ghost">Cancelar</Button>
          <Button colorScheme="teal" onClick={handleSalvar}>Salvar</Button>
        </Flex>
      </Stack>
    </Box>
  )
}

export default NovoBoleto
