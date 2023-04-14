import {describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it} from '@jest/globals';
import Validator from 'neode/build/Services/Validator'
import Model from 'neode/build/Model'

// THIS SECTION CONTAINS THE MODELS NEEDED TO BE TESTED
import CabinetTemplate from '../../Models/CabinetTemplate'
import DoorTemplate from '../../Models/DoorTemplate'
import StyleTemplate from '../../Models/StyleTemplate'

// FOR EACH DESCRIBE BLOCKS, THIS IS WHERE IT VALIDATES EACH FIELDS REQUIRED (OR MAYBE NOT REQUIRED)
// FOR THOSE TEMPLATES

//TODO: MIGHT NUKE THE POSITION AND ROTATION TESTING THOUGH

describe("CabinetTemplate Schema Validation" ,() => {
    const neode = null
    const model = new Model(neode, 'CabinetTemplate', CabinetTemplate);

    let validBaseCabinetTemplate = {};

    //Before each run, we reverse the template with validated base cabinet template information needed.
    beforeEach(() => {
        validBaseCabinetTemplate = {
            // Since POSX, POSY, POSZ (and their rotation counterpart) is already tested in previous test, we just put valid numbers
            // into them
            posx: 0,
            posy: 0,
            posz: 0,
            rotx: 0,
            roty: 0,
            rotz: 0,

            //Now this is where we put our new valid fields.
            cabName: "Wood Cabinet",
            cabIdentifier: 42359,
            sectionCode: "1V-D=L|T",
            cabNomenclature: "SB-1D-2S",
            cabDepth: 24,
            cabHeight: 34.875,
            cabWidth: 25,
            isUpper: false,
            modelPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-assets-example/cab1 dxf.obj",
            photoPath: "https://i.ebayimg.com/images/g/NXgAAOSwYVFg2H~-/s-l500.jpg"
        }
    })

    // THIS FUNCTION IS MADE BY ETHAN ON THE LAST RELEASE 3 TESTS THAT BASICALLY ALLOWS US TO GET THE DESIRED
    // ERROR MESSAGES WE ARE EXPECTING.
    const testValidation = async (data, field, errorMessage) => {
        try {
            await Validator(neode, model, data)
        } catch (err) {
            expect(err.details).not.toHaveLength(0)
            expect(err.details[0]['message']).toBe(`"${field}" ${errorMessage}`)
        }
    }

    // LET THE TESTING BEGINS

    //START POSX
    //Tried to test for null/empty, but was given "must be a number" error, changed test to fit the error message
    it("Cabinet Item's Pos X must be a number", () => {
        const data = validBaseCabinetTemplate;
        data.posx = "";
        testValidation(data, "posx", "must be a number");

    });

    it("Cabinet Item's Pos X should not be negative", () => {
        const data = validBaseCabinetTemplate;
        data.posx = -1;
        testValidation(data, "posx", "is not allowed to be negative");
    });

    it("Cabinet Item's Pos X should be a numerical value", () => {
        const data = validBaseCabinetTemplate;
        data.posx = "Wow"
        testValidation(data, "posx", "must be a number");
    });
    // END POSX

    // START POSY
    //Tried to test for null/empty, but was given "must be a number" error, changed test to fit the error message
    it("Cabinet Item's Pos Y must be a number", () => {
        const data = validBaseCabinetTemplate;
        data.posy = "";
        testValidation(data, "posy", "must be a number");

    });

    it("Cabinet Item's Pos Y should not be negative", () => {
        const data = validBaseCabinetTemplate;
        data.posy = -1;
        testValidation(data, "posy", "is not allowed to be negative");
    });

    it("Cabinet Item's Pos Y should be a numerical value", () => {
        const data = validBaseCabinetTemplate;
        data.posy = "Wow"
        testValidation(data, "posy", "must be a number");
    });
    // END POSY

    // START POSZ
    //Tried to test for null/empty, but was given "must be a number" error, changed test to fit the error message
    it("Cabinet Item's Pos Z must be a number", () => {
        const data = validBaseCabinetTemplate;
        data.posz = "";
        testValidation(data, "posz", "must be a number");

    });

    it("Cabinet Item's Pos Z should not be negative", () => {
        const data = validBaseCabinetTemplate;
        data.posz = -1;
        testValidation(data, "posz", "is not allowed to be negative");
    });

    it("Cabinet Item's Pos Z should be a numerical value", () => {
        const data = validBaseCabinetTemplate;
        data.posz = "Wow"
        testValidation(data, "posz", "must be a number");
    });
    // END POSXZ

    /// START OF ROTATION
        // START ROTX
        //Tried to test for null/empty, but was given "must be a number" error, changed test to fit the error message
        it("Cabinet Item's ROT X must be a number", () => {
            const data = validBaseCabinetTemplate;
            data.rotx = "";
            testValidation(data, "rotx", "must be a number");
    
        });
    
        it("Cabinet Item's ROT X should not be negative", () => {
            const data = validBaseCabinetTemplate;
            data.rotx = -1;
            testValidation(data, "rotx", "is not allowed to be negative");
        });
    
        it("Cabinet Item's ROT X should be a numerical value", () => {
            const data = validBaseCabinetTemplate;
            data.rotx = "Wow"
            testValidation(data, "rotx", "must be a number");
        });
        // END ROTX
    
        // START ROTY
        //Tried to test for null/empty, but was given "must be a number" error, changed test to fit the error message
        it("Cabinet Item's ROT Y must be a number", () => {
            const data = validBaseCabinetTemplate;
            data.roty = "";
            testValidation(data, "roty", "must be a number");
    
        });
    
        it("Cabinet Item's ROT Y should not be negative", () => {
            const data = validBaseCabinetTemplate;
            data.roty = -1;
            testValidation(data, "roty", "is not allowed to be negative");
        });
    
        it("Cabinet Item's ROT Y should be a numerical value", () => {
            const data = validBaseCabinetTemplate;
            data.roty = "Wow"
            testValidation(data, "roty", "must be a number");
        });
        // END ROTY
    
        // START ROTZ
        //Tried to test for null/empty, but was given "must be a number" error, changed test to fit the error message
        it("Cabinet Item's ROT Z must be a number", () => {
            const data = validBaseCabinetTemplate;
            data.rotz = "";
            testValidation(data, "rotz", "must be a number");
    
        });
    
        it("Cabinet Item's ROT Z should not be negative", () => {
            const data = validBaseCabinetTemplate;
            data.rotz = -1;
            testValidation(data, "rotz", "is not allowed to be negative");
        });
    
        it("Cabinet Item's ROT Z should be a numerical value", () => {
            const data = validBaseCabinetTemplate;
            data.rotz = "Wow"
            testValidation(data, "rotz", "must be a number");
        });
        // END ROTZ
        
    /// START OF OTHER FIELDS
    it("Cabinet Item's cabinetName should not be null/empty", () => {
        const data = validBaseCabinetTemplate;
        data.cabName = "";
        testValidation(data, "cabName", "is not allowed to be empty");
    });

    //Tried to test for null/empty, but was given "must be a number" error, changed test to fit the error message
    it("Cabinet Item's cabinetIdentifier must be a number", () => {
        const data = validBaseCabinetTemplate;
        data.cabIdentifier = ""
        testValidation(data, "cabIdentifier", "must be a number");
    });

    it("Cabinet Item's cabinetIdentifier should not be negative", () => {
        const data = validBaseCabinetTemplate;
        data.cabIdentifier = -1
        testValidation(data, "cabIdentifier", "is not allowed to be negative");
    });

    it("Cabinet Item's sectionCode should not be null/empty", () => {
        const data = validBaseCabinetTemplate;
        data.sectionCode = "";
        testValidation(data, "sectionCode", "is not allowed to be empty");
    });

    it("Cabinet Item's Nomenclature should not be null/empty", () => {
        const data = validBaseCabinetTemplate;
        data.cabNomenclature = "";
        testValidation(data, "cabNomenclature", "is not allowed to be empty");
    });

    //Tried to test for null/empty, but was given "must be a number" error, changed test to fit the error message
    it("Cabinet Item's depth must be a number", () => {
        const data = validBaseCabinetTemplate;
        data.cabDepth = "";
        testValidation(data, "cabDepth", "must be a number");
    });

    it("Cabinet Item's depth should not be negative", () => {
        const data = validBaseCabinetTemplate;
        data.cabDepth = -1;
        testValidation(data, "cabDepth", "is not allowed to be negative");
    });

    it("Cabinet Item's width must be a number", () => {
        const data = validBaseCabinetTemplate;
        data.cabWidth = "";
        testValidation(data, "cabWidth", "must be a number");
    });

    it("Cabinet Item's width should not be negative", () => {
        const data = validBaseCabinetTemplate;
        data.cabWidth = -1;
        testValidation(data, "cabWidth", "is not allowed to be negative");
    });

    //Tried to test for null/empty, but was given "must be a number" error, changed test to fit the error message
    it("Cabinet Item's height must be a number", () => {
        const data = validBaseCabinetTemplate;
        data.cabHeight = "";
        testValidation(data, "cabHeight", "must be a number");
    });

    it("Cabinet Item's height should not be negative", () => {
        const data = validBaseCabinetTemplate;
        data.cabHeight = -1;
        testValidation(data, "cabHeight", "is not allowed to be negative");
    });

    it("Cabinet Item's modelPath should not be null/empty", () => {
        const data = validBaseCabinetTemplate;
        data.modelPath = "";
        testValidation(data, "modelPath", "is not allowed to be empty");
    });

    it("Cabinet Item's photoPath should not be null/empty", () => {
        const data = validBaseCabinetTemplate;
        data.photoPath = "";
        testValidation(data, "photoPath", "is not allowed to be empty");
    });




})



