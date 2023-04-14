import React, { Component } from 'react';
import { GenerateORD } from '../Features/ORDMaker';
import CatalogUI from './CatalogUI';
import AttributeMenu from './AttributeMenu';
import { removeCabinetByID, removeCabinetByProps } from '../../Utilities/CabinetDB';
import {QueryRoomFromDB} from '../../Utilities/RoomDB'
import deleteHandler from '../Core/AttributeMenu';
import FileSaver from 'file-saver';
import { Button, ButtonGroup, Box, HStack, Text } from '@chakra-ui/react'
import { initial } from 'lodash';


const UIStyle = {

    width: "10%",
    position:"absolute",

    //Center div
    left: "46%",
    bottom:'2%',
    transformX: "20%"
};

const UIStyle2 = {

    width: "8.5%",
    position:"absolute",

    //Center div
    left: "90%",
    top:'2%',
    transformX: "10%"
};

const UIStyle3 =
{
        position: "absolute",
        top: "4%",
        left: "43%",
        height: "auto",
        overflowY: "scroll",
        backgroundColor: "#323232",
        padding: "12px",
        borderRadius: "50px",
        width: "auto",
        color: "white",
        boxShadow: "2px 2px 10px black" 
}


//Basic UI components will hold multiple portions of the UI
export default class UI extends Component {

    constructor(props){
		super(props)
		this.state = {
			onMouseHoverOne: false,
            onMouseHoverTwo: false,
            initialRoomCabCount: this.props.Room.state.entityList.length,
            emptyCab: this.props.Room.state.entityList <= 0
		}
	}

    shouldBlockNavigation = false;
    // If there is a cabinet currently selected, the attribute menu will be rendered,
    // If there is none, it will not be rendered. The attribute menu alkso holds references
    // to the currently selected cabinet and the room, used for changing arttribute relationships
    // in the database

    componentDidUpdate(prevProps)
    {
        if (this.props.Room.state.entityList.length !==  this.state.initialRoomCabCount)
        {
            this.setState({initialRoomCabCount: this.props.Room.state.entityList.length});
            this.setState({emptyCab:  this.props.Room.state.entityList.length <= 0})

        }
    }


    attributeMenu = (curSelection, room) => {
        if (curSelection?.id) {
            return (<AttributeMenu
                currentSelection={curSelection}
                room={room}
            />);
        }
        else {
            return (<div></div>)
        }

        
    }

    // Handler method for the submit button. When the button is clicked, a .ord file
    // is built and pushed to the browser window. The file is saved using the file-saver npm module
    // https://www.npmjs.com/package/file-saver
    async ClickedSubmit() {
        try {

            let roomJSON = await QueryRoomFromDB(this.props.Room.props.roomID);

            let string = await GenerateORD(roomJSON)
            let blob = new Blob([string], { type: "text/plain;charset=utf-8" });

            // Download the File to the client user's Downloads Folder
            FileSaver.saveAs(blob, "ORDExport.ord");
        } catch (err) {
            window.alert(err.message);
            console.error(err)
        }
        
    }

    //Renderer decides what gets returned 
    // the submit button will create a .ord file
    //The delete all button will remove everything from the current room
    render() {
        return (
            <>
                {this.attributeMenu(this.props.Room.state.currentSelected, this.props.Room)}

                { !(this.state.emptyCab) &&
                    <Box as='button' w={'25%'} mt={5} onMouseOver={() => this.setState({onMouseHoverOne: true})} onMouseOut={() => this.setState({onMouseHoverOne: false})} onClick={async () => await this.deleteAllPrompt()} data-testid='deleteAll-button' id='delete-button' style={UIStyle}>
                        <img src={this.state.onMouseHoverOne ? "./deleteall_onhover.png" : "./deleteall_offhover.png"} alt="" />
                    </Box>
                }

                    <Box as='button' w={'25%'} mt={5} onMouseOver={() => this.setState({onMouseHoverTwo: true})} onMouseOut={() => this.setState({onMouseHoverTwo: false})} onClick={async () => await this.ClickedSubmit()} data-testid='export-button' id='export-button' style={UIStyle2}>
                        <img src={this.state.onMouseHoverTwo ? "./export_onhover.png" : "./export_offhover.png"} alt="" />
                    </Box>

                    <Box  w={'25%'} style={UIStyle3} id='room-identification'>
                        <HStack>
                            <img src='./room_icon.png' alt='' w={'3%'}/>
                            <Text fontSize='xl' as='b' >
                                CURRENT ROOM ID: {this.props.Room.roomID}
                            </Text>
                        </HStack>
                    </Box>

                <CatalogUI Room={this.props.Room} />
            </>
        )//the Catalog object held at the side of the string.

    }

    //This handler will fire when the user confirms deletion
    //it will delete all items in the current room, removing
    //them from the saved room in the database
    async deleteAllHandler(entityList) {

        for (let i = 0; i < entityList.length; i++)
		{
            await removeCabinetByID(entityList[i].id)
		}
        // todo Should this remove the items from the list
        entityList.length = 0
        entityList = []
        //I added this - No you didn't, it was me
        this.props.Room.setState({entityList: []})
        return entityList

    }

    //This handler will prompt the user for confirmation when theuser clicks the delete all button
    //If the user clicks "ok" it will cal the functuiion to empty the items in the room,
    //Otherwise it will do nothing if "cancel" is clicked
    async deleteAllPrompt() {
        if (window.confirm("Do you want to delete all cabinets?"))
        {
            this.deleteAllHandler(this.props.Room.state.entityList)
        }
    }

}
