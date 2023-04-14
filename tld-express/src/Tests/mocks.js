import { Box3 } from "three"
import { Door } from "../Entities/Door"

export const sourceDoor = {//I changed this to doorstyle to match it in the tests
    doorID: 1,
    doorStyle: "Door1",
    modelPath: "Path",
    photoPath: "photo.png",
    }

export const testCabUpper = {
    posx: 1,
    posy: 3,
    posz: 1,
    rotx: 1,
    roty: 1,
    rotz: 1,
    roomID: 0,
    cabinetID: 1,
    isUpper: true,
    id: 10,
    doorOffset: [1,10,20], // x offset, y offset, z offset
    attributes:{
        door: Object.assign(new Door(), sourceDoor) 
   },
   wall: {
    wallNumber: 1,
    posX: 10,
    posZ: 5,
    wallLength: 10,
    wallHeight: 5,
    wallRotation: Math.PI/2,
    leftWall: null,
    node: {}
},
    tempBoundBox: Object.assign(new Box3(), {
    "isBox3": true,
    "min": {
        "x": -4.301490797681978,
        "y": 10.050000000000000044,
        "z": 0.057874011993408025
    },
    "max": {
        "x": -2.6514907976819777,
        "y": 11.5375000000000005,
        "z": 2.673622035980225
    }
}),
    cabName: "TLD Cabinet",
    sectionCode: "TLD|23|BASE",
    cabNomenclature: "Stuff",
    cabDepth: 2,
    cabHeight: 5,
    cabWidth: 3,
    modelPath: "cab.obj",
    photoPath: "photo.png",
    isUpper: true,
    cabIdentifier: 42359,
}



const sourceWall = {
        wallNumber: 0,
        posX: 10,
        posZ: 20,
        wallLength: 10,
        wallHeight: 10,
        wallRotation: 0,
        leftWall: null
    }

const testCabCollided1 = {
    posx: 1,
    posy: 1,
    posz: 1,
    rotx: 1,
    roty: 1,
    rotz: 1,
    roomID: 0,
    cabinetID: 1,
    id: 1,
    cabRefRenderID: 1,
    doorOffset: [1,10,20], // x offset, y offset, z offset
    attributes:{
        door: Object.assign(new Door(), sourceDoor) 
   },
   wall: {
    wallNumber: 1,
    posX: 10,
    posZ: 5,
    wallLength: 10,
    wallHeight: 5,
    wallRotation: Math.PI/2,
    leftWall: null,
    node: {}
},
    tempBoundBox: Object.assign(new Box3(), {
    "isBox3": true,
    "min": {
        "x": -4.301490797681978,
        "y": -0.050000000000000044,
        "z": 0.057874011993408025
    },
    "max": {
        "x": -2.6514907976819777,
        "y": 3.5375000000000005,
        "z": 2.673622035980225
    }
}),
    cabName: "TLD Cabinet",
    sectionCode: "TLD|23|BASE",
    cabNomenclature: "Stuff",
    cabDepth: 2,
    cabHeight: 5,
    cabWidth: 3,
    modelPath: "cab.obj",
    photoPath: "photo.png",
    isUpper: true,
    cabIdentifier: 42359,
}



const testCabCollided2 = {
    posx: 1.2,
    posy: 1.2,
    posz: 1.2,
    rotx: 1,
    roty: 1,
    rotz: 1,
    roomID: 0,
    cabinetID: 2,
    id: 2,
    cabRefRenderID: 2,
    doorOffset: [1,10,20],
    attributes:{
        door: Object.assign(new Door(), sourceDoor) 
   },
   wall: {
    wallNumber: 1,
    posX: 10,
    posZ: 5,
    wallLength: 10,
    wallHeight: 5,
    wallRotation: Math.PI/2,
    leftWall: null,
    node: {},
},
    tempBoundBox: Object.assign(new Box3(), {
        "isBox3": true,
        "min": {
            "x": -4.4,
            "y": -10.0,
            "z": -10.0
        },
        "max": {
            "x": 20.0,
            "y": 20.0,
            "z": 20.0
        }
    }),
    cabName: "TLD Cabinet",
    sectionCode: "TLD|23|BASE",
    cabNomenclature: "Stuff",
    cabDepth: 2,
    cabHeight: 5,
    cabWidth: 3,
    modelPath: "cab.obj",
    photoPath: "photo.png",
    isUpper: true,
    cabIdentifier: 42359,
}

