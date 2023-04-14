//instance.model('StyleTemplate', {
let StyleTemplate = {
    // NOTE: THIS IS ALL JUST NOTHING AS WE JUST WANT THEM TO BE STUBBED FOR NOW. :)
    databaseName: {
        type: 'string',
        required: true,
        min: 1,
        max: 255,
    },

    styleName: {
        type: 'string',
        required: true,
        min: 1,
        max: 255,
    },

    insideEdge: {
        type: 'string',
        optional: true,
        allow: [''],
        empty: true,
        min: 0,
        max: 255,
    },

    outsideEdge: {
        type: 'string',
        optional: true,
        allow: [''],
        empty: true,
        min: 0,
        max: 255,
    },

    material: {
        type: 'string',
        optional: true,
        allow: [''],
        empty: true,
        min: 0,
        max: 255,
    },

    raisedPanel: {
        type: 'string',
        optional: true,
        allow: [''],
        empty: true,
        min: 0,
        max: 255,
    },

    routePattern: {
        type: 'string',
        optional: true,
        allow: [''],
        empty: true,
        min: 0,
        max: 255,
    },

    THEOTHEREMPTYSTRING: 
    {
        type: 'string',
        optional: true,
        empty: true,
        allow: [''],
        min: 0,
        max: 255,
    },
}
//});
export default StyleTemplate