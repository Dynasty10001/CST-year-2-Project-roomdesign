import { cloneDeep } from "lodash";
import { Box3 } from "three";
import Cabinet, { adjustY } from "../../Components/Shared/Models/Cabinet";
import { mockedCabinetList, testCabUpper, testCabNotCollided } from "../mocks";
import {describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it} from '@jest/globals';
import { configure, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import GetMeshFromPath from "../../Components/Shared/Models/GetMeshFromPath";

jest.mock('three/src/loaders/TextureLoader', () => ({
    TextureLoader: 0
}));

jest.mock('three/examples/jsm/loaders/OBJLoader', () => ({
    OBJLoader: 0
}))

jest.mock('../../Components/Shared/Models/GetMeshFromPath')

//used a different testing id due to the '-' breaking the id
configure({testIdAttribute: 'datatestid'})

it("should throw an error if the cabinet model is not found",() =>{
  let mockCabNoModel = cloneDeep(testCabNotCollided)
  let mockCabNotObjModel = cloneDeep(testCabNotCollided)
  mockCabNotObjModel.modelPath = "noModel.txt"
  delete mockCabNoModel.modelPath

  try{
    let res = new Cabinet({cabData: mockCabNoModel })
    // if creating a cabinet does not throw and error make sure it does
    expect(true).toEqual(false)
  } 
  catch (e){
    // if error is result of expect true to be false message will not be equal
    expect(e.message).toEqual('Model Path is not defined')
  }

  try{
    let res = new Cabinet({cabData: mockCabNotObjModel })
    // if creating a cabinet does not throw and error make sure it does
    expect(true).toEqual(false)
  } catch (e){
    // if error is result of expect true to be false message will not be equal
    expect(e.message).toEqual('Model Path is not an obj file')
  }

})

describe("Cabinet Component", ()=>{

  const MOCK_CAB_REF = {
    current: {
      size:{
        height:0,
        width:0,
        length:0
      },
      rotation: {
        x:0,
        y:0,
        z:0
      },
      position: {
        x:0,
        y:0,
        z:0
      },
    }
  }
  const mockBox = {
    max: {
      y: 12
    },
    min: {
      y: 10
    },

    setFromObject: jest.fn()
  }

  describe("cabinetCreation",()=>{

    it("should create a cabinet",()=>{
      

      let cabData = cloneDeep(testCabNotCollided)
      // let res = new Cabinet({cabData: mockCabNoModel })
      const test = render(<Cabinet cabData={cabData}/>)
      // if creating a cabinet does not throw and error make sure it does
      // console.log(test)
      expect(screen.getByTestId('cabinetGroup')).toBeInTheDocument()
      } 
    )

    it("should create an upper cabinet",()=>{
      

      let cabData = cloneDeep(testCabUpper)
      // let res = new Cabinet({cabData: mockCabNoModel })
      const test = render(<Cabinet cabData={cabData}/>)
      // if creating a cabinet does not throw and error make sure it does
      // console.log(test)
      expect(screen.getByTestId('cabinetGroup')).toBeInTheDocument()
      } 
    )

  })
  

 
  describe("adjustY(cabRef, cabData, box)", ()=>{
    let cabRef;
    let mockCabResult;
    let cabData;
    let box;
    beforeEach(()=>{
      cabRef = cloneDeep(MOCK_CAB_REF)
      mockCabResult = cloneDeep(MOCK_CAB_REF)
      cabData = cloneDeep(testCabUpper)
      box = cloneDeep(mockBox)
    })

    test("that adjustY changes uppercabRef's y position by offset",()=>{
      cabData.posy =  10
      cabData.isUpper = true
      // simplified wanted result of adjustY method for Upper Cabinets
      const res = -cabData.posy - (box.max.y- cabData.posy)
      adjustY(cabRef, cabData, box)
      expect(cabRef.current.position.y).toEqual(res)
    })

    test("that adjustY changes uppercabRef's y position by offset with bigger box",()=>{
      cabData.posy =  10.351
      box.max.y = 420.69
      cabData.isUpper = true
      // simplified wanted result of adjustY method for Upper Cabinets
      const res = -cabData.posy - (box.max.y- cabData.posy)
      adjustY(cabRef, cabData, box)
      expect(cabRef.current.position.y).toEqual(res)
    })

    test("that adjustY changes uppercabRef's y position by offset lower",()=>{
      cabData.posy =  0
      box.max.y = 16.72
      box.min.y = 8
      cabData.isUpper = false
      // simplified wanted result of adjustY method for Lower Cabinets
      const res = -box.min.y + cabData.posy
      adjustY(cabRef, cabData, box)
      expect(cabRef.current.position.y).toEqual(res)
    })

    test("that adjustY changes uppercabRef's y position by offset lower bigger box",()=>{
      cabData.posy =  5.4
      box.max.y = 139.33
      box.min.y = 57.2
      cabData.isUpper = false
      // simplified wanted result of adjustY method for Lower Cabinets
      const res = -box.min.y + cabData.posy
      adjustY(cabRef, cabData, box)
      expect(cabRef.current.position.y).toBeCloseTo(res,5)
    })
  });
})