export const testCabNotCollided = {
    cabName: "TLD Cabinet",
    sectionCode: "TLD|23|BASE",
    cabNomenclature: "Stuff",
    cabDepth: 2,
    cabHeight: 5,
    cabWidth: 3,
    modelPath: "cab.obj",
    photoPath: "photo.png",
    isUpper: true,
    cabIdentifier: 42359,
    posx: 100,
    posy: 100,
    posz: 100,
    rotx: 0,
    roty: 0,
    rotz: 0,
    roomID: 0,
    cabinetID: 3,
    id: 3,
    cabRefRenderID: 3,
    doorOffset: [1,10,20],
    attributes:{
        door: Object.assign(new Door(), sourceDoor) 
   },
   wall: {
    wallNumber: 1,
    posX: 10,
    posZ: 5,
    wallLength: 10,
    wallHeight: 5,
    wallRotation: Math.PI/2,
    leftWall: null,
    node: {},
},
    tempBoundBox: Object.assign(new Box3(), {
        "isBox3": true,
        "min": {
            "x": 400,
            "y": 400,
            "z": 400
        },
        "max": {
            "x": 401,
            "y": 401,
            "z": 401
        },
    }),               
}


export const mockedCabinetList = [testCabCollided1 ,testCabCollided2, testCabNotCollided, testCabUpper]





///////////////////////////////////////////////////////////////////////////////////////



    const badSourceCab = {}
    const badSourceDoor = {
        //I changed this to doorstyle to match it in the tests
        doorID: null,
        doorStyle: null,
      }
    const expectedResult = {
        posx: 1,
        posy: 1,
        posz: 1,
        rotx: 1,
        roty: 1,
        rotz: 1,
        roomID: 0,
        cabinetID: 1,
        cabRefRenderID: 1,
        attributes:{
             door: Object.assign(new Door(), sourceDoor) 
        },
        wall: {
            wallNumber: 1,
            posX: 10,
            posZ: 5,
            wallLength: 10,
            wallHeight: 5,
            wallRotation: Math.PI/2,
            leftWall: null,
            node: {}
        },
        tempBoundBox: Object.assign(new Box3(), {
        "isBox3": true,
        "min": {
            "x": -4.301490797681978,
            "y": -0.050000000000000044,
            "z": 0.057874011993408025
        },
        "max": {
            "x": -2.6514907976819777,
            "y": 3.5375000000000005,
            "z": 2.673622035980225
        }
    }),
        modelPath: "yes.obj"
    }

export let validCabTempOne = 
{
    cabName: "Wood Cabinet",
    cabIdentifier: 42359,
    cabDepth: 24,
    cabHeight: 34.875,
    cabWidth: 25,
    isUpper: false,
    cabNomenclature: "SB-1D-2S",
    sectionCode: "1V-D=L|T",

    //We don't include the modelPath and photoPath as it would be added later on
    posx: 0,
    posy: 0,
    posz: 0,
    rotx: 0,
    roty: 0,
    rotz: 0,
}

export let validCabTempTwo = 
{
    cabName: "Non-corroding highly conductive very epic cabinet ",
    cabIdentifier: 42360,
    cabDepth: 25,
    cabHeight: 35.875,
    cabWidth: 25,
    isUpper: false,
    cabNomenclature: "SB-1D-2S",
    sectionCode: "1V-D=L|T",

    //We don't include the modelPath and photoPath as it would be added later on
    posx: 0,
    posy: 0,
    posz: 0,
    rotx: 0,
    roty: 0,
    rotz: 0,
}

