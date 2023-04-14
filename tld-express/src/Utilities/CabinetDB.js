import Neode from 'neode';
import CabinetModel from '../Models/CabinetModel';
import DoorModel from '../Models/DoorModel';
import RoomModel from '../Models/RoomModel'
import neo4j from 'neo4j-driver'
import Wall from '../Models/WallModel';
import StyleTemplate from '../Models/StyleTemplate'
import { cabinetBuilder } from '../Entities/Cabinet';
import CabinetTemplate from '../Models/CabinetTemplate'
import DoorTemplate from '../Models/DoorTemplate'

const Neo4jVars = [process.env.REACT_APP_BOLT_SERVERADDRESS, process.env.REACT_APP_NEO4J_USERNAME, process.env.REACT_APP_NEO4J_PASSWORD]


//This will create an instance of neode to interact with the database
//https://www.npmjs.com/package/neode
export function setupDB(){
    const instance = new Neode(...Neo4jVars);

    instance.model('Cabinet', CabinetModel);
    instance.model('CabinetTemplate', CabinetTemplate);
    instance.model('Cabinet:Test', CabinetModel);
    instance.model('Door', DoorModel);
    instance.model('DoorTemplate', DoorTemplate);
    instance.model('Door:Test', DoorModel);
    instance.model('Room', RoomModel);
    instance.model('Room:Test', RoomModel);
    instance.model('Test', DoorModel);
    instance.model('Wall', Wall)
    instance.model('StyleTemplate', StyleTemplate)

    return instance
}


const instance = setupDB()

/**
 * This function will query the database for all template cabinets and populate a list
 * with cabinet objects that will be used for the dragging and dropping of cabinets
 * @returns 
 */
export async function getAllCabinets() {
    let outputVal = await instance.all('CabinetTemplate')
    console.log(outputVal)
    
    let list = []
    for (let obj of outputVal)
    {       
        const cabDoorStyle = obj.get("contains_this_doorTemplate").endNode().get('doorStyle')
        let doorNode = await instance.first("DoorTemplate", {doorStyle: cabDoorStyle})

        let door = await doorNode.toJson()

        let cabJson = await obj.toJson()
        

        let cab = await cabinetBuilder(cabJson, door)
        
        list.push(cab)
    }
    return list;
}

/**
 * This method will use a props object to query the database for a Cabinet
 * @param {*} props 
 * @returns 
 */
export async function getCabinetByProps(props) {
    return await instance.first('Cabinet', props)
}

/**
 * This method will use a props object to delete a cabinet from the database
 * @param {*} props 
 * @returns 
 */
export async function removeCabinetByProps(props) {
    let targetCab = await getCabinetByProps(props)
    if (targetCab === false) {throw new Error("Cabinet could not be deleted, could not be found")}
    return await targetCab.delete();
}

/**
 * This method will use a cabinets "id" value to delete a cabinet from the database
 * @param {*} id 
 * @returns 
 */
export async function removeCabinetByID(id) {
    const targetCab = await instance.findById("Cabinet", id)
    if (targetCab === false) {throw new Error("Cabinet could not be deleted, could not be found")}
    else {
        const relationships = await targetCab.get('contains_this_door')
        let oldDoor = await relationships.endNode()
        await relationships.startNode().detachFrom(relationships.endNode())
        await oldDoor.delete()
    }
    return await targetCab.delete();
}

/**
 *  This method will add a cabinet to the Database creating all necessary relationships in the process
 * @param {cabinet to add} cabinet 
 */
export async function addCabinet(cabinet) {
    cabinet.distanceFromWall = Math.sqrt((cabinet.posx - cabinet.wall.posX)**2 + (cabinet.posz - cabinet.wall.posZ)**2)
    delete cabinet.contains_this_doorTemplate
   
    const dbCab = await instance.create('Cabinet', {
        ...cabinet
    })
    await _relateToRoom(cabinet, dbCab);
    return (dbCab);

}


/**
 *  This method will add or update a given cabinet in the Database
 * @param {cabinet to update} cabinet 
 */
