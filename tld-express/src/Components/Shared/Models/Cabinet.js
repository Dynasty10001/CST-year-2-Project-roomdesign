import React, { Component, createRef, Suspense, useMemo, useRef } from 'react'
import GetMeshFromPath from './GetMeshFromPath'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Box3, Vector3, Color, Mesh, BoxHelper} from 'three';
import * as THREE from 'three'
import { Group } from 'three';
import { useLoader, meshBasicMaterial } from '@react-three/fiber';
import { DoorComponent } from '../../Features/DoorComponent';
import { TransformControls, useHelper } from '@react-three/drei';
import { position } from '@chakra-ui/styled-system';
import { CONVERSION } from '../../Core/RoomRender';
import { intersects } from 'semver';

class Cabinet extends Component {
    valid = false; // a boolean value that is used for confirming the information that is being sent in is of the correct types.
    material = new THREE.MeshStandardMaterial();

    constructor(props) {
        super(props);
        let cabData = props.cabData
        this.innerObjectRef = createRef();
        this.transformRef = createRef();
        this.geoRef = createRef();
        this.cabRef = createRef();
        this.meshRef = createRef();


        if (!cabData || !cabData.cabIdentifier) { 
            return
        }

        if(!cabData.modelPath){
            throw new Error('Model Path is not defined')
            return
        }

        this.valid = cabData.modelPath.substr(cabData.modelPath.length - 4, 4).toLowerCase() == ".obj"
        if (!this.valid)
        {
            throw new Error('Model Path is not an obj file')
        }
    
        let color = "DarkGoldenRod"
        if(cabData.isCollided)
        {
            color = "red"
        }

        this.state = {
            cabData: cabData,
            color: color
        }
        
    }

    componentDidUpdate() {
        let cabData = this.state.cabData
        if (cabData.isCollided) {
            console.warn(cabData.id);
        }
        this._adjustPosition()
        
    }

    // This is where the position of the cabinet has been
    // modified, based on the wall that it is currently related into.
    // It complements well with the CatalogItem attachToWall functionality as it grabs those position and wall information
    // with relatively ease without making this portion super complicated for us to fix it in the future stories ahead.
    _adjustPosition(){
        
        let measure = new Box3()
        measure.setFromObject(this.innerObjectRef.current)
        let height = measure.max.y - measure.min.y;
        let depth = measure.max.z - measure.min.z;
        let width = measure.max.x - measure.min.x;
        // if (true) { // For upper stuff for later. Ignore unless your name is Ethan
        //     this.innerObjectRef.current.position.y = this.state.cabData.posy + (height /2)
        // } else {
        //     this.innerObjectRef.current.position.y = this.state.cabData.posy - (height /2)
        // }
        adjustY(this.innerObjectRef, this.state.cabData, measure )
        
        this.innerObjectRef.current.position.z = ( (depth - 0.10) /2) // the small value change here is due to the OBJ files not being perfectly centered.
        if (!this.state.adjustedPosition)
        {
            this.setState({adjustedPosition: this.innerObjectRef.current.position})
        }
    }



    componentDidMount(){

        let measure = new Box3()
        let cabData = this.state.cabData
        try {

            this._adjustPosition()

            this.state.cabData.cabRef = this.cabRef
            this.state.cabData.cabRefRenderID = this.cabRef.current.id

            this.checkForCollision(cabData)
        } catch (err) {
            console.log(err);
            if (typeof err == TypeError) {

            }
        }
    }

    checkForCollision(cabData) { 
        const collidedList = this.isCollided(this.props.room.state.entityList)
        if (collidedList.length > 0) {
    
            cabData.isCollided = true
            this.setState({ cabData: cabData })
            collidedList.forEach(cab => {
                let target = cab.isCollided
                cab.isCollided = true
                this.setState({color:"red"})
            });

        } else {
            this.setState({color:"DarkGoldenRod"})
            cabData.isCollided = false
        }

    }