export let validCabTempThree = 
{
    cabName: "Epic Cabinet",
    cabIdentifier: 42359,
    cabDepth: 24,
    cabHeight: 34,
    cabWidth: 25,
    isUpper: false,
    cabNomenclature: "SB-1D-2S",
    doorStyleSelection: "High Quality Wooden Door",
    sectionCode: "1V-D=L|T",
    photo: "cab_01.png",
    obj: "cab_01.obj",
    isUpper: false
}

export let validDoorTempOne = 
{
    doorStyle: "East Coast 12",
    //We don't include the modelPath and photoPath as it would be added later on
}

export let validDoorTempTwo = 
{
    doorStyle: "Westbank",
    //We don't include the modelPath and photoPath as it would be added later on
}

export let validStyleTempOne =
{
    databaseName: "TLD DOORS",
    styleName: "Westbank",
    insideEdge: "",
    material: "MDF – SPRAY 3/4",
    outsideEdge: "",
    raisedPanel: "",
    routePattern: "Westbank"
}

export let validStyleTempTwo =
{
    databaseName: "TLD DOORS",
    styleName: "East Coast 12",
    insideEdge: "",
    material: "MDF – Spray MB",
    outsideEdge: "",
    raisedPanel: "",
    routePattern: "EastCoast"
}
    
export let validDoorTempThree = 
{
    doorStyle: "East Coast 12",
    photo: "door_01.png",
    obj: "door_01.obj",
    doorStyleSelection: "Wade's Epic Cabinet"
}

export let validStyleInfoForm =
{
    styleName: "Westbank",
    databaseName: "TLD DOORS",
    insideEdge: "",
    material: "MDF - Spray 3/4",
    outsideEdge: "",
    raisedPanel: "",
    routePattern: ""
}

export let mockDoorStyleList = [
    {
        doorStyle: "High Quality Wooden Door",
        _id: 420
    }
]

export let mockStyleList = [
    {
        styleName: "Wade's Epic Cabinet",
        _id: 420
    }
]

export let mockedRoomIDResolved = {
    "records": 
    [
        {
            "keys": [
                "r"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 374,
                        "high": 0
                    },
                    "labels": [
                        "Room"
                    ],
                    "properties": {
                        "roomID": 0
                    }
                }
            ],
            "_fieldLookup": {
                "r": 0
            }
        }
    ],
    "summary": {
        "query": {
            "text": "MATCH (r:Room) RETURN r ORDER BY r.roomID DESC LIMIT 1",
            "parameters": {}
        },
        "queryType": "r",
        "counters": {
            "_stats": {
                "nodesCreated": 0,
                "nodesDeleted": 0,
                "relationshipsCreated": 0,
                "relationshipsDeleted": 0,
                "propertiesSet": 0,
                "labelsAdded": 0,
                "labelsRemoved": 0,
                "indexesAdded": 0,
                "indexesRemoved": 0,
                "constraintsAdded": 0,
                "constraintsRemoved": 0
            },
            "_systemUpdates": 0
        },
        "updateStatistics": {
            "_stats": {
                "nodesCreated": 0,
                "nodesDeleted": 0,
                "relationshipsCreated": 0,
                "relationshipsDeleted": 0,
                "propertiesSet": 0,
                "labelsAdded": 0,
                "labelsRemoved": 0,
                "indexesAdded": 0,
                "indexesRemoved": 0,
                "constraintsAdded": 0,
                "constraintsRemoved": 0
            },
            "_systemUpdates": 0
        },
        "plan": false,
        "profile": false,
        "notifications": [],
        "server": {
            "address": "192.168.88.128:7687",
            "version": "Neo4j/4.4.10",
            "agent": "Neo4j/4.4.10",
            "protocolVersion": 4.4
        },
        "resultConsumedAfter": {
            "low": 0,
            "high": 0
        },
        "resultAvailableAfter": {
            "low": 0,
            "high": 0
        },
        "database": {
            "name": "neo4j"
        }
    }
}

