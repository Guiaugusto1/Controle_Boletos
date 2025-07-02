import { Box, Heading } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'


function Boletos() {
  return (
    <Link to="/boletos/novo">
  <Button colorScheme="teal" mb={4}>
    Novo Boleto
  </Button>
</Link>
    
  )
}

export default Boletos


