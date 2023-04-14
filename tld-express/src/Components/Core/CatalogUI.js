import React, { Component, useState } from 'react';
import CatalogItem from './CatalogItem';
import { getAllCabinets } from '../../Utilities/CabinetDB';
import { cloneDeep } from 'lodash';
import { Box, VStack } from '@chakra-ui/react';

//Side catalog holding the cabinets in the catalog
export default class CatalogUI extends Component {
    currentSelection; // This holds the current selection

    /**
     * This will query the database pulling out all of the cabinets and it will create a list containing
     * all of the data for the cabinets so that the user can place cabinets in the room
     */
    constructor() {
        super();
        this.state = {
            currentSelection: null,
            catalogList: [],
            loaded: false
        }
    }

    /**
     * This method will add a cabinet to the entityList of the supplied room
     * @param {*} Cabinet 
     * @param {*} Room 
     */
    addCabinetToRoom(Cabinet, Room) {
        Room.state.entityList.push(Cabinet);
        Room.setState({})
    }

    /**
     * This method will fire when the component/ ui is initialized
     * It will grab all the cabinets from the database and load them into
     * a list so they can be added to the room
     */
    async componentDidMount() {
        if (!this.state.loaded) {
            this.setState({ loaded: true })

            const res = await getAllCabinets()
            this.setState({ catalogList: [...this.state.catalogList, ...res] })//Probably bad its going to rerender for each addition
        }
    }


    /**
     * This will loop through the catalog list and map it to a CatalogItem supplying the data through props
     */
    render() {

        console.log(this.state.catalogList);

        const CatalogUIStyle = {
            position: "absolute",
            top: "50%",
            left: "2%",
            height: "25%",
            overflowY: "scroll",
            backgroundColor: "#323232",
            padding: "25px",
            borderRadius: "50px"
        };


        return (
            <VStack style={{ position: 'absolute', top: "25%", left: "-10%" }} width={'auto'} height={"50%"} padding={0} id={'CatalogContainer'}>
                <img src='./catalog_section.png' alt='catalog section'  width={'34%'} />

                <Box style={{ overflowY: "scroll", borderRadius: "20px", boxShadow: "5px 5px 19px" }} width={'auto'} height={"90%"} backgroundColor='#323232' padding={"25px"}>
                    <div className='CatalogUI'>
                        {
                            this.state.catalogList.map((entry) => (
                                <CatalogItem
                                    catalogUI={this}
                                    Room={this.props.Room}
                                    key={Math.random()}
                                    cabinet={cloneDeep(entry)}
                                >
                                </CatalogItem>
                            ))}
                    </div>
                </Box>
            </VStack>
        )
    }
}