    /**
     * This internal isCollided method allows us to determine which cabinets that the current cabinet
     * has collided into and uses that information to change the color of the appropriate cabinet to red.
     * 
     * Basically, this function creates a boundbox for that current cabinet and other cabinets in the state
     * and compares whether or not they collided or not.
     * @param {} collidableObjects 
     * @returns 
     */
    isCollided(collidableObjects){
        let currentBoundBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        currentBoundBox.setFromObject(this.cabRef.current);
        let cabinetId = this.state.cabData.id 

        console.log(collidableObjects);
            for(let i = 0; i<collidableObjects.length;i++){

            let tempBoundBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            tempBoundBox.setFromObject(collidableObjects[i].cabRef.current);
            collidableObjects[i].tempBoundBox = tempBoundBox;
        }
        let result = this.objectCollided(currentBoundBox,  cabinetId, collidableObjects)
        
        return result
    }

    /**
     * This method allows the current cabinet to detect whether or not it has been collided to another cabinet.
     * PARAMS: List of collidable objects to check for collisions with this object as a comparison.
     * RETURN: BOOLEAN
     */
    objectCollided(currentBoundingBox, cabID, collidableObjects) {
        if(!collidableObjects) return false
        let collidedList = []

        for (const cab of collidableObjects){
            if (cab.id != cabID)
            {
                if (currentBoundingBox.intersectsBox(cab.tempBoundBox))
                {
                    collidedList.push(cab)

                }
            }
        }
        return collidedList
    }

    render() { // Method copied from React documentation, basic method for rendering an object. displays a red box.
        if (this.valid) {
            let rotation = [0, this.state.cabData.rotz, this.state.cabData.roty];
            let position = [this.state.cabData.posx, this.state.cabData.posy, this.state.cabData.posz];
            let modelPath = this.state.cabData.modelPath
            let doorOffset = [11.5 * 2, 0, 11.5 * 2];
            let doorpos = []
            let positionAdjuster = [0,0,0]

            if (this.state.adjustedPosition?.x || this.state.adjustedPosition?.z || this.state.adjustedPosition?.y) {
                doorpos = [this.state.adjustedPosition.x, this.state.adjustedPosition.y, this.state.adjustedPosition.z]
            }
            else {
                doorpos = position
            }
            //cab is in inches, this converts it into feet
            const scale = 1 / 12
            
            return (
                <group ref={this.cabRef} key={Math.random()}>

                    <ObjectMovable rotation={rotation} position={position} isMovable={this.state.cabData.isMovable}  >
                        <group castShadow ref={this.meshRef} receiveShadow dispose={null} scale={scale} datatestid="cabinetGroup">
                            <mesh
                                ref={this.innerObjectRef}
                                onClick={(e)=>{
                                    this.props.onClickHandler(this.state.cabData)
                                e.stopPropagation()}}
                                rotation={[Math.PI * 3/2,0,0]}
                                >
                                <GetMeshFromPath modelPath={modelPath}  attach="material" color={this.state.color} material={this.material}/>
                            </mesh>
                            
                            <DoorComponent

                                position={doorpos}
                                door={this.state.cabData.attributes.door}
                                material={this.material}
                                offset={doorOffset}
                                rotation={[Math.PI * 3 /2,0,0]}
                                color={this.state.color}
                            /> 
                            
                        </group>
                    </ObjectMovable>
                </group>
            )
        }
        else {

            return (null);
        }
    }
}

export function ObjectMovable(props)
{
    let children = props.children
    if (props.isMovable)
    {
        return (
            <>
                <TransformControls ref={props.transformRef} position={props.position} rotation={props.rotation} space={'local'} isGroup={true} showZ={false} showY={false} >
                    {children}
                </TransformControls>
            </>
        );  
    }
    else{
        return (
            <group position={props.position} rotation={props.rotation}> 
                {children }
            </group>
        );
    }
}

export default Cabinet


/***
 * Method works for now, but due to some constant value will need to be tested with different
 * cabinets with different heights
 */
/**
 * Method will adjust the y position to be fairly flush with the top of the wall
 * @param {React.RefObject} cabRef 
 * @param {Object} cabData 
 * @param {Object} box 
 */
export async function adjustY(cabRef, cabData, box){


    let offset = 0;

    if (cabData.isUpper){

        offset = -cabData.posy
    }
    else{

        offset = (box.max.y - box.min.y)
        console.log(offset)
    }

    let difference =  box.max.y - cabData.posy

    cabRef.current.position.y = offset - difference
    
    // box.setFromObject(this.groupCab.current)
}
