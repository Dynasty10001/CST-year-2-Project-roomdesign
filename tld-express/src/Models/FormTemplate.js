import * as Yup from 'yup';

const SUPPORTED_IMG_FORMATS = [
    "image/jpeg",
    "image/png"
]

const supportedOBJRegex = new RegExp('^.*\.obj$');

const SUPPORTED_FILE_SIZE = 1024 * 1024 * 5

export const DisplayErrorForCabForm = Yup.object().shape({
    cabName: Yup.string()
    .min(1, "Name of Cabinet must be, at minimum, one character long")
    .max(255, "Name of the Cabinet must be, at most, 255 characters in length")
    .required("Name must be supplied"),

    cabIdentifier: Yup.number()
    .typeError('Cabinet Identifier must be supplied or a numeric value')
    .required("Cabinet Identifier must be supplied")
    .positive("Cabinet Identifier must be positive")
    .integer(),

    cabDepth: Yup.number()
    .typeError('Cabinet Depth must be supplied or a numeric value')
    .required("Cabinet Depth must be supplied")
    .positive("Cabinet Depth must be positive")
    .integer(),

    cabHeight: Yup.number()
    .typeError('Cabinet Height must be supplied or a numeric value')
    .required("Cabinet Height must be supplied")
    .positive("Cabinet Height must be positive")
    .integer(),

    cabWidth: Yup.number()
    .typeError('Cabinet Width must be supplied or a numeric value')
    .required("Cabinet Width must be supplied")
    .positive("Cabinet Width must be positive")
    .integer(),

    cabNomenclature: Yup.string()
    .min(1, "Nomenclature of a cabinet must be, at minimum, one character long")
    .max(255, "Nomenclature of a cabinet must be, at most, 255 characters in length")
    .required("Nomenclature of a cabinet must be supplied"),

    sectionCode: Yup.string()
    .min(1, "Section Code must be, at minimum, one character long")
    .max(255, "Section Code must be, at most, 255 characters in length")
    .required("Section Code must be supplied"),

    modelPath: Yup.mixed()
              .test("noFile", "Provide an OBJ file to upload", (value) => {
                return value.length > 0
              })
              .test("fileType", "Only OBJ file is acceptable", (value) => {
                    if (value.length > 0)
                    {
                        return supportedOBJRegex.test(value[0].name.toLowerCase());
                    }

                    return false
               })              
               .test("fileSize", "Given OBJ File must be at most 5MB", (value) => {
                    if (value.length > 0)
                    {
                        return value[0].size <= SUPPORTED_FILE_SIZE
                    }

                    return false
               }),

    photoPath: Yup.mixed()
                .test("noFile", "Please include a JPEG OR PNG file of your desired Cabinet Item", (value) => {
                    return value.length > 0
                })
                .test("fileType", "Only JPEG OR PNG files are acceptable", (value) => {
                    if (value.length > 0)
                    {
                        return SUPPORTED_IMG_FORMATS.includes(value[0].type)
                    }
                    
                    return false
                })
                .test("fileSize", "Given Image File must be at most 5MB", (value) => {
                    if (value.length > 0)
                    {
                        return value[0].size <= SUPPORTED_FILE_SIZE
                    }

                    return false
                }),

    isUpper: Yup.boolean().notRequired(),
    
    doorStyleSelection: Yup.string().required("Associated Door must be supplied!"),

    //ADD TEST FOR 3D OBJ FILE?????
})


export const DisplayErrorForDoorForm = Yup.object().shape({
    doorStyle: Yup.string()
    .required("Door style must be supplied"),

    modelPath: Yup.mixed()
    .test("noFile", "Provide an OBJ file to upload", (value) => {
        return value.length > 0
      })
      .test("fileType", "Only OBJ file is acceptable", (value) => {
            if (value.length > 0)
            {
                return supportedOBJRegex.test(value[0].name.toLowerCase());
            }

            return false
       })              
       .test("fileSize", "Given OBJ File must be at most 5MB", (value) => {
            if (value.length > 0)
            {
                return value[0].size <= SUPPORTED_FILE_SIZE
            }

            return false
       }),
    
    photoPath: Yup.mixed()                
    .test("noFile", "Please include a JPEG OR PNG file of your desired Cabinet Item", (value) => {
        return value.length > 0
    })
    .test("fileType", "Only JPEG OR PNG files are acceptable", (value) => {
        if (value.length > 0)
        {
            return SUPPORTED_IMG_FORMATS.includes(value[0].type)
        }
        
        return false
    })
    .test("fileSize", "Given Image File must be at most 5MB", (value) => {
        if (value.length > 0)
        {
            return value[0].size <= SUPPORTED_FILE_SIZE
        }

        return false
    }),
});

export const DisplayErrorForStyleForm = Yup.object().shape({
    databaseName: Yup.string()
    .required("Database Name must be supplied")
    .min(1, "Database Name must be, at minimum, one character long")
    .max(255, "Database Name must be, at most, 255 characters in length"),

    styleName: Yup.string()
    .required("Door style name must be supplied")
    .min(1, "Door Style Name must be, at minimum, one character long")
    .max(255, "Door style name must be, at most, 255 characters in length"),

    insideEdge: Yup.string()
    .max(255, "Inside Edge must be, at most, 255 characters in length"), 

    material: Yup.string()
    .max(255, "Material must be, at most, 255 characters in length"),

    outsideEdge: Yup.string()
    .max(255, "Outside Edge must be, at most, 255 characters in length"),

    raisedPanel: Yup.string()
    .max(255, "Raised panel must be, at most, 255 characters in length"),

    routePattern: Yup.string()
    .max(255, "Raised panel must be, at most, 255 characters in length")

});
