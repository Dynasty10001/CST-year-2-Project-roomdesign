
import { Component, useEffect, useState } from "react";
import { Container, Box, Text, Center, VStack, Divider,  Modal,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalFooter,
    ModalBody,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
Flex, SimpleGrid, defineStyle, defineStyleConfig, Image,
Tabs, TabList, TabPanels, Tab, TabPanel, Button, ButtonGroup,  FormControl, FormLabel,
FormErrorMessage,
FormHelperText, Input, Link, Spacer, Select, Checkbox, useToast} from "@chakra-ui/react";
import { ExternalLinkIcon, AddIcon, ArrowLeftIcon } from '@chakra-ui/icons'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { getAllStyles, addStyleItemToDB, addDoorItemToDB, addCabItemToDB, getAllDoorStyles, relateCabTemplateToDoorTemplate, determineCabinetItemUnique, determineDoorItemUnique } from '../../Utilities/CabinetDB'
// DONT FORGET TO IMPORT CHAKRA, YUP AND AZUREPLOADERHANDLER

// FORM VALIDATION SCHEMA GOES HERE. PROVIDED BY YUP. NOTE THAT THIS IS SEPERATE FROM OUR SCHEMA IN THE MODELS
// AS IT IS FOR DATABASE VALIDATION. THIS VALIDATION SCHEMA IS ONLY FOR THE UI VALIDATION OF FORM.
// REFER TO THIS: https://formik.org/docs/guides/validation
import { DisplayErrorForCabForm, DisplayErrorForDoorForm, DisplayErrorForStyleForm } from "../../Models/FormTemplate";
import TLDExpressSelection from "./TLDExpressSelection";
import { uploadAssetToContainer } from "../../Utilities/AzureUploaderHandler";
import { EmptyCabForm, EmptyStyleForm, EmptyDoorForm } from "../../Models/DefaultCabForm";
import { cloneDeep, forIn, remove } from 'lodash';




let modalComplete = false;

/**
 * COMPONENT TO ALLOW USERS TO ADD INFORMATION ABOUT THEIR CURRENT CHOICE:
 * EITHER IT IS CABINET, DOOR, OR JUST STYLE
 */
export default class AddItemForm extends Component
{
    constructor() { 
        super()
    }

