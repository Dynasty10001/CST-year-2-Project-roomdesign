import DoorTemplate from "../Models/DoorTemplate"
import { Door } from "./Door"
import CabinetTemplate from "../Models/CabinetTemplate";
import Validator from "neode/build/Services/Validator";
import Model from "neode/build/Model";

export class Cabinet {
    constructor() { }
    getDoorOffset() {
        return this.doorOffset
    }
}

/**
 * This method will return a cabinet object with it's door as it's own object
 * inside the attributes of the Cabinet object
 */
export async function cabinetBuilder(cabinet, door) {
    try {
        await Validator(null, new Model(null, 'Cabinet',  CabinetTemplate), cabinet)
    } catch (err) {
        console.error(err.message)
        throw new Error("Bad Cabinet Data");
    }

    try {
        await Validator(null, new Model(null, 'Door', DoorTemplate), door)
    } catch (err) {
        console.error(err)
        throw new Error("Bad Door Data");
    }

    door._label = ['Door']
    cabinet.id = cabinet._id

    delete cabinet._id
    delete cabinet.node
    delete door._id
    delete cabinet.node

    door.position = [cabinet.posx, cabinet.posy, cabinet.posz]
    door.rotation = [cabinet.rotx, cabinet.roty, cabinet.rotz]
    let cab = Object.assign(new Cabinet(), cabinet)
    if (cab.attributes === undefined) {
        cab.attributes = {}
    }
    cab.attributes.door = Object.assign(new Door(), { ...door })
    return cab
}
