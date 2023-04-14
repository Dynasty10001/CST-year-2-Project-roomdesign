import { Component, useEffect, useRef, React } from "react";
import * as THREE from 'three'
import { ChakraProvider as div, FormControl, FormErrorMessage, FormLabel, IconButton, Spacer, Stack } from '@chakra-ui/react'
import {
    Modal,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Image,
    Input,
    Text,
    Flex,
    Box,
    Heading,
    VStack,
    allowMouseWheel
} from '@chakra-ui/react'
import { useState } from "react";
import Room from "../Core/Room";
import { makeAllCustomWalls } from "../Core/Wall"
import { inherits } from "@babel/types";
import { Icon } from '@chakra-ui/react';
import { DeleteIcon, EditIcon, QuestionOutlineIcon, WarningTwoIcon } from '@chakra-ui/icons';


let modalComplete = false;
let roomID;
let numberOfWalls;


var renderer, scene, camera;

var line;
var MAX_POINTS = 500;
var drawCount;
var splineArray = [];

export class TwoDimentionalDraw extends Component {

    constructor(props) {
        super(props)

        this.state = {
            lineArray: []
        }
    }

    render(props) {
        return (
            <LaunchDrawer close2DView={this.props.close2DView} closeParentModal={this.props.closeParentModal}
                roomRenderStuff={this.props.roomRenderStuff} setRoomID={this.props.setRoomID} setStateNumerOfWalls={this.props.setStateNumerOfWalls}
                setModalComplete={this.props.setModalComplete} />
        )
    }
}





