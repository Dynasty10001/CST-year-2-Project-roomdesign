import { Component, useEffect, useState} from "react";
import { Container, Box, Text, Center, VStack, Divider,  Modal,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
Flex, SimpleGrid, defineStyle, defineStyleConfig, Image } from "@chakra-ui/react";
import RoomLayoutUI from '../Core/RoomLayoutUI';
import AddItemForm from "./AddItemForm";



/**
 * COMPONENT FOR ALLOWING USERS TO SELECT
 * WHETHER OR NOT THEY WANT TO CREATE A ROOM OR ADD TEMPLATE/ITEMS TO DATABASE
 */
export default class TLDExpressSelection extends Component
{
    constructor(props) { 
        super(props)
        this.currentState = this.props.currentNormalState
        this.currentFormState = this.props.currentFormState
    }

    render() {
        return (
            <div>
                <TLDSelectionModal currentNormState={this.currentState} currentFormState={this.currentFormState}/>
            </div>
        )               
    }
}

/**THIS PORTION IS ONLY FOR THE STYLING */


/**
 * THIS FUNCTION SERVES AS THE MAIN SELECTION MODAL IF THE USER
 * WANTS TO SELECT EITHER MAKING A ROOM OR ADD AN ITEM TO THE DATABASE.
 * 
 * REMEMBER EPIC CODERS: DONT FORGET USESTATES AND USEDISCLOSURES OR MODAL BE NOT HAPPY!!!!!
 *                      ALSO IMPORT ROOM AND ADDITEMFORM
 */
function TLDSelectionModal(props)
{
    // CODE LOGIC FOR MODAL AND CURRENT STATE OF SELECTION GOES HERE
    const [mouseHover, setMouseHover] = useState(false);
    const [mouseSecondHover, setMouseSecondHover] = useState(false);
    const [launchNorm, setLaunchNormal] = useState(props.currentNormState)
    const [launchForm, setLaunchForm] = useState(props.currentFormState)

    

    // IF THE USER SELECTS "CREATE ROOM" BUTTON, THE CURRENT MODAL CLOSES AND ROOMUI LAUNCHES.
    function launchNormalMode()
    {
        //LOGIC OF RETURNING ROOM UI GOES HERE
        // AS WELL CLOSING DOWN CURRENT MODAL!
        setLaunchNormal(true)
    }
    

    // IF THE USER SELECTS "ADD TEMPLATE/ITEMS TO DATABASE", THE CURRENT MODAL CLOSES AND ADDITEMFORM COMPONENT LAUNCHES
    function launchItemFormMode()
    {
        //LOGIC OF RETURNING ADDITEMFORM GOES HERE
        // AS WELL CLOSING DOWN CURRENT MODAL!
        setLaunchForm(true)
        
    }

            if (launchNorm)
            {
                return (
                    <RoomLayoutUI/>
                )
            }

            else if (launchForm)
            {
                return (
                    <AddItemForm/>
                )
            }

            else
            {
            return(
                <Container  h='calc(100vh)' maxW='calc(100vw)' centerContent p={0} bgColor='#323232' data-testid='tld-express-selection'>
                        <Container h='calc(100vh)' maxW='calc(100vw)' centerContent boxShadow='lg' style={{
                                position: "absolute", top: "0", zIndex: "100000"
                            }}>
                            <Flex width={"100vw"} height={"100vh"} alignContent={"center"} justifyContent={"center"} id='main-container-selection'>
                            <Center>
                                <Box maxW='container.md' bg='white' borderWidth='1px' borderRadius='lg' padding="10">
                                    <Center>
                                        <VStack align='center' spacing={1}>
                                            <Text fontWeight='bold' fontSize='4xl'>EXPLORE BEYOND EXPECTATIONS</Text>
                                            <Text fontWeight='normal' fontSize='2xl'>Make a room and start configuring cabinets</Text>
                                            <Text fontWeight='normal' fontSize='2xl'>or add a specific item into the database.</Text>
                                            <Divider padding={2} size={5}/>
                                            <Flex alignContent={"center"} justifyContent={"center"} padding="2">
                                                <Box as='button' borderRadius='lg' boxShadow='lg'
                                                    onMouseOver={() => setMouseHover(true)} 
                                                    onMouseOut={() => setMouseHover(false)} 
                                                    onClick={() => launchNormalMode()}
                                                    bg={mouseHover ? "#333333" : "white"} margin="5" padding="5">
                                                    <VStack align='center' spacing={1}>
                                                        <img width={"100%"} src={mouseHover ? "./room_onhover.png" : "./room_offhover.png"} alt=""/>
                                                        <Text fontWeight='bold' textAlign="center"  color={mouseHover ? "white" : "black"} fontSize='3xl' data-testid='create-room'>CREATE ROOM</Text>
                                                    </VStack>
                                                </Box>
                                                <Box as='button' borderRadius='lg' boxShadow='lg' 
                                                onMouseOver={() => setMouseSecondHover(true)} 
                                                onMouseOut={() => setMouseSecondHover(false)} 
                                                onClick={() => launchItemFormMode()}
                                                bg={mouseSecondHover ? "#333333" : "white"} margin="5" padding="5">
                                                    <VStack align='center' spacing={1}>
                                                        <img src={mouseSecondHover ? "./adddb_onhover.png" : "./adddb_offhover.png"} alt=""/>
                                                
                                                        <Text fontWeight='bold' color={mouseSecondHover ? "white" : "black"} textAlign="center" fontSize='3xl'>ADD ITEMS TO DATABASE</Text>
                                                    </VStack>
                                                </Box>
                                            </Flex>
                                        </VStack>
                                    </Center>
                                </Box>
                            </Center>
                        </Flex>
                    <Image src='./TLDEXPRESS Logo.png' padding={2} marginBottom={5}/>
                    </Container>
                    <video src='./TLDExpressBG.mp4' onContextMenu={(event)=>event.preventDefault()} autoPlay loop muted style={{
                            width: "100vw",
                            height: "100vh",
                            objectFit: "cover"
                            }}/>
                </Container>
            )
            }

}