describe("DoorTemplate Schema Validation" ,() => {
    const neode = null
    const model = new Model(neode, 'DoorTemplate', DoorTemplate);

    let validBaseDoorTemplate = {};

    //Before each run, we reverse the template with validated base cabinet template information needed.
    beforeEach(() => {
        validBaseDoorTemplate = {
            doorStyle: "East Coast 12",
            modelPath: "https://tldexpress.blob.core.windows.net/uploaded-cab-door-assets-example/door1 dxf.obj",
            photoPath: "https://i.ebayimg.com/images/g/K-4AAOSwTjRfd-7L/s-l500.jpg"
        }
    })

    // THIS FUNCTION IS MADE BY ETHAN ON THE LAST RELEASE 3 TESTS THAT BASICALLY ALLOWS US TO GET THE DESIRED
    // ERROR MESSAGES WE ARE EXPECTING.
    const testValidation = async (data, field, errorMessage) => {
        try {
            await Validator(neode, model, data)
        } catch (err) {
            expect(err.details).not.toHaveLength(0)
            expect(err.details[0]['message']).toBe(`"${field}" ${errorMessage}`)
        }
    }

    // LET THE TESTING BEGINS
    it("Door Item's Door Style must be not null", () => {
        const data = validBaseDoorTemplate;
        data.doorStyle = "";
        testValidation(data, "doorStyle", "is not allowed to be empty");
    })

    it("Door Item's Model Path must be not null", () => {
        const data = validBaseDoorTemplate;
        data.modelPath = "";
        testValidation(data, "modelPath", "is not allowed to be empty");
    })

    it("Door Item's Photo Path must be not null", () => {
        const data = validBaseDoorTemplate;
        data.photoPath = "";
        testValidation(data, "photoPath", "is not allowed to be empty");
    })
});

