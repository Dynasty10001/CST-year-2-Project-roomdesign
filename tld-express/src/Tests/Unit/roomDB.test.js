import { cloneDeep } from "lodash";
import { Box3 } from "three";
import Cabinet, { adjustY } from "../../Components/Shared/Models/Cabinet";
import { mockedCabinetList, testCabUpper, testCabNotCollided } from "../mocks";
import { describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it } from '@jest/globals';
import { addRoomAndWallsToDB, _getCabinetJSON } from '../../Utilities/RoomDB'
import Neode from 'neode';
import { addWallToDB, _addRoomAndWallsToDB } from '../../Utilities/RoomDB'
import { mockedRoomIDResolved } from "../mocks";

jest.mock('three/src/loaders/TextureLoader', () => ({
    TextureLoader: 0
}));

jest.mock('three/examples/jsm/loaders/OBJLoader', () => ({
    OBJLoader: 0
}));

jest.mock('Neode');
jest.mock('../../Utilities/RoomDB', () => ({
    ...jest.requireActual('../../Utilities/RoomDB'),
    addWallToDB: jest.fn()
}));

describe('ORD File contains proper coordinate data', () => {
    let cabinet = {
        properties: {
                "posx": 1.0983911496850533e-14,
                "posy": 40,
                "posz": 9.071630844969661,
                "rotx": 0,
                "isUpper": true,
                "rotz": 1.5707963267948966,
                "roty": 0,
                "modelPath": "https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/uploads_files_4044539_PUSHENN01-1.obj",
                "distanceFromWall": 3,
                "cabIdentifier": 1,
                "wallNumber": 2
            }
    }

    let cabTemplate = {
        "records": [
            {
                "_fields": [
                    {
                        "properties": {
                            "cabinetID": {
                                "low": 300,
                                "high": 0
                            },
                            "modelPath": " https://tldexpress.blob.core.windows.net/uploaded-cab-door-obj-assets/cab2 dxf.obj",
                            "cabNomenclature": "SB-1D-2S",
                            "cabIdentifier": "42359",
                            "posx": {
                                "low": 40,
                                "high": 0
                            },
                            "posy": {
                                "low": 0,
                                "high": 100
                            },
                            "posz": {
                                "low": 0,
                                "high": 0
                            },
                            "cabDepth": 24,
                            "rotx": {
                                "low": 0,
                                "high": 0
                            },
                            "rotz": {
                                "low": 0,
                                "high": 0
                            },
                            "isUpper": true,
                            "roty": {
                                "low": 0,
                                "high": 0
                            },
                            "sectionCode": "1V-D=L|T",
                            "cabWidth": 15.875,
                            "cabHeight": 34.875
                        }
                    }
                ],
            }
        ]
    }



    let expectedres = {
        EntryNumber: 1,
        CabNomenclature: 'SB-1D-2S',
        Width: 15.875,
        Height: 34.875,
        Depth: 24,
        HingeDirection: 'L',
        EndType: 'B',
        Quantity: 1,
        Comment: '',
        WallNumber: 2,
        WallStartDistance: 3,
        DistanceFromFloor: 40,
        DistanceFromWall: 0,
        CabType: 2,
        CabFill: 0,
        SectionCode: '1V-D=L|T',
        CabinetID: '42359',
        ModifyCode: 'S'
    }

    it('Should contain y coordinate data equal to that of the cabinet', async () => {
        //Let's create an MOCK instance 
        let instance = new Neode(jest.fn());

        //Instiate that mock resolve
        instance.cypher.mockResolvedValue(cabTemplate);

        // Run it
        let res = await _getCabinetJSON(cabinet, instance)
        expect(res).toEqual(expectedres)

        cabinet.properties.posy = 0

        res = await _getCabinetJSON(cabinet, instance)
        expect(res).not.toEqual(expectedres)

        expectedres.DistanceFromFloor = 0
        expect(res).toEqual(expectedres)
        jest.clearAllMocks()
    });
})

describe("TEST FOR AUTOMATIC ROOM ID INCREMENTAL", () => {
    let mockInstance;
    let mockedResolveInstance;

    beforeEach(() => {
        mockedResolveInstance = cloneDeep(mockedRoomIDResolved);
        jest.clearAllMocks()
        mockInstance = new Neode(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
        mockedResolveInstance = null;
    });

    it("Test to determine that Room ID is 1 when there is no room present in the database", async () => {
        //Create a resolved value
        //In this scenario, when you mock the database, the return of null means that there are no rooms to iterate through to the database.
        mockedResolveInstance.records.length = 0;
        mockInstance.cypher.mockResolvedValue(mockedResolveInstance);

        //Since we are not testing the creation of walls, we resolve the mocked addWallsToDB as true
        addWallToDB.mockResolvedValue(true);

        //Now we test.
        expect(await _addRoomAndWallsToDB([1,2,3], mockInstance, addWallToDB)).toEqual(1);

    })

    it("Test to determine that Room ID of the new room as 2 when the room with the highest roomID in the database is 1", async () => {
        //Create a resolved value
        //In this scenario, when you mock the database, the return of 1 means that the highest roomID in our database is 1, meaning there is a room
        mockedResolveInstance.records[0]["_fields"][0].properties.roomID = 1
        mockInstance.cypher.mockResolvedValue(mockedResolveInstance);

        //Since we are not testing the creation of walls, we resolve the mocked addWallsToDB as true
        addWallToDB.mockResolvedValue(true);

        //Now we test.
        expect(await _addRoomAndWallsToDB([1,2,3], mockInstance, addWallToDB)).toEqual(2);
    })

    it("Test to determine that Room ID of the new room as 10 when the room with the highest roomID in the database is 11", async () => {
        //Create a resolved value
        //In this scenario, when you mock the database, the return of 11 means that the highest roomID in our database is 11, meaning there is a room
        mockedResolveInstance.records[0]["_fields"][0].properties.roomID = 11
        mockInstance.cypher.mockResolvedValue(mockedResolveInstance);

        //Since we are not testing the creation of walls, we resolve the mocked addWallsToDB as true
        addWallToDB.mockResolvedValue(true);

        //Now we test.
        expect( await _addRoomAndWallsToDB([1,2,3], mockInstance, addWallToDB)).toEqual(12);
    })
});