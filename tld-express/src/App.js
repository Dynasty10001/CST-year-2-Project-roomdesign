import './App.css';
import TLDExpressSelection from './Components/Core/TLDExpressSelection';
import TLDExpressLanding from './Components/Core/TLDExpressLanding';
import fontStyle from './theme'
import { ChakraProvider } from '@chakra-ui/react'
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react'

let buttonClicked = false;

function App() {
  return(
    <ChakraProvider theme={fontStyle}>
      <TLDExpressLanding/>
    </ChakraProvider>
  )
}

export default App;

function TurnOnRoom(props){
  buttonClicked = true
}