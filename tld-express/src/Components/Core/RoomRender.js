//Done Cleaning
import React, { Component, useState } from 'react';
import { OrbitControls, Plane, TransformControls } from '@react-three/drei'
import { useThree, useLoader } from "@react-three/fiber"
import Cabinet from "../Shared/Models/Cabinet";
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { Door, DoorComponent } from '../Features/DoorComponent';
import { RepeatWrapping } from 'three';

// The number we multiply to get height from meters to feet
export const CONVERSION = 3.28084
//Room render holds logic for three funciotnality 
export default class RoomRender extends Component {

     wallTexture = useLoader(TextureLoader, '/modelFiles/images/wall-texture.jpg');
     woodTexture = useLoader(TextureLoader, '/modelFiles/images/wood-texture.jpg');
     
     
    // TODO NOTE !!! Lines 6, 11, and 12 break NEARLY EVERY TEST. Make sure to only leave them in for demo reasons until mocking is complete.

    constructor(props) {
        super()
        this.state = {
            throwRay: this.throwRay,
            wallArrayList: React.createRef() //We create a react ref that holds the wall meshes that we can determine which walls that the raycaster has intersected with
        }
        this.wallRef = React.createRef();
        this.floorRef = React.createRef();
        this.state.wallArrayList.current = []; // intializes the wall array with nothing

    }



    //render walls and all items in the entity list
    render() {
        let wallList = this.props.wallList
    
         return (
            <>
                 
                 <mesh rotation={[-Math.PI / 2, 0, 0]} position={[wallList[0]?.wallLength/2, 0, wallList[1]?.wallLength/2]} userData={{randomStuff: 69}} onClick={() => { this.props.onClickHandler({})} } ref={this.floorRef} name="floor">
                    <planeBufferGeometry args={[300,300]} />
                    {/* <planeBufferGeometry args={[wallList[0]?.wallLength * 3.28084, wallList[1]?.wallLength * 3.28084]} /> */}
                    <meshBasicMaterial map={this.woodTexture}  />
                </mesh >
                {
                    this.props.wallList.map(wall => 
                        <mesh ref={(wall) => this.state.wallArrayList.current.push(wall)} userData={{wallNumber: wall.wallNumber}} name={"Wall" + wall.wallNumber} key={wall.wallNumber}  onClick={() => { this.props.onClickHandler({}) }} rotation-y={wall.wallRotation} 
                        position={[
                            wall.posX * CONVERSION + (wall.wallLength* CONVERSION/2.0 * (Math.sin(wall.wallRotation+(Math.PI/2.0)))),
                            wall.wallHeight* CONVERSION / 2.0, 
                            wall.posZ * CONVERSION + (wall.wallLength* CONVERSION/2.0 * (Math.cos(wall.wallRotation+(Math.PI/2.0)))),

                        ]}>
                            <planeBufferGeometry args={[wall.wallLength * CONVERSION, wall.wallHeight * CONVERSION]} />
                            <meshBasicMaterial map={this.wallTexture} />
                        </mesh>
                        )
                }
                { 
                    this.props.entityList.map(entity =>
                    {
                        return(<Cabinet
                            onClickHandler={this.props.onClickHandler}
                            key={Math.random() * 100 + 10}
                            cabData={entity}
                            room={this.props.room}
                        >
                         </Cabinet>
                            )
                    }
                    )
                }
            </>
        )
        
    }
}
