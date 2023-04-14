import { remove } from 'lodash';
import React, { Component, useState } from 'react';
import Door from '../../Entities/Door';
import { getAllDoorStyles, removeCabinetByProps, getCabinetByProps, removeCabinetByID, updateCabinet } from '../../Utilities/CabinetDB';
import { KeepCabinetInsideWall } from './CatalogItem';
import { Box, Button, ButtonGroup, Collapse, Divider, Fade, Flex, HStack, Icon, MenuDivider, ScaleFade, Select, Slide, Spacer, StackDivider, Text, VStack } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { ArrowForwardIcon, CheckIcon, ChevronDownIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons';

export default class AttributeMenu extends Component {
	constructor(props) {
		super(props)
		this.state = {
			doorOptionList: [],
			selectedDoorStyle: ""
		}


		// this is used to inject doorstyleonchange method for testing
		if (this.props?.doorStyleOnChange) {
			this.doorStyleOnChange = this.props?.doorStyleOnChange
		}


	}



	/**
	 * This method will fire upon clicking ona Cabinet. It will open
	 * the attribute menu that can be used to change attributes of 
	 * the selected cabinet or delete the selected cabinet from the room
	 */
	async componentDidMount() {
		this.setState({})
		const res = await getAllDoorStyles()
		res.forEach((entry) => {
			delete entry._id
			delete entry._labels

			this.state.doorOptionList.push({ ...entry })
		})

		this.setState({})

		if (this.props.room && this.props.room.state?.currentSelected?.attributes != null) {
			if (this.props.currentSelection?.attributes?.door.doorStyle != null) // .attributes.door.doorStyle ?
			{
				this.setState({ selectedDoorStyle: this.props.currentSelection.attributes.door.doorStyle })// .attributes.door.doorStyle ?
			}
		}
	}

	/**
	 * This method will fire when the doorStyle is changed, it will update the 
	 * object in the entity list and the cabinet in the database with the new doorStyle
	 * @param {
	 * } e 
	 */
	doorStyleOnChange = (e) => {
		const cabData = this.props.currentSelection;
		if (!cabData?.attributes) {
			cabData.attributes = {}
		}

		const doorData = this.state.doorOptionList.find(({ doorStyle }) => doorStyle == e.target.value)
		let newSelection = Object.assign(new Door(), doorData)
		cabData.attributes.door = newSelection
		this.props.room.setState({})

		this.setState({ selectedDoorStyle: e.target.vale })
	}

	/**
	 * This method is fired when the delete button in the attribute menu is pressed.
	 * It will remove the cabinet from the room while also deleting it from the room 
	 * stored in the database.
	 */
	async deleteHandler(cabData, entityList) {

		remove(entityList, (item) => item.id === cabData.id)
		await removeCabinetByID(cabData.id)
		this.props.room.setState({ currentSelected: null })
		if (this?.props?.room?.cameraControlRef?.current) {
			this.props.room.cameraControlRef.current.enabled = true
		}


		return entityList
	}

	/**
	 * @returns nothing
	 * @param {*} cabData 
	 * @param {*} entityList 
	 */
	async moveButtonHandler(cabData, room, cameraControlRef) {

		cameraControlRef.current.enabled = false
		cabData.isMovable = true;
		this.props.room.setState({ currentSelected: cabData })

	}


	/**
	 * @returns nothing
	 * @param {*} cabData 
	 * @param {*} entityList 
	 */
	async moveSubmitHandler(cabData, entityList, cameraControlRef) {


		let changedPos = cabData.cabRef.current.children[1].position
		cabData.posx = changedPos.x
		cabData.posz = changedPos.z
		KeepCabinetInsideWall(cabData)
		await updateCabinet(cabData);
		return this.moveResetHandler(cabData, entityList, cameraControlRef);
	}


	/**
	 * @returns nothing
	 * @param {*} cabData 
	 * @param {*} entityList 
	 */
	async moveResetHandler(cabData, entityList, cameraControlRef) {

		cameraControlRef.current.enabled = true
		cabData.isMovable = false;
		// this.setState({})
		this.props.room.setState({ currentSelected: cabData })
		return cabData

	}

	render() {

		const attributeMenuStyle = {
			// move catalog to the left as small floating window
			// may be worth it to eventually move into modules.css, more research needed
			backgroundColor: "#323232",
			width: "18%",
			height: "50%",
			position: "absolute",
			padding: "25px",
			//Center div
			left: '100%',
			top: '50%',
			transform: "translate(-100%,-50%)",
			overflowY: "scroll", borderRadius: "20px", boxShadow: "5px 5px 19px",
			// transition: "opacity 0.5s ease-in-out 0.1s",
		};
		let isOpen = true;
		return (
			<>
				<Fade in={true} >

					<Collapse in={this} animateOpacity>

						<VStack style={{
							position: "absolute",
							padding: "25px",
							//Center div
							left: '99.5%',
							top: '60%',
							width: "18%",
							height: "75%",
							transform: "translate(-100%,-50%)",
							transition: "opacity 0.5s ease-in-out 0.1s",
						}}>

							<img src='./attribute_section.png' style={{ width: "100%" }} alt='' />
							<Box
								data-testid="attribute-menu"
								className="AttributeMenu"
								style={{
									// move catalog to the left as small floating window
									// may be worth it to eventually move into modules.css, more research needed
									backgroundColor: "#323232",
									overflowY: "scroll", borderRadius: "20px", boxShadow: "5px 5px 19px",
								}}
								display="flex"
								alignItems="normal"
								justifyContent="space-between"
								padding="2rem"
								background="gray.100"
								borderRadius="lg"
								boxShadow="md"
							>

								<VStack w='100%'>


									<Text borderRadius="md" border="1px solid gray" p={1} sx={{ backgroundColor: "white" }} color='#1a202c' width="110%" fontSize={'lg'} fontWeight={'bold'} mb={2}

									>Cabinet Name: <Text sx={{ px: '1', py: '1', rounded: 'full', bg: '#1a202c', color: 'white' }} m={2} p={1} >{this.props.currentSelection.cabName}</Text></Text>

									{/*****************************Door Style Options*/}


									<Box border="1px solid gray" borderRadius="md" p={6} m={3} width="100%" sx={{ backgroundColor: "#1a202c" }}>
										<Text color='white' fontSize={'lg'} fontWeight={'bold'} mb={4}>Select a Door Style</Text>
										<Select
											className="DoorSelect"
											data-testid="door-select"
											fontWeight={'bold'}
											onChange={this.doorStyleOnChange}
											value={this.state.selectedDoorStyle}
											maxWidth="99%"
											icon={<Icon as={ChevronDownIcon} />}
											sx={{
												backgroundColor: '#ffffff',
												color: '#323232',
												padding: '0.5rem',
												borderRadius: '5px',
												border: '1px solid white',
												'&:focus': {
													outline: 'none',
													boxShadow: '0 0 0 3px rgba(66,153,225,0.5)',
													border: '1px solid #1DA1F2',
												},
											}}
										>
											{this.state.doorOptionList.map((door) => (
												<option style={{ backgroundColor: "#323232", color: "white" }} className={door.doorStyle} key={door.doorStyle} value={door.doorStyle}>
													{door.doorStyle}
												</option>
											))}
										</Select>
									</Box>

									{/* </Fade> */}

									{/**************************** Move Controls */}
									<Box
										border="1px solid gray" borderRadius="md" p={6} m={3} width="100%" sx={{ backgroundColor: "#1a202c" }}
									>

										<Text color='white' fontSize={'lg'} fontWeight={'bold'} mb={4}>
											Move Controls
										</Text>

										<ButtonGroup variant="solid" spacing={2} w="100%" justifyContent="center">
											{this.props.currentSelection.isMovable === false && (
												<Button
													data-testid="move-button"
													onClick={() => {
														this.moveButtonHandler(
															this.props.currentSelection,
															this.props.room,
															this.props.room.cameraControlRef
														);
													}}
													_hover={{ bg: "green.400" }}
												>
													<Icon as={ArrowForwardIcon} mr={2} />
													Move
												</Button>
											)}
											{this.props.currentSelection.isMovable === true && (
												<>
													<Button
														data-testid="reset-button"
														onClick={() => {
															this.moveResetHandler(
																this.props.currentSelection,
																this.props.room,
																this.props.room.cameraControlRef
															);
														}}
														_hover={{ bg: "orange.400" }}
													>
														<Icon as={RepeatIcon} mr={2} />
														Reset
													</Button>
													<Button
														data-testid="submit-button"
														onClick={() => {
															this.moveSubmitHandler(
																this.props.currentSelection,
																this.props.room,
																this.props.room.cameraControlRef
															);
														}}
														_hover={{ bg: "blue.400" }}
													>
														<Icon as={CheckIcon} mr={2} />
														Submit
													</Button>
												</>
											)}
										</ButtonGroup>

									</Box>



									{/* {CODY PUT STUFF HERE FOR YOUR SCALING OPTIONS FORM SOMETHING} */}

									{/* <Box
										border="1px solid gray" borderRadius="md" p={6} m={3} width="100%" sx={{ backgroundColor: "#1a202c" }}
									>

										<Text color='white' fontSize={'lg'} fontWeight={'bold'} mb={4}>
											Resize Controlls
											//////////////Hereeeee//////////////
										</Text>

									</Box> */}


									{/*****************Delete button */}
									{/* <StackDivider orientation='horizontal' /> */}
									{/* <MenuDivider /> */}

									<Spacer />
									<Divider />
									<Button
										padding="0.5rem"
										marginLeft="1rem"
										onClick={async () => {
											this.props.room.setState({
												entityList: await this.deleteHandler(this.props.currentSelection, this.props.room.state.entityList),
											});
										}}
										_hover={{ bg: "red.400" }}
									>
										<Icon as={DeleteIcon} mr={2} />
										Delete
									</Button>

								</VStack>

							</Box>
						</VStack>



						{/* </Slide> */}
						{/* </Fade> */}

					</Collapse>

					{/* </Slide> */}
				</Fade>
			</>
		)
	}

}
