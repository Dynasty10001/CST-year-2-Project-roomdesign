import Neode from 'neode';
import Validator from 'neode/build/Services/Validator';
import Room from '../Models/RoomModel';
import neo4j from 'neo4j-driver'
import Wall from '../Models/WallModel';


const Neo4jVars = [process.env.REACT_APP_BOLT_SERVERADDRESS, process.env.REACT_APP_NEO4J_USERNAME, process.env.REACT_APP_NEO4J_PASSWORD]
// const Neo4jVars = ["bolt://192.168.111.128:7687", "neo4j", "NWN7DoJDXDcJ"]
const instance = new Neode(...Neo4jVars);

//This will create an instance of neode to interact with the database
//https://www.npmjs.com/package/neode


/**
 * This method will be used to create the Room in the Database, create each of its walls, and place those walls in the database as well.
 * @param {*} room 
 * @param {[]} wallArray 
 */
// GABE: THE ROOM OBJECT WILL BE REMOVED AS THE PARAMETER.
export async function _addRoomAndWallsToDB(wallArray, instance, addWallToDB)
{
    // THIS !ROOM would be removed
    let currentRoomID = 0;

    if (wallArray.length == 0) 
    {
        throw new Error("The room requires at least one wall")
    } 
    
    else 
    
    {

        // This is where we create a room object and call our cypher statement that determines the
        // max Room id in all of the rooms in the database determine the room number from there.
        // int roomID = MATCH SOMETHING SOMETHING COUNT THIS SOMETHING
        // roomID <= 0 ? 1 : roomID++;

        let maxRoomID = await instance.cypher('MATCH (r:Room) RETURN r ORDER BY r.roomID DESC LIMIT 1');
        currentRoomID = maxRoomID.records.length <= 0 ? 1 : maxRoomID.records[0]['_fields'][0].properties.roomID + 1
        let newRoom = {roomID: currentRoomID};
        
        instance.model("Room", Room);
        newRoom.node = await instance.create("Room", {...newRoom}) // Create the room in the DB, and save the returned Node to a new property

        for(let wall of wallArray) // get each Wall in the array
        {
            await addWallToDB(wall, newRoom); // Add each wall into the database, attached to its parent room. 
            // Wait for this to complete before trying to start the next wall, for relationship purposes
        }
    }

    // Instead of returning 0, it returns the roomID. This can be useful for tests.
    return currentRoomID;        
}

/**
 * Wrapper function for addRoomAndWallsToDB function. This is used to allow us to properly test the addRoomAndWallsToDB
 * by passing it the mock instance of it properly!
 */
export async function addRoomAndWallsToDB(wallArray)
{
    return _addRoomAndWallsToDB(wallArray, instance, addWallToDB);
}

/**
 * This method will add a specific wall into the Database, connected to its parent Room
 * @param {Object} wall the newly created wall to be added to the database.
 * @param {Object} room the node of the Room that the new wall is in
 */
export async function addWallToDB(wall,room)
{
    if (!wall) {
        throw new Error("The Wall cannot be Null")
    } else if (!room) {
        throw new Error("The Room cannot be null")
    } else if (!room.node) {
        throw new Error("The Room does not have a reference to a Node in the Database")
    } else {
        try {
            try {      
                let wallrules = instance.model("Wall", Wall);
                await Validator(instance, wallrules, wall) // Create the Wall neode model, and then validate the current wall against that. Throw an error if there is a validation issue
                instance.model("Room", Room);
                instance.model('Wall').relationship('wallOfRoom', 'relationship', 'WallOfThisRoom', 'out', 'Room')
            }
            catch (err) {
                let messages = err.details?.map((e) => {return e.message}).toString() // Get the array, get the messages in that array, make the messages into a string.
                throw new Error("Validation problem! : " + err.message + " : " + messages )
            }

            wall.node = await instance.create('Wall', wall) // This will save the returned Neode Node object into the JSON object as a property called Node.
                                                            // Doing this allows the Node object to be refered to by anything that has a reference to the original Wall.
                            
            let rel = await wall.node.relateTo(room.node, "wallOfRoom") // Attach the newly created wall to its parent room

            let leftWall = wall.leftWall?.node // If the current wall has a Left Wall, set this variable to the Node property of that Left Wall.

            if(leftWall)
            {
                await wallLeftRelationship(wall.node,leftWall) // Create the left Wall relationship
            }

        } catch(e) {

        }
    }
    return wall.node._identity
}


/**
 * This method will create a LeftWall relationship between a wall and the wall it is attached to.
 * @param {Node} wall // The newly created wall's node
 * @param {Node} leftWall // the node of the old wall that the new wall is attached to.
 */
export async function wallLeftRelationship(wall,leftWall)
{
    try{
    wall.relateTo(leftWall,"left_wall_is")
    }
    catch(e)
    {

    }

}