export let resolvedWallLookup = {
    "records": [
        {
            "keys": [
                "w"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 390,
                        "high": 0
                    },
                    "labels": [
                        "Wall"
                    ],
                    "properties": {
                        "posX": 0,
                        "wallRotation": 0,
                        "posZ": 0,
                        "wallLength": 23,
                        "wallNumber": 1,
                        "wallHeight": 3
                    }
                }
            ],
            "_fieldLookup": {
                "w": 0
            }
        },
        {
            "keys": [
                "w"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 391,
                        "high": 0
                    },
                    "labels": [
                        "Wall"
                    ],
                    "properties": {
                        "posX": 23,
                        "wallRotation": 4.71238898038469,
                        "posZ": 0,
                        "wallLength": 23,
                        "wallNumber": 2,
                        "wallHeight": 3
                    }
                }
            ],
            "_fieldLookup": {
                "w": 0
            }
        },
        {
            "keys": [
                "w"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 392,
                        "high": 0
                    },
                    "labels": [
                        "Wall"
                    ],
                    "properties": {
                        "posX": 23,
                        "wallRotation": 3.141592653589793,
                        "posZ": 23,
                        "wallLength": 23,
                        "wallNumber": 3,
                        "wallHeight": 3
                    }
                }
            ],
            "_fieldLookup": {
                "w": 0
            }
        },
        {
            "keys": [
                "w"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 393,
                        "high": 0
                    },
                    "labels": [
                        "Wall"
                    ],
                    "properties": {
                        "posX": 0,
                        "wallRotation": 1.5707963267948966,
                        "posZ": 23,
                        "wallLength": 23,
                        "wallNumber": 4,
                        "wallHeight": 3
                    }
                }
            ],
            "_fieldLookup": {
                "w": 0
            }
        }
    ],
    "summary": {
        "query": {
            "text": "match (r:Room where r.roomID=6)-[n]-(w:Wall) return w order by w.wallNumber",
            "parameters": {}
        },
        "queryType": "r",
        "counters": {
            "_stats": {
                "nodesCreated": 0,
                "nodesDeleted": 0,
                "relationshipsCreated": 0,
                "relationshipsDeleted": 0,
                "propertiesSet": 0,
                "labelsAdded": 0,
                "labelsRemoved": 0,
                "indexesAdded": 0,
                "indexesRemoved": 0,
                "constraintsAdded": 0,
                "constraintsRemoved": 0
            },
            "_systemUpdates": 0
        },
        "updateStatistics": {
            "_stats": {
                "nodesCreated": 0,
                "nodesDeleted": 0,
                "relationshipsCreated": 0,
                "relationshipsDeleted": 0,
                "propertiesSet": 0,
                "labelsAdded": 0,
                "labelsRemoved": 0,
                "indexesAdded": 0,
                "indexesRemoved": 0,
                "constraintsAdded": 0,
                "constraintsRemoved": 0
            },
            "_systemUpdates": 0
        },
        "plan": false,
        "profile": false,
        "notifications": [],
        "server": {
            "address": "192.168.88.128:7687",
            "version": "Neo4j/4.4.10",
            "agent": "Neo4j/4.4.10",
            "protocolVersion": 4.4
        },
        "resultConsumedAfter": {
            "low": 1,
            "high": 0
        },
        "resultAvailableAfter": {
            "low": 0,
            "high": 0
        },
        "database": {
            "name": "neo4j"
        }
    }
}

