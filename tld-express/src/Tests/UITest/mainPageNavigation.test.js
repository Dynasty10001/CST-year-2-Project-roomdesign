/**
 * TESTS GO HERE!
 */
import React, { Suspense, useMemo, forwardRef } from 'react'
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom'
import { describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it, toBeInTheDocument } from '@jest/globals'
import bruh from 'react-spring'
import TLDExpressLanding from '../../Components/Core/TLDExpressLanding'
import Room from '../../Components/Core/Room';
import UI from '../../Components/Core/UI'
import Neode from 'neode';

import * as CabinetDB from '../../Utilities/CabinetDB';
import * as RoomDB from '../../Utilities/RoomDB';
import TestRenderer from 'react-test-renderer';
import * as Wall from '../../Components/Core/Wall';
import { resolvedWallLookup } from '../mocks'

jest.mock('../../../node_modules/three/src/loaders/TextureLoader', () => ({
  TextureLoader: 0
}));

jest.mock('three/examples/jsm/loaders/OBJLoader', () => ({
  OBJLoader: 0
}))

jest.mock('../../Components/Core/CatalogUI.js')

jest.mock('../../Components/Core/AttributeMenu.js', () => () => {
  return <div data-testid="attribute-menu">asdf</div>
});

// TEMPORARY
window.prompt = jest.fn(() => 1)
jest.mock('Neode')


// jest.spyOn(Room, 'CheckWallRendering').mockResolvedValue({});

