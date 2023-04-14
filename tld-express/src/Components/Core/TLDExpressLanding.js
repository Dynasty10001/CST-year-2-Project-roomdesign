import { Component, useEffect, useState} from "react";
import { Container, Box, Text,Flex, Center, VStack, Image, Spacer } from '@chakra-ui/react'

// This is where we import the TLDExpressSelection Component.
import TLDExpressSelection from "./TLDExpressSelection";

/**
 * THIS COMPONENT SERVES AS THE LANDING PAGE
 * FOR USERS VISITING THE TLDEXPRESS WEB APPLICATION
 */
export default class TLDExpressLanding extends Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return(
            <div>
                <TLDExpressLandingContent/>
            </div>
        )
    }
}


function TLDExpressSplashScreen()
{
    // THIS PORTION CONTAINS THE CODE LOGIC FOR MODAL AND CURRENT STATE OF SELECTION
    // GOES HERE. AS WELL, CODE FOR WORKING WITH REACT SPRING AS WELL!

    return(
        <Container h='calc(100vh)' maxW='100vw' p={0}>
                <video src='./TLDExpressSplash.mp4' onContextMenu={(event)=>event.preventDefault()} autoPlay muted style={{
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover"
                }}/>
        </Container>
    )
}

/**
 * THIS FUNCTIONAL COMPONENT OF COMPONENT SERVES AS THE WRAPPER
 * FOR HANDLING THE LANDING CONTENT.
 * @param {} props 
 * @returns 
 */
function TLDExpressLandingContent(props)
{
    // THIS PORTION CONTAINS THE CODE LOGIC FOR MODAL AND CURRENT STATE OF SELECTION
    // GOES HERE. AS WELL, CODE FOR WORKING WITH REACT SPRING AS WELL!
    const [showSplashScreen, setSplashScreen] = useState(true);
    const [mouseHover, setMouseHover] = useState(false);
    const [showSelection, setSelection] = useState(false);
    const [idHide, setHideID] = useState('');

    useEffect(() => {
        setInterval(() => {
            setSplashScreen(false)
        }, 4500)
    }, [])


    // This function handles a state selection where it switch the current landing page with the TLD Selection Modal
    function launchTLDExpressSelection()
    {
        // STATE CHANGE GOES HERE
        setSelection(true)
    }

    if (showSelection)
    {
        return (
            <TLDExpressSelection currentState={false} currentFormState={false}/>
        )
    }

    else
    {
        return (
                <Container h='calc(100vh)' maxW='100vw' p={0} backgroundColor='#323232'>
                    {showSplashScreen 
                        ? <TLDExpressSplashScreen/> :     
                        // Portion below is where we put our content after 4 seconds
                        <Container h='calc(100vh)' maxW='100vw' p={0}>
                            <Container h='calc(100vh)' maxW='100vw' p={0} style={{
                                position: "absolute", top: "0", zIndex: "100000"
                            }} id={idHide}>
                                <Flex width={"100vw"} height={"100vh"} alignContent={"center"} justifyContent={"center"}>
                                    <Center>
                                        <VStack align='center' w={'100%'} spacing={3}>
                                            <img src='./tld landing logo.png' style={{width: "50%"}} alt="TLD Express Logo" id='tldexpresslogo'/>
                                            <Text fontSize='3xl' as='b' color='white' pt={15} style={{width: "75%"}} textAlign={"center"} id='transform-tagline'> 
                                                TRANSFORM YOUR ROOM INTO YOUR DREAM SPACE WITH OUR 3D DESIGN TOOL!
                                            </Text>
                                            <Box as='button' w={'25%'} mt={5} onMouseOver={() => setMouseHover(true)} onMouseOut={() => setMouseHover(false)} onClick={() => {setHideID('hide-landing'); setInterval(() => {launchTLDExpressSelection()}, 800)}} data-testid='get-started' id='get-started'>
                                                <img src={mouseHover ? "./getstarted_onhover.png" : "./getstarted_offhover.png"} alt="" />
                                            </Box>
                                            <Spacer />
                                        </VStack>
                                    </Center>
                                </Flex>
                            </Container>
                            <video src='./TLDExpressBG.mp4' onContextMenu={(event)=>event.preventDefault()} autoPlay loop muted style={{
                            width: "100vw",
                            height: "100vh",
                            objectFit: "cover"
                            }}/>
                        </Container>
                    }

                </Container>

        )
    }
}