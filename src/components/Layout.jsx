import {
  Box,
  Flex,
  Link,
  VStack,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react'
import { NavLink, Outlet } from 'react-router-dom'
import { Home, FileText, DollarSign, ShoppingCart, Users, BarChart } from 'lucide-react'

const menuLinks = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Boletos', path: '/boletos', icon: FileText },
  { label: 'Despesas', path: '/despesas', icon: DollarSign },
  { label: 'Vendas', path: '/vendas', icon: ShoppingCart },
  { label: 'Fiados', path: '/fiados', icon: Users },
  { label: 'Relatórios', path: '/relatorios', icon: BarChart },
]

function Layout() {
  return (
    <Flex minH="100vh">
      {/* Menu lateral */}
      <Box w="230px" bg="gray.100" p={5} boxShadow="md">
        <Heading size="md" mb={6} color="teal.600">Controle</Heading>
        <VStack align="stretch" spacing={3}>
          {menuLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              as={NavLink}
              to={path}
              display="flex"
              alignItems="center"
              gap={2}
              fontWeight="medium"
              p={2}
              borderRadius="md"
              color="gray.700"
              _hover={{ bg: 'teal.100', textDecoration: 'none' }}
              _activeLink={{ bg: 'teal.500', color: 'white' }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </VStack>
      </Box>

      {/* Conteúdo principal */}
      <Box flex="1" bg="gray.50">
        {/* Cabeçalho fixo */}
        <Box px={6} py={4} borderBottom="1px solid #E2E8F0" bg="white">
          <Text fontSize="lg" fontWeight="bold" color="gray.700">
            Sistema de Controle de Loja
          </Text>
        </Box>

        {/* Área da página */}
        <Box p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}

export default Layout
