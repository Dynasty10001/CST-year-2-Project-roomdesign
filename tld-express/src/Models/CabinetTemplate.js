//instance.model('CabinetTemplate', {
    let CabinetTemplate = {

    posx: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    posy: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    posz: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    rotx: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    roty: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },
    rotz: {
        type: 'number',
        required: true, // Creates an Exists Constraint in Enterprise mode
    },

    cabIdentifier: {
        type: 'number',
        primary: true,
    },

    // NOTE: THIS IS ALL JUST NOTHING AS WE JUST WANT THEM TO BE STUBBED FOR NOW. :)
    cabName: {
        type: 'string',
        required: true,
        min: 1,
        max: 255,
    },

    sectionCode: {
        type: 'string',
        required: true,
        min: 1,
        max: 255,
    },

    cabNomenclature:
    {
        type: 'string',
        required: true,
        min: 1,
        max: 255,
    },

    cabDepth: {
        type: 'number',
        required: true
    },

    cabHeight: {
        type: 'number',
        required: true
    },

    cabWidth: {
        type: 'number',
        required: true
    },

    modelPath:
    {
        type: 'string',
        required: true,
        min: 1,
        max: 255,
    },

    photoPath:
    {
        type: 'string',
        required: true,
        min: 1,
        max: 255,
    },

    isUpper:
    {
        type: 'boolean',
        required: true,
    },
    contains_this_doorTemplate:{
        type: "relationship",
        target: "DoorTemplate",
        relationship: "CONTAINS_THIS_DOOR",
        direction: "out",
        eager: true // <-- eager load this relationship
    },
}
//});
export default CabinetTemplate