export async function updateCabinet(cabinet) {

    delete cabinet.node
    delete cabinet._labels
    delete cabinet._id
    delete cabinet?.attributes?.door?._id
    

    let foundCab
    try {
        foundCab = await instance.findById('Cabinet', cabinet.id)
    } catch {}

    if ( foundCab ) {
        foundCab.update({ posx: cabinet.posx, posy: cabinet.posy, posz: cabinet.posz })
    } else {
        foundCab = await addCabinet(cabinet)
    }

    if(!cabinet['attributes'])
    {
        cabinet.attributes ={
            door:1
        }
    }

    const relationships = await foundCab.get('contains_this_door')

    //If relationship was found 
    if (relationships) {
        //detatch nodes
        let oldDoor = relationships.endNode()
        await relationships.startNode().detachFrom(relationships.endNode())
        await oldDoor.delete()
    }
    let doorNodeToRelateTo 
    try{
        doorNodeToRelateTo = await instance.create('Door', { ...cabinet.attributes.door })
    } catch (err){
        console.error(err)
        throw err
    }

    if (!doorNodeToRelateTo) {
        console.warn("-----------------Couldn't find the door-------------")
        return;
    }


    await foundCab.relateTo(doorNodeToRelateTo, "contains_this_door", { doorID: Number(cabinet['attributes']['door']['doorID'])})

    const outputCab = await instance.findById('Cabinet', foundCab.id())

    return outputCab;

}


async function _relateToRoom(cabinet, foundCab){
    let RoomNodeToRelateTo = await instance.first('Room', {roomID: Number(cabinet['roomID'])})
    if (!RoomNodeToRelateTo) {
        console.warn(`-----------------Couldn't find the Room #${cabinet['roomID']}-------------`)
        await instance.create('Room', {roomID: Number(cabinet['roomID'])})
        RoomNodeToRelateTo = await instance.first('Room', {roomID: Number(cabinet['roomID'])})
    }

    let wallToRelateTo = await instance.cypher(`Match (r:Room {roomID: ${cabinet.roomID}})-[]-(w:Wall {wallNumber: ${cabinet.wall.wallNumber}}) Return w`)

    if (!wallToRelateTo.records[0]) {
        console.warn(`-----------------Couldn't find the Wall #${cabinet['roomID']} -> ${cabinet.wall.wallNumber}-------------`)
        let allwalls = await instance.cypher(`Match (r:Room {roomID: ${cabinet.roomID}})-[]-(w:Wall ) Return w`)
        return;
    }
    wallToRelateTo = wallToRelateTo.records[0]._fields[0]
    wallToRelateTo = await instance.findById("Wall", wallToRelateTo.identity.low);

    if(foundCab.get("contains_cabinet"))
    {
        console.warn(`--------------CAB has room----------------`)
        return;
    }

    try {
        await foundCab.relateTo(wallToRelateTo, "contains_cabinet", {})
    } catch {
        console.warn("Database Loading error")
     }

}

/**
 * This method will return a json object of the doors in the Database used to populate
 * the attribute menu's list box with the available door styles 
 */
export async function getAllDoorStyles() {

    let doors = await instance.all('DoorTemplate')

    let json = JSON.parse(JSON.stringify(await doors.toJson()));
    
    return json
}

/**
 * This method will return a json object of the styles in the Database used to populate
 * the attribute menu's list box with the available styles 
 */
export async function getAllStyles() {

    let doors = await instance.all('StyleTemplate')

    let json = JSON.parse(JSON.stringify(await doors.toJson()));
    
    return json
}

/**
 * This method will use a props object to query the database for a Door
 * @param {*} props 
 * @returns 
 */
export async function getDoorByProps(props) {
    return await instance.first('Door', props)
}
/**
 * This method will attempt to grab a Door from the database using the doorID
 * it will add this as properties and call GetDoorByProps to query the database
 */
export async function getDoorbyID(doorid) {
    return await getDoorByProps({ doorID: doorid })

}

/**
 * This method will close the database connection
 * @returns 
 */
export async function closeDB(){
    return instance.close()
}

/**
 * This function helps us to create a new CabinetTemplate node in the database that can be used to create new cabies!
 * Takes in an object of cabTemplate and send it to the database it goes.
 */