describe("Navigation Test", () => {

    //Mocking all the database calls
    // jest.spyOn(CabinetDB, 'updateCabinet').mockResolvedValue({ cab: "this is a cabinet i promise" });
    // jest.spyOn(CabinetDB, 'removeCabinetByID').mockResolvedValue({ cab: "this cabinet was removed" });
    // jest.spyOn(RoomDB, 'getAllWalls').mockResolvedValue(() => Promise.resolve());
    // jest.spyOn(RoomDB, 'addRoomAndWallsToDB').mockResolvedValueOnce(1);
    // jest.spyOn(RoomDB, 'QueryRoomFromDB').mockResolvedValue({ returnedValue: "This are Room and walls returned from the database" });
    // jest.spyOn(Wall, 'makeAllWalls').mockResolvedValue({WallArray: [123,234,444], roomID : 1 })

  afterEach(() => 
  {
    jest.clearAllTimers();
  })

  //PASSED
  test("Test to see the appropriate landing page when opening the web application ", async () => {
    jest.useFakeTimers();

    act(() => {
      render(<TLDExpressLanding />)
    });

    let GetStartedName;
    let buttonsOnScreen;

    jest.advanceTimersByTime(5000);

    await act(() => {
      //Render it and run the time by 5000ms to run the course of the entire splashscreen
      jest.advanceTimersByTime(5000);
    })

    await act(() => {
      GetStartedName = screen.getByTestId('get-started');
      buttonsOnScreen = screen.queryAllByRole('button')
    })

    expect(GetStartedName).toBeInTheDocument();

    //Make sure that we only have one button!
    expect(buttonsOnScreen).toHaveLength(1);
    jest.useRealTimers();
  })


  // Passed!
  // mock getAllWalls, updateCabinet from room , makeAllWalls from RoomLayout UI , removeCabinetByID, QueryRoomFromDB from UI
  test("Testing the flow from landing page to the rendering of the room (SQUARE - FULL FLOW)", async () => {

    jest.spyOn(Wall, 'makeAllWalls').mockResolvedValue({WallArray: [123,234,444,5252], roomID : 1337 })
    jest.spyOn(RoomDB, 'addRoomAndWallsToDB').mockResolvedValue(1337);
    jest.spyOn(RoomDB, 'getAllWalls').mockResolvedValue(resolvedWallLookup);

    //For the love of god, don't forget about this okay?!
    global.ResizeObserver = require('resize-observer-polyfill')

    let GetStartedName;

    jest.useFakeTimers();
    render(<TLDExpressLanding />)
    
    await act(() => {
      //Render it and run the time by 5000ms to run the course of the entire splashscreen
      jest.advanceTimersByTime(5000);
    })

    // Waits for this thing to show up!
    await waitFor(() => {
      GetStartedName = screen.getByTestId('get-started');
    })

    //Clicks the The Button
    await act(() => {
      user.click(GetStartedName)
    })

    //Check whether or not a div that contains the TLD Express selection should appear!
    await waitFor(() => {
      let TLDExpressSelection = screen.getByTestId('tld-express-selection');
      expect(TLDExpressSelection).not.toBeNull()
      expect(TLDExpressSelection).toBeInTheDocument();
    });

    //Now we query the buttons needed and use the useClick functionality of the fake button to be clicked!
    let RoomCreationButton = screen.getByTestId('create-room');

    await act(() => {
      user.click(RoomCreationButton);
    });

    // // Check whether or not a div that contains the Layout Modal should appear!
    await waitFor(() => {
      let ChooseLayoutModal = screen.getByTestId('room-layout-ui');
      expect(ChooseLayoutModal).not.toBeNull()
      expect(ChooseLayoutModal).toBeInTheDocument()  
    });

    // Now we render the square modal through clicking the square button
    let SquareLayoutButton = screen.getAllByText('SQUARE')[0];
    await act(() => {
      user.click(SquareLayoutButton);
    });

    //The square modal test id should appear! (DONT FORGET TO PUT TEST ID ON THOSE COMPONENT OKAY?)
    await waitFor(() => {
      let SquareLayoutDiv = screen.getByTestId('square-modal');
      expect(SquareLayoutDiv).not.toBeNull()
      expect(SquareLayoutDiv).toBeInTheDocument();
    });

    //Now, we get those the length field and the submit button
    let roomLength = 20;
    let LengthFormField = screen.getByRole('spinbutton');
    let submitButton = screen.getByRole('button', { name: /submit/i })

    await act(() => {
      user.type(LengthFormField, roomLength.toString());
      user.click(submitButton);
    });

    // //The room should be rendered! (PUT STUFF HERE)
    await waitFor(() => {
      let currentRoom = screen.getByTestId('currentRoom-UI')
      expect(currentRoom).not.toBeNull()
      expect(currentRoom).toBeInTheDocument();
    });

    let exportButton = screen.getByTestId('export-button')
    expect(exportButton).not.toBeNull()
    expect(exportButton).toBeInTheDocument();

    jest.useRealTimers();
  })


  test("Delete all button appears when there is atleast one cabinet in the entity list", async () => {

    let currentUI = TestRenderer.create(<UI Room={{state: {entityList: []}}}/>)
    let currentUIRoot= currentUI.root;

    let foundedButtons = currentUIRoot.findAllByType('button')

    //Make sure its only one for now!
    expect(foundedButtons.length).toEqual(1);
    expect(foundedButtons[0]['_fiber']['pendingProps']['data-testid']).toEqual('export-button')

    //Now let's change the entityList list :)
    await act(() => {
      currentUI.update(<UI Room={{state: {entityList: ["Hi wade"]}}}/>)
    });

    // Should be two now!
    foundedButtons = currentUIRoot.findAllByType('button')
    expect(foundedButtons.length).toEqual(2);
    expect(foundedButtons[0]['_fiber']['pendingProps']['data-testid']).toEqual('deleteAll-button')
    expect(foundedButtons[1]['_fiber']['pendingProps']['data-testid']).toEqual('export-button')

  })


  test("Delete all button disappears when there is no cabinet in the entity list", async () => {
    let currentUI = TestRenderer.create(<UI Room={{state: {entityList: []}}}/>)
    let currentUIRoot= currentUI.root;

    let foundedButtons = currentUIRoot.findAllByType('button')

    //Make sure its only one for now!
    expect(foundedButtons.length).toEqual(1);
    expect(foundedButtons[0]['_fiber']['pendingProps']['data-testid']).toEqual('export-button')

      //Now let's change the entityList list :)
      await act(() => {
        currentUI.update(<UI Room={{state: {entityList: ["Hi wade"]}}}/>)
      });

       // Should be two now!
      foundedButtons = currentUIRoot.findAllByType('button')
      expect(foundedButtons.length).toEqual(2);
      expect(foundedButtons[0]['_fiber']['pendingProps']['data-testid']).toEqual('deleteAll-button')
      expect(foundedButtons[1]['_fiber']['pendingProps']['data-testid']).toEqual('export-button')

      // This serves like a delete action
      await act(() => {
        currentUI.update(<UI Room={{state: {entityList: []}}}/>)
      });

      //Make sure its only one for now!
      foundedButtons = currentUIRoot.findAllByType('button')
      expect(foundedButtons.length).toEqual(1);
      expect(foundedButtons[0]['_fiber']['pendingProps']['data-testid']).toEqual('export-button')


  })

})