    render() {
        return (
            <div>
                <LaunchAddItemModal/>
            </div>
        )               
    }
}


 // This functional component allows us to change the current content of the modal to have the form inputs appropriate
    // for adding cabinet information.
    export function AddCabItemModal({onSubmit, submitHandler, objRegister, errorList, doorStyleList, isLoading})
    {

        return(
           <Container padding={3} alignContent>
                <Flex alignContent={"center"} justifyContent={"center"}>
                <form onSubmit={submitHandler(onSubmit)}>
                            <SimpleGrid columns={2} spacing={10}>
                                <Container padding={1}>
                                    <FormControl isInvalid={errorList.cabName} isRequired>
                                        <FormLabel>Cabinet Name: </FormLabel>
                                        <Input {...objRegister('cabName')}/>
                                        {errorList.cabName && <FormErrorMessage>{errorList.cabName.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl isInvalid={errorList.cabIdentifier} isRequired>
                                        <FormLabel>Cabinet Identifier: </FormLabel>
                                        <NumberInput>
                                            <NumberInputField {...objRegister('cabIdentifier', { valueAsNumber: true })}/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        {errorList.cabIdentifier && <FormErrorMessage>{errorList.cabIdentifier.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl isInvalid={errorList.cabDepth} isRequired>
                                        <FormLabel>Cabinet Depth: </FormLabel>
                                        <NumberInput>
                                            <NumberInputField {...objRegister('cabDepth', {valueAsNumber: true})}/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        {errorList.cabDepth && <FormErrorMessage>{errorList.cabDepth.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl isInvalid={errorList.cabWidth} isRequired>
                                        <FormLabel>Cabinet Width: </FormLabel>
                                        <NumberInput>
                                            <NumberInputField {...objRegister('cabWidth', { valueAsNumber: true })}/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        {errorList.cabWidth && <FormErrorMessage>{errorList.cabWidth.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl isInvalid={errorList.cabHeight} isRequired>
                                        <FormLabel>Cabinet Height: </FormLabel>
                                        <NumberInput>
                                            <NumberInputField {...objRegister('cabHeight', {valueAsNumber: true})}/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        {errorList.cabHeight && <FormErrorMessage>{errorList.cabHeight.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl isInvalid={errorList.cabNomenclature} isRequired>
                                        <FormLabel>Cabinet Nomenclature: </FormLabel>
                                        <Input {...objRegister('cabNomenclature')}/>
                                        {errorList.cabNomenclature && <FormErrorMessage>{errorList.cabNomenclature.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl isInvalid={errorList.sectionCode} isRequired>
                                        <FormLabel>Cabinet Section Code: </FormLabel>
                                        <Input {...objRegister('sectionCode')}/>
                                        {errorList.sectionCode && <FormErrorMessage>{errorList.sectionCode.message}</FormErrorMessage>}
                                    </FormControl>
                                </Container>
                                <Container padding={1} gap={3}>
                                    <FormControl isInvalid={errorList.modelPath} isRequired>
                                        <FormLabel>Cabinet 3D Object: </FormLabel>
                                        <Input type='file' placeholder='SUPPORTED FILE: OBJ' {...objRegister('modelPath')}/>
                                        {errorList.modelPath == null ? <FormHelperText textAlign={"center"}>
                                            If uploading a non-OBJ 3D Object, like DXF, ensure that is converted correctly before uploading.<br></br>
                                            For converting DXF to OBJ, use: <br></br>
                                            <Link href='https://products.aspose.app/3d/conversion/dxf-to-obj' isExternal> ASPOSE DXF TO OBJ Converter <ExternalLinkIcon mx='2px' /></Link>
                                        </FormHelperText>: <FormErrorMessage>{errorList.modelPath.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl marginTop={13} isInvalid={errorList.photoPath} isRequired>
                                        <FormLabel>Cabinet Image: </FormLabel>
                                        <Input type='file' placeholder='SUPPORTED FILES: JPEG and PNG' {...objRegister('photoPath')}/>
                                        <FormHelperText>Only PNG/JPEG photos are allowed</FormHelperText>
                                        {errorList.photoPath && <FormErrorMessage>{errorList.photoPath.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl marginTop={13} isRequired isInvalid={errorList.doorStyleSelection}>
                                        <FormLabel>Associated Door: </FormLabel>
                                        <Select placeholder='Select an associated door' {...objRegister('doorStyleSelection')}>
                                            { doorStyleList &&
                                                doorStyleList.map((style) => (
                                                    <option key={style._id} value={style.doorStyle}>{style.doorStyle}</option>
                                                ))
                                            }
                                        </Select>
                                        {errorList.doorStyleSelection && <FormErrorMessage>{errorList.doorStyleSelection.message}</FormErrorMessage>}
                                    </FormControl>
                                    <FormControl marginTop={13}>
                                        <FormLabel>Cabinet Defined as Upper?: </FormLabel>
                                        <Checkbox id='checkboxHere' {...objRegister('isUpper')}>Yes</Checkbox>
                                    </FormControl>
                                </Container>
                            </SimpleGrid>
                        <Button mt={4} bg='#323232' color='white' type='submit' isLoading={isLoading}>Submit</Button>
                    </form>
                </Flex>
           </Container>
        )

    }

    
        // This functional component allows us to change the current content of the modal to have the form inputs appropriate
    // for adding style information.
    export function AddStyleItemModal({onSubmit, submitHandler, objRegister, errorList, isLoading})
    {
        return(
            <Container padding={3} alignContent>
                <form onSubmit={submitHandler(onSubmit)}>
                    <SimpleGrid columns={2} spacing={10}>
                        <VStack padding={1}>
                            <FormControl isInvalid={errorList.databaseName}>
                                <FormLabel>Database Name: </FormLabel>
                                <Input {...objRegister('databaseName')}/>
                                {errorList.databaseName && <FormErrorMessage>{errorList.databaseName.message}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errorList.styleName}>
                                <FormLabel>Style Name: </FormLabel>
                                <Input {...objRegister('styleName')}/>
                                {errorList.styleName && <FormErrorMessage>{errorList.styleName.message}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errorList.insideEdge}>
                                <FormLabel>Inside Edge: </FormLabel>
                                <Input {...objRegister('insideEdge')}/>
                                {errorList.insideEdge && <FormErrorMessage>{errorList.insideEdge.message}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errorList.outsideEdge}>
                                <FormLabel>Outside Edge: </FormLabel>
                                <Input {...objRegister('outsideEdge')}/>
                                {errorList.outsideEdge && <FormErrorMessage>{errorList.outsideEdge.message}</FormErrorMessage>}
                            </FormControl>
                        </VStack>

                        <VStack padding={1}>
                            <FormControl isInvalid={errorList.material}>
                                <FormLabel>Material: </FormLabel>
                                <Input {...objRegister('material')}/>
                                {errorList.material && <FormErrorMessage>{errorList.material.message}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errorList.raisedPanel}>
                                <FormLabel>Raised Panel: </FormLabel>
                                <Input {...objRegister('raisedPanel')}/>
                                {errorList.raisedPanel && <FormErrorMessage>{errorList.raisedPanel.message}</FormErrorMessage>}
                            </FormControl>
                            <FormControl isInvalid={errorList.routePattern}>
                                <FormLabel>Route Pattern: </FormLabel>
                                <Input {...objRegister('routePattern')}/>
                                {errorList.routePattern && <FormErrorMessage>{errorList.routePattern.message}</FormErrorMessage>}
                            </FormControl>
                            <Button mt={4} bg='#323232' color='white' isLoading={isLoading} type='submit'>Submit</Button>
                        </VStack>
                    </SimpleGrid>
                </form>
            </Container>
        )
    }

     // This function allows us to change the current content of the modal to have the form inputs appropriate
    // for adding door information.
    export  function AddDoorItemModal({onSubmit, submitHandler, objRegister, errorList, listStyle, setFormHandler, isLoading})
    {
            return(
                <Container padding={3} alignContent>
                    <form onSubmit={submitHandler(onSubmit)}>
                        <SimpleGrid columns={2} spacing={10}>
                            <Flex padding={1} alignContent={"center"} justifyContent={"center"}>
                                <FormControl isInvalid={errorList.doorStyle}>
                                    <FormLabel>Door Style: </FormLabel>
                                    <Select placeholder='Select a style' {...objRegister('doorStyle')}>
                                        {
                                            listStyle && listStyle.map((style) => (
                                                <option key={style._id} value={style.styleName}>{style.styleName}</option>
                                            ))
                                        }
                                    </Select>
                                    {errorList.doorStyle && <FormErrorMessage>{errorList.doorStyle.message}</FormErrorMessage>}
                                    <Button marginTop={3} leftIcon={<AddIcon/>} bg='#323232' color='white' size='sm' onClick={() => {setFormHandler("STYLE")}}>
                                        CREATE STYLE
                                    </Button>
                                </FormControl>
                            </Flex>
                            <Container padding={1} gap={3}>
                                <FormControl isInvalid={errorList.modelPath}>
                                    <FormLabel>DOOR 3D Object: </FormLabel>
                                    <Input type='file' placeholder='SUPPORTED FILE: OBJ' {...objRegister('modelPath')}/>
                                    {errorList.modelPath == null ? <FormHelperText textAlign={"center"}>
                                            If uploading a non-OBJ 3D Object, like DXF, ensure that is converted correctly before uploading.<br></br>
                                            For converting DXF to OBJ, use: <br></br>
                                            <Link href='https://products.aspose.app/3d/conversion/dxf-to-obj' isExternal> ASPOSE DXF TO OBJ Converter <ExternalLinkIcon mx='2px' /></Link>
                                        </FormHelperText>: <FormErrorMessage>{errorList.modelPath.message}</FormErrorMessage>}
                                </FormControl>
                                <FormControl isInvalid={errorList.photoPath} marginTop={13}>
                                    <FormLabel>Door Image: </FormLabel>
                                    <Input type='file' placeholder='SUPPORTED FILES: JPEG and PNG' {...objRegister('photoPath')} />
                                    {errorList.photoPath && <FormErrorMessage>{errorList.photoPath.message}</FormErrorMessage>}
                                </FormControl>
                            </Container>
                        </SimpleGrid>
                        <Button mt={4} bg='#323232' color='white' type='submit' isLoading={isLoading}>Submit</Button>
                    </form>
                </Container>
        )
    }


/**
 * THIS FUNCTION SERVES AS THE MAIN FORM IF THE USER
 * WANTS TO ADD DATA OR BITS OF INFORMATION FOR THEIR CABINET, STYLE, OR DOOR
 * 
 * REMEMBER EPIC CODERS: DONT FORGET USESTATES AND USEDISCLOSURES OR MODAL BE NOT HAPPY!!!!!
 * 
 * TO LEARN MORE FORM CONTROL, REFER TO THIS: https://chakra-ui.com/docs/components/form-control/usage
 *                       
 */
function LaunchAddItemModal()
{

    const toast = useToast();
    // USEDISCLOSURES GOES HERE
    // AS WELL USE STATES FOR FORMSELECTION. DEFAULTS TO CABINET THOUGH
    // AS WELL USE STATE FOR CURRENTDATA BEING FED TO THE FORM. (CHAKRA MIGHT BE HELPFUL TO DO IT THOUGH??????)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [currentFormSelection, setForm] = useState("CABINET")
    const [listStyle, setStyle] = useState({})
    const [doorStyles, setDoorStyles] = useState(null);
    const [process, setProcess] = useState(false);
    const [failed, setFail] = useState(false);


    const { register, handleSubmit, reset , formState:{ errors } } = useForm({
        resolver: yupResolver(DisplayErrorForDoorForm),
        defaultValues: EmptyDoorForm
      });

      
    const { register: register2, handleSubmit: handleSubmit2, formState:{ errors: error2 }, reset: reset2 } = useForm({
        resolver: yupResolver(DisplayErrorForCabForm),
        defaultValues: EmptyCabForm
      });

      const { register: register3, handleSubmit: handleSubmit3, formState:{ errors: error3 }, reset: reset3 } = useForm({
        resolver: yupResolver(DisplayErrorForStyleForm),
        defaultValues: EmptyStyleForm
      });
    

    // This basically tell us that if the modal hasn't been finished, open that modal.
    // UseEffect is used upon startup!
    useEffect(() => {

        if (!modalComplete) {
            onOpen()
        }


        const retrieveData = async () =>
        {
            await getAllStyles().then((value) => {
                setStyle(value);
            })
    
            await getAllDoorStyles().then((value) => {
                setDoorStyles(value)
            })
        }

        retrieveData();

    }, [])



    function launchToast(message, status)
    {
        toast({
            title: `${message}`,
            status: status,
            isClosable: true,
          })
    }

     /**
    * This function serves as a basis to collect data, uploads the files to Azure, 
    * puts our form data into NEO4J, this function returns an object
    * based on the inputted data with the added links.
    * 
    * THIS IS MODIFIED TO USE ADDCABITEMTODB FUNCTION
    * @param {} data 
    * @param {*} currentState 
    * @returns 
    */
    const onSubmit = async (data) =>
    {
        // To ensure that our data is being into our database correctly, we usually
        // follow this order:
        // >    Upload it to Azure and get the returning BLOB
        // >    Then, we send it to the database.

        //This signals the submit button to hold/wait for the database to be processed!
        setProcess(true);

        //Extract the data so we do not touch that data object.
        const dataForm = cloneDeep(data);

        //Now, we handle the data.
        if(currentFormSelection === "STYLE")
        {
            // This portion allows us to handle database information to the inputted to the database correctly
            try
            {
                dataForm.THEOTHEREMPTYSTRING = "";
                await addStyleItemToDB(dataForm)
                reset3();
                setForm("DOOR");
                launchToast(`Successfully added a ${currentFormSelection.toLowerCase()} into the database!`, "success");

                //Refreshes us to get new data :)
                await getAllStyles().then((value) => {
                    setStyle(value);
                })
            } 
            
            catch(err) 
            {
                launchToast(`Failed adding a new ${currentFormSelection.toLowerCase()} into the Database.`, "error");
            }
        }

        else
        {
            // This is where we upload our data to the database and to the azure blob handler. However, to ensure that azure does not upload our data to the database after acknowledging
            // that we are trying to put a identifier or style that has been used already, this is where we put logic to make sure it does not happend

            if (currentFormSelection === "CABINET")
            {
                // Check if the current cabinet identifier is unique
                if (await determineCabinetItemUnique(dataForm))
                {
                    //It's unique! Let's upload it to the database and blobs
                    const filesToUpload = [];
                    filesToUpload.push(dataForm.modelPath[0])
                    filesToUpload.push(dataForm.photoPath[0]);

                    await uploadAssetToContainer(filesToUpload).then((value) => {
                        dataForm.modelPath = value.modelPath
                        dataForm.photoPath = value.photoPath
                    });

                    //This portion yanks that doorStyleSelection out!
                    let associatedDoor = dataForm.doorStyleSelection;
                    delete dataForm.doorStyleSelection;

                    try
                    {
                        await addCabItemToDB(dataForm)
                        await relateCabTemplateToDoorTemplate({cabIdentifier: dataForm.cabIdentifier}, {doorStyle: associatedDoor} )

                        //Resets the entire form!
                        reset();
                        reset2();
                        reset3();
                        launchToast(`Successfully added a ${currentFormSelection.toLowerCase()} into the database!`, "success");
                    }

                    catch
                    {
                        launchToast(`Failed adding a new ${currentFormSelection.toLowerCase()} into the Database.`, "error");
                    }
                }

                else
                {
                    //Oops! It's not unique!
                    launchToast(`Failed adding a new ${currentFormSelection.toLowerCase()} into the Database. This is due that Cabinet Identifier of "${dataForm.cabIdentifier}" already existed in database`, "error");
                }
            }

            else
            {
                // Check if the current door style is unique
                if (await determineDoorItemUnique(dataForm))
                {
                    //It's unique! Let's upload it to the database and blobs
                    const filesToUpload = [];
                    filesToUpload.push(dataForm.modelPath[0])
                    filesToUpload.push(dataForm.photoPath[0]);

                    await uploadAssetToContainer(filesToUpload).then((value) => {
                        dataForm.modelPath = value.modelPath
                        dataForm.photoPath = value.photoPath
                    });
                    
                    try
                    {
                        await addDoorItemToDB(dataForm)
    
                        //Resets the entire form!
                        reset();
                        reset2();
                        reset3();
                        
                        //Reset the door collection
                        await getAllDoorStyles().then((value) => {
                                setDoorStyles(value)
                        });
                        
                        launchToast(`Successfully added a ${currentFormSelection.toLowerCase()} into the database!`, "success");
                    } 
                    catch(err) 
                    {
                        
                    }
                }

                else
                {
                     //Oops! It's not unique!
                    launchToast(`Failed adding a new ${currentFormSelection.toLowerCase()} into the Database. This is due that Door Style named "${dataForm.doorStyle}" already existed in database`, "error");
                }
            }
        }

        setProcess(false);
    }

    function NavigationBar()
    {
        return (
            <Flex bg='#323232' w='50%' borderWidth='1px' borderRadius='lg' alignContent={"center"} justifyContent={"center"} padding="2">
                <ButtonGroup gap='2'>
                    <Button 
                            bg={currentFormSelection == "CABINET" ? 'black' : 'white'} 
                            size='lg'
                            color={currentFormSelection == "CABINET" ? 'white' : '#323232'}
                            isDisabled={currentFormSelection == "CABINET" ? true: false}
                            onClick={() => {setForm("CABINET")}}
                        >

                        CABINET
                    </Button>
                    <Button 
                        bg={currentFormSelection == "DOOR" ? 'black' : 'white'} 
                        size='lg'
                        color={currentFormSelection == "DOOR" ? 'white' : '#323232'}
                        isDisabled={currentFormSelection == "DOOR" ? true: false}
                        onClick={() => {setForm("DOOR")}}
                    >
                        DOOR
                    </Button>
                </ButtonGroup>
            </Flex>
        )
    }


    if (currentFormSelection === "RETURN") 
    {
        return (
            <TLDExpressSelection currentState={false} currentFormState={false}/>
        )
    }

    else
    {
        return(
            <Container bgGradient='linear(#171717 0%, #323232 99%)' h='calc(100vh)' maxW='100vw' padding={0}>
                <Modal size='xl' isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} closeOnEsc={false}>
                <ModalOverlay />
                    <ModalContent maxW="56rem">
                        <ModalBody pb='2em' size="lg">

                            {currentFormSelection == "STYLE" && 
                                <Button bg='#323232' color='white' onClick={() => {
                                                  setForm("DOOR")
                                }} leftIcon={<ArrowLeftIcon/>}>
                                    RETURN
                                </Button>
                            }           
                            {currentFormSelection != "STYLE" && 
                            <   ModalCloseButton onClick={() => {
                                    onClose();
                                    setForm("RETURN")
                                }}/>
                            }   
                            <Center>
                                <Container  maxW='container.lg' marginTop={3}>
                                    <VStack align='center' spacing={1}>
                                        <Text fontWeight='normal' fontSize='2xl'>ADDING A {currentFormSelection} TO THE DATABASE</Text>
                                            {/* THIS IS WHERE WE PUT OUR NAVIGATION */}
                                            {currentFormSelection != "STYLE" && 
                                                <NavigationBar/>
                                            }   
                                            {currentFormSelection == "CABINET" && 
                                                <AddCabItemModal onSubmit={onSubmit} submitHandler={handleSubmit2} errorList={error2} objRegister={register2} doorStyleList={doorStyles} isLoading={process}/>
                                            }

                                            {currentFormSelection == "DOOR" && 
                                                <AddDoorItemModal onSubmit={onSubmit} submitHandler={handleSubmit} errorList={errors} objRegister={register} setFormHandler={setForm} isLoading={process}  listStyle={listStyle}/>
                                            }

                                            {currentFormSelection == "STYLE" && 
                                                <AddStyleItemModal onSubmit={onSubmit} submitHandler={handleSubmit3} errorList={error3} objRegister={register3} isLoading={process}/>
                                            }   
                                    </VStack>
                                </Container>
                            </Center>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Container>
        )
    }

}