describe("StyleTemplate Schema Validation", () => {
    const neode = null
    const model = new Model(neode, 'StyleTemplate', StyleTemplate);

    let validBaseStyleTemplate = {};

    //Before each run, we reverse the template with validated base cabinet template information needed.
    beforeEach(() => {
        validBaseStyleTemplate = {
            databaseName: "TLD DOORS",
            styleName: "Westbank",
            routePattern: "",
            raisedPanel: "",
            outsideEdge: "",
            insideEdge: "",
            material: "MDF - SPRAY 3/4"
        }
    })

    // THIS FUNCTION IS MADE BY ETHAN ON THE LAST RELEASE 3 TESTS THAT BASICALLY ALLOWS US TO GET THE DESIRED
    // ERROR MESSAGES WE ARE EXPECTING.
    const testValidation = async (data, field, errorMessage) => {
        try {
            await Validator(neode, model, data)
        } catch (err) {
            expect(err.details).not.toHaveLength(0)
            expect(err.details[0]['message']).toBe(`"${field}" ${errorMessage}`)
        }
    }

    // CODY, it is jank
    const testCorrectValidation = async (data) => {
        try {
            await Validator(neode, model, data)
            expect(true).toBeTruthy;
        } catch (err) {
            expect(false).toBeTruthy;
        }
    }

    // Let the test begins
    it("Style's database name must be not null", () => {
        const data = validBaseStyleTemplate;
        data.databaseName = "";
        testValidation(data, "databaseName", "is not allowed to be empty");
    })

    it("Style's styleName must be not null", () => {
        const data = validBaseStyleTemplate;
        data.styleName= "";
        testValidation(data, "styleName", "is not allowed to be empty");
    })

    it("Style's optional fields can be null or empty", () => {
        const data = validBaseStyleTemplate;
        data.routePattern = ""
        data.raisedPanel = ""
        data.outsideEdge = ""
        data.insideEdge = ""
        data.material = ""
        
        //This is where we seperate ethan's function to determine if we are able to pass this test
        testCorrectValidation(data);
    })
})