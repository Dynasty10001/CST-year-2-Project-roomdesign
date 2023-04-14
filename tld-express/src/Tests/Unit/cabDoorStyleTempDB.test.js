import { describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it, mockResolvedValue } from '@jest/globals'
import { validCabTempOne, validCabTempTwo, validDoorTempOne, validDoorTempTwo, validStyleTempOne, validStyleTempTwo } from '../mocks';
import { cloneDeep, forIn, remove } from 'lodash';

import { _addCabItemToDB, _addDoorItemToDB, _addStyleItemToDB } from '../../Utilities/CabinetDB';
import Neode from 'neode';

jest.mock('../../../node_modules/three/src/loaders/TextureLoader', () => ({
    TextureLoader: 0
  }));
  jest.mock('three/examples/jsm/loaders/OBJLoader', () => ({
    OBJLoader: 0
  }))
  
  jest.mock('@react-three/fiber', () => ({
    ...jest.requireActual('@react-three/fiber'),
    Canvas: ({ }) => (<p>'hello'</p>)// TODO Maybe remove for performance
  }))

jest.mock('Neode');

describe("DATABASE VERIFICATION (DOOR, CABINET, and STYLE Validation)", () => {

        // Our valid and invalid cabinet, style, and door that are epicly mocked!
        let validCabTemp1, validDoorTemp1, validStyleTemp1;


        // Resetting information
        beforeEach(async () => {
            // Setting up a deep copy of those required data
            validCabTemp1 = cloneDeep(validCabTempOne);
            validDoorTemp1 = cloneDeep(validDoorTempOne);
            validStyleTemp1 = cloneDeep(validStyleTempOne);
        })

        // To ensure that Jest's mocks are cleared everytime we run it, we call this.
        afterEach(() => {
            jest.clearAllMocks()
        })

        //THIS PORITION ALLOW US TO DETERMINE THE DATABASE FUNCTIONALITY TEST
        describe("Cabinet Database Function Testing", () => {
            let instance;

            beforeEach(() => {
               instance = new Neode(jest.fn());
            });

            // To ensure that Jest's mocks are cleared everytime we run it, we call this.
            afterEach(() => {
                jest.clearAllMocks()
            })

            // CABINET
            test("Test to Ensure that a valid cabinet is successfully accepted by our database", async () => {
                // This is where we use the mocked database
                instance.first.mockResolvedValue(false);
                instance.create.mockResolvedValue(validCabTemp1);
                let result = await _addCabItemToDB(validCabTemp1, instance);
                expect(result).toEqual(validCabTemp1);
                
            });

            test("Test to ensure that invalid/re-added cabinet gets rejected and returns an error", async () => {
                // This is where we use the mocked database
                instance.first.mockResolvedValue(true);
                instance.create.mockResolvedValue(validCabTemp1);

                try
                {
                    await _addCabItemToDB(validCabTemp1, instance);
                }

                catch (err)
                {
                    expect(err.message).toBe("E201 - Given Cabinet Identifier Not Unique");
                }

                
            });
        })

        describe("Door Item Database Function Testing", ()=> {
            let instance;

            beforeEach(() => {
               instance = new Neode(jest.fn());
            });

            // To ensure that Jest's mocks are cleared everytime we run it, we call this.
            afterEach(() => {
                jest.clearAllMocks()
            })


            // DOOR ITEM
            it("Test to Ensure that a valid Door item is successfully accepted by our database", async() => {
                instance.first.mockResolvedValue(false);
                instance.create.mockResolvedValue(validDoorTemp1);
                let result = await  _addDoorItemToDB(validDoorTemp1, instance);
                expect(result).toEqual(validDoorTemp1);
            });

            it("Test to ensure that invalid/re-added Door item gets rejected and returns an error", async () => {
                 // This is where we use the mocked database
                 instance.first.mockResolvedValue(true);
                 instance.create.mockResolvedValue(validDoorTemp1);
 
                 try
                 {
                     await _addDoorItemToDB(validDoorTemp1, instance);
                 }
 
                 catch (err)
                 {
                     expect(err.message).toBe("E202 - Given Door Style Not Unique");
                 }

            });
        })
        
        describe("Style Item Database Function Testing" , () => {
            let instance;

            beforeEach(() => {
               instance = new Neode(jest.fn());
            });

            // To ensure that Jest's mocks are cleared everytime we run it, we call this.
            afterEach(() => {
                jest.clearAllMocks()
            })

            // STYLE TEMPLATE
            it("Test to Ensure that a valid Style item is successfully accepted by our database", async () => {
                instance.first.mockResolvedValue(false);
                instance.create.mockResolvedValue(validStyleTemp1);
                let result = await  _addStyleItemToDB(validStyleTemp1, instance);
                expect(result).toEqual(validStyleTemp1);
            
            })


            it("Test to Ensure that Two Sytle Item is successfully added to the database, and can be retrieved easily", async () => {
                // This is where we use the mocked database
                 instance.first.mockResolvedValue(true);
                 instance.create.mockResolvedValue(validStyleTemp1);
 
                 try
                 {
                     await _addStyleItemToDB(validStyleTemp1, instance);
                 }
 
                 catch (err)
                 {
                     expect(err.message).toBe("E203 - Given Style Not Unique");
                 }
            });
        })
});
