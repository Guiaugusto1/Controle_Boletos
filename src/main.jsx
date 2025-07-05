import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import { BoletoProvider } from './contexts/BoletoContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BoletoProvider>
        <App />
      </BoletoProvider>
    </ChakraProvider>
  </React.StrictMode>
)