export async function _addCabItemToDB(cabTemplate, instance)
{
    //This is where we put 0s
    cabTemplate.posx = 0;
    cabTemplate.posy = 0;
    cabTemplate.posz = 0;
    cabTemplate.rotx = 0;
    cabTemplate.roty = 0;
    cabTemplate.rotz= 0;

    let cabFromDB = await instance.first('CabinetTemplate', {cabIdentifier: cabTemplate.cabIdentifier})
    
    if (!cabFromDB) {
        const dbCab = await instance.create('CabinetTemplate', {
            ...cabTemplate
        })

        return (dbCab);
    } else {
        throw new Error("E201 - Given Cabinet Identifier Not Unique");
    }
}

export async function addCabItemToDB(cabTemplate)
{
    await _addCabItemToDB(cabTemplate, instance)
}



/**
 * This function helps us to create a new DoorTemplate node in the database that can be used to create new door templates!
 * @param {*} doorTemplate - object of information that the users and azure has provided and send it to the database it goes
 * @returns 
 */
export async function _addDoorItemToDB(doorTemplate, instance)
{
    let doorFromDB = await instance.first('DoorTemplate', {doorStyle: doorTemplate.doorStyle})

    if (!doorFromDB){
        const dbCab = await instance.create('DoorTemplate', {
            ...doorTemplate
        })
        return (dbCab);
    } else 
    {
        throw new Error("E202 - Given Door Style Not Unique");
    }
}

export async function addDoorItemToDB(doorTemplate)
{
    await _addDoorItemToDB(doorTemplate, instance)
}


/**
 * This function helps us to create a new StyleTemplate node in the database that can be used to create new style templates!
 * @param {*} styleTemplate - object of information that the users and azure has provided and send it to the database it goes
 * @returns 
 */
export async function _addStyleItemToDB(styleTemplate, instance)
{
    let styleFromDB = await instance.first('StyleTemplate', {databaseName: styleTemplate.databaseName})

    if (!styleFromDB){
        const dbCab = await instance.create('StyleTemplate', {
            ...styleTemplate
        })
        return (dbCab);
    } else {
        throw new Error("E203 - Given Style Not Unique");
    }
}
    
export async function addStyleItemToDB(styletemplate)
{
    await _addStyleItemToDB(styletemplate, instance)
}


export async function relateCabTemplateToDoorTemplate(cabTemplate, doorTemplate){

    let cabNode = await instance.first('CabinetTemplate', {cabIdentifier: cabTemplate.cabIdentifier})
    let doorNode = await instance.first('DoorTemplate', {doorStyle: doorTemplate.doorStyle})

    if (!cabNode || !doorNode) {
        if (!cabNode) {
            console.warn(`-----------------Couldn't find the Cabinet Template: ${cabTemplate.cabIdentifier}-------------`)
        }
        if (!doorNode) {
            console.warn(`-----------------Couldn't find the Door Template: ${doorTemplate.doorStyle}-------------`)
        }
        return;
    }
    
    await cabNode.relateTo(doorNode, "contains_this_doorTemplate")

    return;
}

/**
 * To ensure that our style template is unique, this function determine if there's any instance of it in the database. If there is, it spits out false.
 * If there isnt, it spits out true.
 * @param {} styleTemplate 
 * @returns 
 */
export async function determineStyleItemUnique(styleTemplate)
{
    let styleFromDB = await instance.first('StyleTemplate', {databaseName: styleTemplate.databaseName})
    if (!styleFromDB)
    {
        return true;
    }

    return false;
}

/**
 * To ensure that our door template is unique, this function determine if there's any instance of it in the database. If there is, it spits out false.
 * If there isnt, it spits out true.
 * @param {} styleTemplate 
 * @returns 
 */
export async function determineDoorItemUnique(doorTemplate)
{
    let doorFromDB = await instance.first('DoorTemplate', {doorStyle: doorTemplate.doorStyle})
    if (!doorFromDB)
    {
        return true;
    }

    return false;
}

/**
 * To ensure that our cabinet template is unique, this function determine if there's any instance of it in the database. If there is, it spits out false.
 * If there isnt, it spits out true.
 * @param {} styleTemplate 
 * @returns 
 */
export async function determineCabinetItemUnique(cabTemplate)
{
    let cabFromDB = await instance.first('CabinetTemplate', {cabIdentifier: cabTemplate.cabIdentifier})
    if (!cabFromDB)
    {
        return true;
    }

    return false;
}