export async function getAllWalls(roomID)
{
    let curID = parseInt(roomID)
    let cypherScript='match (r:Room where r.roomID='+curID+')-[n]-(w:Wall) return w order by w.wallNumber'
    const  promise = new Promise(resolve =>{
        resolve( instance.cypher(cypherScript))
    })
    return await promise
}

async function CheckDBForRoom(roomID) { 
    // query for room
    let DBRoom;
    const instance = new Neode(...Neo4jVars);
     
    await instance.cypher('MATCH (rm:Room {roomID:$ID}) RETURN rm', {ID: neo4j.int(roomID)}).then(res => {DBRoom = res.records[0]?.get("rm")})


    if (DBRoom) {
        return DBRoom;
        //check database for room
    } else {

        throw new Error("Room does not exist in DB"); 
    }


}

/**
 * This method will query the database for the room, if the Room exists in the database,
 * this method will return a JSON organised version of the room.
 * @param {*} room 
 * @returns 
 */
export async function QueryRoomFromDB(roomID) { 

    let Room
    try {
        Room = await CheckDBForRoom(roomID);
    }
    catch (err) {
        throw new Error("Room does not exist in DB\n" + err);
    }

    let JSON = await GetRoomJSON(Room);


    return JSON;
}

/**
 * This method will create a JSON object that is used to Create the ord file
 * it will call the other Get***JSON methods to populate a JSON object with 
 * all the Data for a .ord file
 * @param {*} Room 
 * @returns 
 */
export async function GetRoomJSON(Room) {

    let AllCabs = [];
    let AllWalls = [];
    let RoomJSON = {};
    let CatalogArray = [];
    
    const instance = new Neode(...Neo4jVars);
    let res = await instance.cypher("MATCH (rm:Room {roomID:$ID})<-[:WallOfThisRoom]-(Wall:Wall) RETURN Wall",{ID: Room.properties.roomID})
    for(let Record of res.records)
    {
        AllWalls.push(Record?.get("Wall"));
    }
    for(let wall of AllWalls)
    {
        wall.properties.wallID = `${Room.properties.roomID}` + `${100 + wall.properties.wallNumber}`.substr(-2)
        let cabs = await instance.cypher(`Match (rm:Room {roomID: ${Room.properties.roomID}})<-[:WallOfThisRoom]-`+
        `( W:Wall {wallNumber:${wall.properties.wallNumber}})-[:CONTAINS_CABINET]->(C:Cabinet) return C`)

        for (let cabrec of cabs.records)
        {
            let cab = cabrec.get('C')
            cab.properties.wallNumber = wall.properties.wallID + "-F"
            AllCabs.push(cab)
        }
        
    }
    for (let Cabinet of AllCabs) {

        let catalogJSON = await GetCatalogJSON(Cabinet);

        let Same = false; // Default Value, assume there is same Catalog currently in the array.
        for (let ArrayJSON of CatalogArray) {

            Same = true; // When checking the new Catalog against the current Catalog in the array, start by setting it to true, and then switch back to false if any differences are found
            for (let param in ArrayJSON) {
                if ((typeof ArrayJSON[param] != 'object') && ArrayJSON[param] != catalogJSON[param]) {

                    Same = false;

                    break;
                }
            }
            if (Same) // If the current Catalog is the same as the New Catalog, we have found a match. Perform work with Cabinet, and stop searching.
            {
                let cabTemplate = await instance.cypher("MATCH (c:CabinetTemplate {cabIdentifier: $cabID}) return c", {cabID: Cabinet.properties.cabIdentifier})
                ArrayJSON.Cabinet.push(await getCabinetJSON(Cabinet, cabTemplate))
                break;
            }
        }
        if (!Same) // If no match was found in the loop, perform Cabinet work, and then append the NewCatalog to the Catalog Array.
        {
            let cabArray = []
            cabArray.push(await getCabinetJSON(Cabinet))
            catalogJSON.Cabinet = cabArray;
            CatalogArray.push(catalogJSON);

        }

    }

    RoomJSON.Walls = getWallJSON(AllWalls);
    RoomJSON.Catalog = CatalogArray;
    return RoomJSON;
}

function getWallJSON(AllWalls) {
    let WallArray = []
    for (let wall of AllWalls)
    {
        let WallJSON = {
            "WallX" : wall.properties.posX * 39.3701,
            "WallZ" : wall.properties.posZ * 39.3701,
            "WallDirection" : wall.properties.wallRotation,
            "WallLength" : wall.properties.wallLength * 39.3701,
            "WallHeight" : wall.properties.wallHeight * 39.3701,
            "WallThickness" : 4.5,
            "WallNumber" : wall.properties.wallNumber,
            "WallType" : 2,
            "LeftWall" : "",
            "Wall Radius" : null,
            "WallAngleRotation" : null,
            "WallAngleArc" : null,
            "Wall ID" : wall.properties.wallID,
            "ModifyCode" : "S"
        }
        WallArray.push(WallJSON)
    }
    return WallArray
}

