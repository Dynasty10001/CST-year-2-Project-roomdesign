//instance.model('DoorTemplate', {
let DoorTemplate = {    // NOTE: THIS IS ALL JUST NOTHING AS WE JUST WANT THEM TO BE STUBBED FOR NOW. :)
    
    
    doorStyle:
    {
     type: 'string',
     required: true,
     min: 1,
     max: 255,
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
    }
}
//});
export default DoorTemplate