export let resolved5WallsLookup = {
    "records": [
        {
            "keys": [
                "w"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 390,
                        "high": 0
                    },
                    "labels": [
                        "Wall"
                    ],
                    "properties": {
                        "posX": 0,
                        "wallRotation": 0,
                        "posZ": 0,
                        "wallLength": 23,
                        "wallNumber": 1,
                        "wallHeight": 3
                    }
                }
            ],
            "_fieldLookup": {
                "w": 0
            }
        },
        {
            "keys": [
                "w"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 391,
                        "high": 0
                    },
                    "labels": [
                        "Wall"
                    ],
                    "properties": {
                        "posX": 23,
                        "wallRotation": 4.71238898038469,
                        "posZ": 0,
                        "wallLength": 23,
                        "wallNumber": 2,
                        "wallHeight": 3
                    }
                }
            ],
            "_fieldLookup": {
                "w": 0
            }
        },
        {
            "keys": [
                "w"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 392,
                        "high": 0
                    },
                    "labels": [
                        "Wall"
                    ],
                    "properties": {
                        "posX": 23,
                        "wallRotation": 3.141592653589793,
                        "posZ": 23,
                        "wallLength": 23,
                        "wallNumber": 3,
                        "wallHeight": 3
                    }
                }
            ],
            "_fieldLookup": {
                "w": 0
            }
        },
        {
            "keys": [
                "w"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 393,
                        "high": 0
                    },
                    "labels": [
                        "Wall"
                    ],
                    "properties": {
                        "posX": 0,
                        "wallRotation": 1.5707963267948966,
                        "posZ": 23,
                        "wallLength": 23,
                        "wallNumber": 4,
                        "wallHeight": 3
                    }
                }
            ],
            "_fieldLookup": {
                "w": 0
            }
        },
    ],
    "summary": {
        "query": {
            "text": "match (r:Room where r.roomID=6)-[n]-(w:Wall) return w order by w.wallNumber",
            "parameters": {}
        },
        "queryType": "r",
        "counters": {
            "_stats": {
                "nodesCreated": 0,
                "nodesDeleted": 0,
                "relationshipsCreated": 0,
                "relationshipsDeleted": 0,
                "propertiesSet": 0,
                "labelsAdded": 0,
                "labelsRemoved": 0,
                "indexesAdded": 0,
                "indexesRemoved": 0,
                "constraintsAdded": 0,
                "constraintsRemoved": 0
            },
            "_systemUpdates": 0
        },
        "updateStatistics": {
            "_stats": {
                "nodesCreated": 0,
                "nodesDeleted": 0,
                "relationshipsCreated": 0,
                "relationshipsDeleted": 0,
                "propertiesSet": 0,
                "labelsAdded": 0,
                "labelsRemoved": 0,
                "indexesAdded": 0,
                "indexesRemoved": 0,
                "constraintsAdded": 0,
                "constraintsRemoved": 0
            },
            "_systemUpdates": 0
        },
        "plan": false,
        "profile": false,
        "notifications": [],
        "server": {
            "address": "192.168.88.128:7687",
            "version": "Neo4j/4.4.10",
            "agent": "Neo4j/4.4.10",
            "protocolVersion": 4.4
        },
        "resultConsumedAfter": {
            "low": 1,
            "high": 0
        },
        "resultAvailableAfter": {
            "low": 0,
            "high": 0
        },
        "database": {
            "name": "neo4j"
        }
    }
}
export let resolvedWall = {
    "WallArray": [
        {
            "wallNumber": 1,
            "posX":7.74,
            "posZ":10.08,
            "wallLength":14.241699336806686,
            "wallHeight":3,
            "wallRotation":3.658648542697171,
            "leftWall": null
        },
    
        {
            "wallNumber":2,
            "posX":7.74,
            "posZ":10.08,
            "wallLength":14.241699336806686,
            "wallHeight":3,
            "wallRotation":3.658648542697171,
            "leftWall": {"posX":7.74, "posZ":10.08, "wallLength":14.241699336806686, "wallHeight":3, "wallRotation":3.658648542697171}
        },
    
        {
            "wallNumber":3,
            "posX":-7.26,
            "posZ":7.5,
            "wallLength":10.438275719677076,
            "wallHeight":3,
            "wallRotation":0.8016568932025778,
            "leftWall": {"wallNumber":2, "posX":7.74, "posZ":10.08, "wallLength":14.241699336806686, "wallHeight":3,"wallRotation":3.658648542697171,}
        },
        
        {
            "wallNumber":4,
            "posX":-7.26,
            "posZ":7.5,
            "wallLength":10.438275719677076,
            "wallHeight":3,
            "wallRotation":0.8016568932025778,
            "leftWall": {"wallNumber":3, "posX":7.74, "posZ":10.08, "wallLength":14.241699336806686, "wallHeight":3,"wallRotation":3.658648542697171,}
        },
    
    
    ]
}


    