/**
 * This method will populate a JSON object with all the data needed for
 * generation of a .ord file for the Style of a Catalog, it will then return the JSON object
 * @param {*} stylename 
 * @returns 
 */
async function GetCatalogJSON(Cabinet) {
    let door;
    const instance = new Neode(...Neo4jVars)
    await instance.cypher("MATCH (cab:Cabinet {cabIdentifier:$ID})-[:CONTAINS_THIS_DOOR]->(Door) RETURN Door", { ID: Cabinet.properties.cabIdentifier }).then(res => {
        let Record = res.records[0];
        door = Record?.get("Door");
    })
    
    let styleJSON = await GetStyleJSON(door.properties.doorStyle);

    let catalogJSON = {
        "BaseDoorStyle": door.properties.doorStyle,
        "BaseDoors": styleJSON,
        "WallDoorStyle": door.properties.doorStyle,
        "WallDoors": styleJSON,
        "DrawerFront": styleJSON,
        "BaseEndPanels": styleJSON,
        "WallEndPanels": styleJSON,
        "TallEndPanels": styleJSON,
        "CabinetConstruction": "Kitchen by true",
        "DrawerBoxConstruction": "Vionaro System Drawer",
        "RollOutConstruction": "N/A",
        "BaseCabinetMaterials": "EXTERIOR-Mdf / INTERIOR-True white mel",
        "WallCabinetMaterials": "EXTERIOR-Mdf / INTERIOR-True white mel",
        "BaseExposedCabinetMaterials": "MDF",
        "WallExposedCabinetMaterials": "MDF",
        "DrawerBoxMaterials": "5/8 White Mel",
        "RollOutMaterials": "N/A",
        "PullMaterials": "Designer pull",
        "HingeMaterials": "Grass soft close full over overlay",
        "GuideMaterials": "Grass Vionaro Box",
    }

    return catalogJSON;
}

/**
 * This method will populate a JSON object with all the data needed for
 * generation of a .ord file for the Style of a Catalog, it will then return the JSON object
 * @param {*} stylename 
 * @returns 
 */
async function GetStyleJSON(stylename) {

    let style;
    const instance = new Neode(...Neo4jVars)
    await instance.cypher("Match (style:StyleTemplate {styleName:$stylename}) Return style", { stylename: stylename }).then(res => {
        let Record = res.records[0];
        style = Record?.get("style");
    });

    let styleJSON = {
        "Stylename": style.properties.styleName,
        "Material": style.properties.material,
        "OutsideEdge": style.properties.outsideEdge,
        "InsideEdge": style.properties.insideEdge,
        "RaisedPanel": style.properties.raisedPanel,
        "RoutePattern": style.properties.routePattern,
        "DatabaseName": style.properties.databaseName,
        "THEOTHEREMPTYSTRING": style.properties.THEOTHEREMPTYSTRING
    }

    return styleJSON
}

/**
 * This method will populate a JSON object with all the data needed for
 * generation of a .ord file for a Cabinet, it will then return the JSON object
 * 
 * // We need to fix this later on!
 * 
 */

export async function _getCabinetJSON(Cabinet, instance) {
    
    console.log(Cabinet);
    let cabTemplate = await instance.cypher('MATCH (c:CabinetTemplate {cabIdentifier: $cabID}) return c', {cabID: Cabinet.properties.cabIdentifier}) 
    console.log(cabTemplate);
    cabTemplate = cabTemplate.records[0]._fields[0].properties;
    let cabinetJSON = {}
    cabinetJSON =
    {
        "EntryNumber": Cabinet.properties.cabIdentifier,
        "CabNomenclature": cabTemplate.cabNomenclature, // SimpleBase? 1 door, 1 drawer, 1 shelves
        "Width": cabTemplate.cabWidth,
        "Height": cabTemplate.cabHeight,
        "Depth": cabTemplate.cabDepth,
        "HingeDirection": "L",
        "EndType": "B",
        "Quantity": 1,
        "Comment": "",
        "WallNumber": Cabinet.properties.wallNumber,
        "WallStartDistance": Cabinet.properties.distanceFromWall,
        "DistanceFromFloor": Cabinet.properties.posy,
        "DistanceFromWall": 0,
        "CabType": 2,
        "CabFill": 0,
        "SectionCode": cabTemplate.sectionCode,
        "CabinetID": cabTemplate.cabIdentifier,
        "ModifyCode": "S"
    }

    return cabinetJSON;
}

export async function getCabinetJSON(Cabinet)
{
    return await _getCabinetJSON(Cabinet, instance);
}