export function LaunchDrawer(props) {

    // required for modal
    const { isOpen, onOpen, onClose } = useDisclosure()
    // state for Modal
    const [ModalType, setModalType] = useState("Layout")
    let [LineArray, setLineArray] = useState([])
    const [RoomId, setRoomId] = useState()
    let drawingCanvas, canvasContext, fromXY, toXY, pushLine, tempP, startingDot = { x: 0, y: 0 };
    const [LoadingState, setLoadingState] = useState(false)

    const [blurEnabled, setBlurEnabled] = useState(true);
    const [canvasVisible, setCanvasVisible] = useState(false);
    const [startButtonVisible, setStartButtonVisible] = useState(false);
    const [clearButtonVisible, setClearButtonVisible] = useState(false);
    const [submitButtonDisable, setSeubmitButtonDisable] = useState(true);

    //how many pixels equals 1 metre
    const lengthScale = 50.0
    // boolean that descibes if the room has snapped to the begining of the first line and has been drawn and added to the line array
    let roomIsClose = false


    fromXY = {
        x: 0,
        y: 0
    }

    toXY = {
        x: 0,
        y: 0
    }

    pushLine = {
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0
    }


    // On load this will launch the modal to select layout
    // when modals are submitted this will NOT laucnh the modals
    useEffect(() => {
        onOpen()


    })


    //is "working" but throwing some error that need to be fixed
    function clickHandler(mouse) {
        if (mouse.offsetX == undefined || mouse.offsetY == undefined) {
            mouse.offsetX = mouse.screenX
            mouse.offsetY = mouse.screenY
        }

        if (fromXY.x === 0) { //first click
            fromXY.x = mouse.offsetX
            fromXY.y = mouse.offsetY
            startingDot = {
                x: mouse.offsetX,
                y: mouse.offsetY
            }
        }
        else if (roomIsClose === false) {
            if (mouse.offsetX == undefined || mouse.offsetY == undefined) {
                mouse.offsetX = mouse.screenX
                mouse.offsetY = mouse.screenY
            }
            if (isInStartingDot(mouse) === false || LineArray.length < 2) {
                if (mouse.offsetX == undefined || mouse.offsetY == undefined) {
                    mouse.offsetX = mouse.screenX
                    mouse.offsetY = mouse.screenY
                }
                toXY.x = mouse.offsetX
                toXY.y = mouse.offsetY

                drawClick()
                pushLine = {
                    fromX: fromXY.x,
                    fromY: fromXY.y,
                    toX: toXY.x,
                    toY: toXY.y
                }
                LineArray.push(pushLine)
                fromXY.x = pushLine.toX
                fromXY.y = pushLine.toY
            }
            else {
                toXY.x = startingDot.x
                toXY.y = startingDot.y

                drawClick()
                pushLine = {
                    fromX: fromXY.x,
                    fromY: fromXY.y,
                    toX: toXY.x,
                    toY: toXY.y
                }
                LineArray.push(pushLine)
                roomIsClose = true
            }
        }
        if (LineArray.length > 1) {
            showStartingDot()
        }

        if(LineArray.length >= 3)
        {
            setSeubmitButtonDisable(false)
        }
        if(LineArray.length < 3)
        {
            setSeubmitButtonDisable(true)
        }
    }

    // displays a a small circle at the staring point of tghe firtst line
    function showStartingDot() {
        canvasContext.beginPath()
        canvasContext.arc(startingDot.x, startingDot.y, 10, 0, 2 * Math.PI, false)
        canvasContext.fillStyle = "#0000cc"
        canvasContext.fill()
        canvasContext.lineWidth = 2
        canvasContext.strokeStyle = "black"
        canvasContext.stroke()
    }


    // draws the lines when the mouse moves
    function moveHandler(mouse) {
        if (mouse.offsetX == undefined || mouse.offsetY == undefined) {
            mouse.offsetX = mouse.screenX
            mouse.offsetY = mouse.screenY
        }
        if (fromXY.x != 0 && isInStartingDot(mouse) === false && roomIsClose === false) {
            canvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
            reDrawLines()
            toXY.x = mouse.offsetX
            toXY.y = mouse.offsetY
            drawMove()
        }
        else if (isInStartingDot(mouse) === true && roomIsClose === false) {
            snapToBegining()
        }
        // tempP.innerText =
        //     "\toffset X: " + mouse.offsetX + "\tY: " + mouse.offsetY
        //     + "\n X:" + fromXY.x + "\tY:  " + fromXY.y

    }

    //snaps the curretn line to the begining point
    function snapToBegining() {
        canvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
        canvasContext.beginPath()
        canvasContext.moveTo(fromXY.x, fromXY.y)
        canvasContext.lineTo(startingDot.x, startingDot.y)
        canvasContext.strokeStyle = "yellow";
        canvasContext.lineWidth = 10;
        canvasContext.stroke()
        canvasContext.closePath()
        reDrawLines()
        toXY.x = startingDot.x
        toXY.y = startingDot.y
    }

    //return true or false if it is within 20 pizels of the starting point
    function isInStartingDot(mouse) {
        if (mouse.offsetX == undefined || mouse.offsetY == undefined) {
            mouse.offsetX = mouse.screenX
            mouse.offsetY = mouse.screenY
        }

        if (mouse.offsetX < startingDot.x + 10 && mouse.offsetX > startingDot.x - 10
            && mouse.offsetY < startingDot.y + 10 && mouse.offsetY > startingDot.y - 10 && LineArray.length > 1) {
            return true
        }
        else {
            return false
        }
    }

    function reDrawLines() {
        LineArray.forEach(line => {
            canvasContext.beginPath()
            canvasContext.moveTo(line.fromX, line.fromY)
            canvasContext.lineTo(line.toX, line.toY)
            canvasContext.strokeStyle = "black";
            canvasContext.lineWidth = 10;
            canvasContext.stroke()
            canvasContext.closePath()

            // let curLineLength
            // curLineLength = Math.pow((Math.abs(fromXY.x - toXY.x)), 2) +
            //     Math.pow((Math.abs(fromXY.y - toXY.y)), 2);
            // curLineLength = Math.sqrt(curLineLength) / lengthScale
            // canvasContext.font = 'bold 50px Arial';
            // canvasContext.fillStyle = 'white';
            // canvasContext.fillText(curLineLength, Math.abs(line.fromX + line.toX)/2,Math.abs(line.fromY + line.toY)/2);
            // Calculate the angle of the line
            let curLineLength = Math.sqrt(Math.pow(line.toX - line.fromX, 2) + Math.pow(line.toY - line.fromY, 2)) / lengthScale;

            canvasContext.font = 'bold 50px Arial';
            canvasContext.fillStyle = 'white';

            let centerX = (line.fromX + line.toX) / 2;
            let centerY = (line.fromY + line.toY) / 2;

            let angle = Math.atan2(line.toY - line.fromY, line.toX - line.fromX);
            let textX = centerX + Math.cos(angle) * 20; // adjust 20 to control text offset
            let textY = centerY + Math.sin(angle) * 20;

            canvasContext.fillText(curLineLength.toFixed(2) + "M", textX, textY);


        });
        // if there are 2 or more lines show a dot at the starting point
        if (LineArray.length > 1) {
            showStartingDot()
        }
    }

    //clears the canvas
    function clear() {
        fromXY = {
            x: 0,
            y: 0
        }

        toXY = {
            x: 0,
            y: 0
        }
        LineArray = []

        drawingCanvas = document.getElementById('wallCanvas')
        tempP = document.getElementById("mousecord")
        drawingCanvas.onclick = clickHandler
        drawingCanvas.onmousemove = moveHandler
        canvasContext = drawingCanvas.getContext("2d")

        canvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height)
        roomIsClose = false
        canvasContext.restore()
        document.getElementById("angle").innerHTML = "N/A"
        document.getElementById("length").innerHTML = "N/A"
        if(LineArray.length < 3)
        {
            setSeubmitButtonDisable(true)
        }

    }

    //draws a line from first click to current mouse pos
    //will also update length and angle
    function drawMove() {
        canvasContext.beginPath()
        canvasContext.moveTo(fromXY.x, fromXY.y)
        canvasContext.lineTo(toXY.x, toXY.y)
        canvasContext.strokeStyle = "yellow";
        canvasContext.lineWidth = 10;
        canvasContext.stroke()
        canvasContext.closePath()
        setLength()
        // there is a line in the array show the angle between them
        if (LineArray.length > 0) {
            setAngle()

        }

    }

    //wll set the angle span to the proper angle
    function setAngle() {
        let angleSpan = document.getElementById("angle")
        let prevline = LineArray[LineArray.length - 1]
        let prevLineLengthSqr, curLineLengthSqr, hypotenuseSqr, curAngle
        prevLineLengthSqr = Math.pow((Math.abs(prevline.fromX - prevline.toX)), 2) +
            Math.pow((Math.abs(prevline.fromY - prevline.toY)), 2);
        curLineLengthSqr = Math.pow((Math.abs(fromXY.x - toXY.x)), 2) +
            Math.pow((Math.abs(fromXY.y - toXY.y)), 2);
        hypotenuseSqr = Math.pow((Math.abs(prevline.fromX - toXY.x)), 2) +
            Math.pow((Math.abs(prevline.fromY - toXY.y)), 2);
        curAngle = prevLineLengthSqr + curLineLengthSqr - hypotenuseSqr

        curAngle = curAngle / (2 * Math.sqrt(prevLineLengthSqr) * Math.sqrt(curLineLengthSqr))
        curAngle = Math.acos(curAngle)

        curAngle = curAngle * 180 / Math.PI
        //console.log(curAngle);
        angleSpan.innerHTML = curAngle.toFixed(1)
    }

    //wll set the length span to the proper length
    function setLength() {
        let lengthSpan = document.getElementById("length")
        let curLineLength
        curLineLength = Math.pow((Math.abs(fromXY.x - toXY.x)), 2) +
            Math.pow((Math.abs(fromXY.y - toXY.y)), 2);
        curLineLength = Math.sqrt(curLineLength) / lengthScale
        lengthSpan.innerHTML = curLineLength.toFixed(1)
    }

    //makes line stop moving and adds to line array
    function drawClick() {
        canvasContext.beginPath()
        canvasContext.moveTo(fromXY.x, fromXY.y)
        canvasContext.lineTo(toXY.x, toXY.y)
        canvasContext.strokeStyle = "black";
        canvasContext.lineWidth = 10;
        canvasContext.stroke()
        canvasContext.closePath()
    }

    //turns on room, doesn't close drawer
    function submitHandler(props) {
        onClose()
        TurnOnRoom(LineArray, lengthScale, props)
    }

    //doesnt close drawer
    async function cancelHandler() {
        await onClose()
    }

    function startDrawing() {

        setClearButtonVisible(true)
        setStartButtonVisible(true)
        drawingCanvas = document.getElementById('wallCanvas')
        tempP = document.getElementById("mousecord")
        drawingCanvas.onclick = clickHandler
        drawingCanvas.onmousemove = moveHandler
        canvasContext = drawingCanvas.getContext("2d")

        canvasContext.save()
        // Make it visually fill the positioned parent

        // ...then set the internal size to match
        drawingCanvas.width = drawingCanvas.offsetWidth;
        drawingCanvas.height = drawingCanvas.offsetHeight;
        roomIsClose = false
        setBlurEnabled(false)
        setCanvasVisible(true)
        // setLoadingState(false)


    }

    /**
        * this return creates the basic modal, and selects which of the previous functions are to be used to fill in the body of the modal.
        * Switch drawer to layoutui and just return canvas in this file
        */
    return (
        <div style={{ backgroundColor: '#323232' }} data-testid="CanvasParent" >

            <Drawer placement={'bottom'} onClose={onClose} isOpen={isOpen} size={'full'} closeOnOverlayClick={false} closeOnEsc={false} >
                <DrawerOverlay />
                <DrawerContent bg="gray.900" color="white" border="1px solid" borderColor="gray.700" borderTopRadius="20px" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)">
                    {/* <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text fontSize="2xl">{`Custom Layout | Current Angle: `}<span data-testid="Angle" id="angle">N/A</span>{` Length of Current Line: `}<span id="length" data-testid="Length">N/A</span>{` metres`}</Text>

                        </Flex>
                    </DrawerHeader>  */}
                    <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Box>
                                <Text fontSize="2xl">Custom Layout</Text>
                                <Text fontSize="md" color="gray.500">Current Angle: <span data-testid="Angle" id="angle">N/A</span></Text>
                                <Text fontSize="md" color="gray.500">Length of Current Line: <span id="length" data-testid="Length">N/A</span> metres</Text>
                            </Box>
                            <Box>

                                <Button variant="ghost" mr={2} onClick={props.close2DView}>
                                    Cancel
                                </Button>
                                <Button isDisabled={submitButtonDisable} colorScheme="gray" color="black" onClick={() => {
                                    submitHandler(props)
                                    props.close2DView()
                                }}>
                                    Submit
                                </Button>
                            </Box>
                        </Flex>
                    </DrawerHeader>
                    <DrawerBody p={0} display="flex" flexDirection="column">
                        <Box height="100%" display={canvasVisible ? "none" : "flex"} alignItems="center" justifyContent="center">
                            <Box
                                bg="yellow.400"
                                color="gray.800"
                                p={4}
                                textAlign="center"
                                borderRadius="md"
                                boxShadow="md"
                            >
                                <Heading as="h3" size="md" mb={2} color="gray.800">
                                    <Icon as={WarningTwoIcon} mr={0} />Warning
                                </Heading>
                                <Text fontSize="lg">
                                    Please draw clockwise after clicking the "Start Drawing" button.
                                </Text>
                                <Button colorScheme="green" mt={4} onClick={() => { setCanvasVisible(true); setClearButtonVisible(true); }}>
                                    <Icon as={EditIcon} mr={2} />
                                    Continue
                                </Button>
                            </Box>
                        </Box>
                        <Box
                            bg="white"
                            position="relative"
                            overflow="hidden"
                            style={{
                                width: "100%",
                                height: canvasVisible ? "100%" : 0,
                                transition: "height 0.3s ease-in-out",
                            }}
                        >
                            <canvas
                                ref={drawingCanvas}
                                id="wallCanvas"
                                data-testid="TwoDimensionalCanvas"
                                style={{
                                    background: `repeat center/80% url('./2DViewBackGround.jpg')`,
                                    width: "100%",
                                    height: "100%",
                                    opacity: canvasVisible ? 1 : 0,
                                    transition: "opacity 0.5s ease-in-out, filter 0.05s ease-in-out",
                                    filter: blurEnabled ? "blur(5px) invert(100%)" : "none"
                                }}
                            ></canvas>
                           {blurEnabled  && (
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    width="100%"
                                    height="100%"
                                    bg="rgba(0, 0, 0, 0.1)"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <VStack>
                                       <img src='./tagline_tutorial.png' alt='' style={{width: "30%"}}/>
                                        <video src='./tutorial.mp4' onContextMenu={(event)=>event.preventDefault()} autoPlay loop muted style={{
                                            width: "45%",
                                            height: "45%",
                                            borderRadius: "25px",
                                            padding: "10px"
                                        }}/>
                                            <Spacer/>
                                            <img src='./tagline_start.png' alt='' style={{width: "30%"}}/>
                                    </VStack>
                                </Box>
                            )}
                        </Box>
                       
                        {clearButtonVisible && (
                            <Flex justifyContent="center" alignItems="center" p={4} borderTopWidth="1px" borderColor="gray.700">
                                <Button colorScheme="red" mr={2} onClick={() => clear()}>
                                    <Icon as={DeleteIcon} mr={2} />
                                    Clear
                                </Button>
                                <Button colorScheme="green" mr={2} onClick={() => startDrawing()} isDisabled={startButtonVisible}>
                                    <Icon as={EditIcon} mr={2} />
                                    Start Drawing
                                </Button>
                            </Flex>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>


        </div>
    )
}

// does render room, does not close drawer
async function TurnOnRoom(lineArray, lengthScale, props) {

    const returnedWalls = await makeAllCustomWalls(lineArray, lengthScale) // makes walls from the line array

    numberOfWalls = lineArray.length
    roomID = returnedWalls.roomID

    await props.setStateNumerOfWalls(numberOfWalls)
    await props.setRoomID(roomID)
    props.closeParentModal()
    modalComplete = true;
    props.roomRenderStuff()
}