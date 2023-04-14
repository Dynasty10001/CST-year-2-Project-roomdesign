//Imports go Here
import TestRenderer from 'react-test-renderer'
import React from 'react';
import { useForm } from "react-hook-form";
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom'
import { describe, beforeAll, beforeEach, afterAll, afterEach, expect, test, it, toBeInTheDocument } from '@jest/globals'
import { DisplayErrorForCabForm, DisplayErrorForDoorForm, DisplayErrorForStyleForm } from "../../Models/FormTemplate";
import { yupResolver } from '@hookform/resolvers/yup';

//Our components to import
import {AddStyleItemModal, AddDoorItemModal, AddCabItemModal} from '../../Components/Core/AddItemForm'
import { validCabTempThree, validDoorTempThree, validStyleInfoForm, mockDoorStyleList, mockStyleList } from '../mocks';
import { cloneDeep } from 'lodash';
import userEvent from '@testing-library/user-event';

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

  jest.mock('chakra-ui')

//Tests go here
describe("FORM VALIDATION TEST", () => {

    const mockOnSubmit = jest.fn();
    let fakeImage;
    let fakeObj;

    let valid255Letters = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    let invalid256Letters = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

    describe("FORM INPUT VALIDATION (CABINET SECTION)", () => {
        // FORM FIELDS
        let cabNameField;
        let cabIdentifierField;
        let cabDepthField;
        let cabHeightField;
        let cabWidthField;
        let cabNomenclatureField;
        let cabSectCodeField;
        let cabSubmitButton;
        let associatedDoorField
        let cab3dOBJ;
        let cabImage;

        let validCabValue;

        //Before each it runs, mock the onSubmit function then render the component THEN
        // it grabs those fields required.
        beforeEach(() => {

            function MockedCabForm(props) {
                const { register, handleSubmit, formState:{ errors }} = useForm({
                    resolver: yupResolver(DisplayErrorForCabForm),
                  });
              
                return ( <AddCabItemModal onSubmit={props.submitHandler} submitHandler={handleSubmit} errorList={errors} objRegister={register} doorStyleList={mockDoorStyleList} isLoading={false}/>);
            };

            fakeImage = new File(['cabbie'], 'cab_01.png', { type: 'image/png' });
            fakeObj = new File(['wow 3d object'], 'cab_01.obj', { type: 'application/object' });

            mockOnSubmit.mockClear();
            render(<MockedCabForm submitHandler={mockOnSubmit}/>);

            cabNameField = screen.getByRole('textbox', {name: /cabinet name:/i})
            cabIdentifierField = screen.getByRole('spinbutton', {name: /cabinet identifier:/i})
            cabDepthField = screen.getByRole('spinbutton', {name: /cabinet depth:/i})
            cabHeightField = screen.getByRole('spinbutton', {name: /cabinet height/i})
            cabWidthField = screen.getByRole('spinbutton', {name: /cabinet width:/i})
            cabNomenclatureField = screen.getByRole('textbox', { name: /cabinet nomenclature:/i });
            cabSectCodeField = screen.getByRole('textbox', { name: /cabinet section code:/i });
            cab3dOBJ = screen.getByLabelText(/cabinet 3d object: \*/i)
            cabImage = screen.getByLabelText(/cabinet image: \*/i)
            associatedDoorField = screen.getByRole('combobox', {name: /associated door:/i})
            cabSubmitButton = screen.getByRole('button', {name: /submit/i})
            validCabValue = cloneDeep(validCabTempThree);
        });



        test("Successful validation of a cabinet information in the form", async () => {
            // This is where it types in the valid values (including the files) in it.
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            // We should expect that this submitHandler has been called ONCE only!
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        test("Name of Cabinet should not be null / empty", async () => {

            await act( async () => {
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
               const error = screen.getByText(/Name of Cabinet must be, at minimum, one character long/i);
               expect(error).toBeInTheDocument()
            });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
            
        });

        // NEW STUFF
        test("Name of Cabinet should be 255 in size", async () => {
            await act( async () => {
                user.type(cabNameField, valid255Letters)
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            });
            
            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            // We should expect that this submitHandler has been called ONCE only!
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });


        test("Name of Cabinet should not be 256 in size", async () => {
            await act( async () => {
                user.type(cabNameField, invalid256Letters)
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            });
            
            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Name of the Cabinet must be, at most, 255 characters in length/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
            
        });
        
        test("Cabinet Identifier must be not null/empty", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Cabinet Identifier must be supplied or a numeric value/i);
                expect(error).toBeInTheDocument();
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Identifier must be a non-negative numerical value", async () => {
            await act( async () => {
                const negativeNumber = -1;

                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, negativeNumber.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })


            await waitFor(async () => {
                const error = screen.getByText(/Cabinet Identifier must be positive/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Depth must be not null or empty", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })


            await waitFor(async () => {
                const error = screen.getByText(/Cabinet Depth must be supplied or a numeric value/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Depth must be a positive numerical value", async () => {
            await act( async () => {
                const negativeNumber = -1;

                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, negativeNumber.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })


            await waitFor(async () => {
                const error = screen.getByText(/Cabinet Depth must be positive/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Height must be not null or empty", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Cabinet Height must be supplied or a numeric value/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Height must be a positive numerical value", async () => {
            await act( async () => {
                const negativeNumber = -1;

                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, negativeNumber.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Cabinet Height must be positive/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        
        test("Cabinet Width must be not null or empty", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Cabinet Width must be supplied or a numeric value/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Width must be a positive numerical value", async () => {
            await act( async () => {
                const negativeNumber = -1;

                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, negativeNumber.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Cabinet Width must be positive/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Nomenclature must be not null or empty", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })


            await waitFor(async () => {
                const error = screen.getByText(/Nomenclature of a cabinet must be, at minimum, one character long/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Nomenclature must be 255 characters", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, valid255Letters);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })


            // We should expect that this submitHandler has been called ONCE only!
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        test("Cabinet Nomenclature must be not 256 characters", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, invalid256Letters);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Nomenclature of a cabinet must be, at most, 255 characters in length/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Section Code must be not null or empty", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Section Code must be, at minimum, one character long/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Cabinet Section Code must be 255 characters", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, valid255Letters);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            // We should expect that this submitHandler has been called ONCE only!
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        test("Cabinet Section Code must be not 256 characters", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, invalid256Letters);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Section Code must be, at most, 255 characters in length/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);


        });
        
        test("Users should have provided a obj file to upload", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })



            await waitFor(async () => {
                const error = screen.getByText(/Provide an OBJ file to upload/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Users can only upload OBJ file to the uploader", async () => {
            const sussyFileOBJ = new File(['linux fard'], 'bryce-midterms-answer.txt', { type: 'text/plain' });
            
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, sussyFileOBJ);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })


            await waitFor(async () => {
                const error = screen.getByText(/Only OBJ file is acceptable/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Users can only upload 5MB of OBJ File", async () => {
            Object.defineProperty(fakeObj, 'size', { value: 1024 * 1024 * 5.5, configurable: true}) // 5.5MB in size
            
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ,fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })


            await waitFor(async () => {
                const error = screen.getByText(/Given OBJ File must be at most 5MB/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);

        });


        test("Users must upload a photo file", async () => {
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Please include a JPEG OR PNG file of your desired Cabinet Item/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Users can only upload a specific photo file (png, jpg) to the uploader", async () => {
            const sussyFileGIF = new File(['dancing cabinet with cats gangnam styling'], 'CAB_01.gif', { type: 'image/gif' });
            
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, sussyFileGIF);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })


            await waitFor(async () => {
                const error = screen.getByText(/Only JPEG OR PNG files are acceptable/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("Users must upload a photo file that is 5MB or under", async () => {
            Object.defineProperty(fakeImage, 'size', { value: 1024 * 1024 * 5.5, configurable: true}) // 5.5MB in size
            
            await act( async () => {
                user.type(cabNameField, validCabValue.cabName);
                user.type(cabIdentifierField, validCabValue.cabIdentifier.toString());
                user.type(cabDepthField, validCabValue.cabDepth.toString());
                user.type(cabHeightField, validCabValue.cabHeight.toString());
                user.type(cabWidthField, validCabValue.cabWidth.toString());
                user.type(cabNomenclatureField, validCabValue.cabNomenclature);
                user.type(cabSectCodeField, validCabValue.sectionCode);
                user.upload(cab3dOBJ, fakeObj);
                user.upload(cabImage, fakeImage);
                fireEvent.change(associatedDoorField, {target: {value: validCabValue.doorStyleSelection}})
            })

            await act (async () => {
                userEvent.click(cabSubmitButton);
            })



            await waitFor(async () => {
                const error = screen.getByText(/Given Image File must be at most 5MB/i);
                expect(error).toBeInTheDocument()
             });

             // We should expect that this submitHandler has been called NONE
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

    });


    describe("FORM INPUT VALIDATION (DOOR)", () => {
        let doorStyleField;
        let doorImageField;
        let door3dOBJ;
        let doorSubmitButton;

        let validDoorValue;

        beforeEach(()=> {
            function MockedDoor(props) {
                const { register, handleSubmit, formState:{ errors }} = useForm({
                    resolver: yupResolver(DisplayErrorForDoorForm),
                  });
              
                return ( <AddDoorItemModal onSubmit={props.submitHandler} submitHandler={handleSubmit} errorList={errors} objRegister={register} setFormHandler={jest.fn()} isLoading={false}  listStyle={mockStyleList}/>);
            };

            fakeImage = new File(['door'], 'door_01.png', { type: 'image/png' });
            fakeObj = new File(['wow 3d object'], 'door_01.obj', { type: 'application/object' });

            mockOnSubmit.mockClear();
            render(<MockedDoor submitHandler={mockOnSubmit}/>);

            doorStyleField = screen.getByRole('combobox', {name: /door style:/i})
            doorImageField = screen.getByLabelText(/door image:/i);
            door3dOBJ = screen.getByLabelText(/door 3d object:/i);
            doorSubmitButton = screen.getByRole('button', { name:/submit/i });

            validDoorValue = cloneDeep(validDoorTempThree);
        })

        test("Successful validation of valid door information", async () => {

            await act( async () => {
                fireEvent.change(doorStyleField, {target: {value: validDoorValue.doorStyleSelection}})
                user.upload(doorImageField, fakeImage);
                user.upload(door3dOBJ, fakeObj);
            });

            await act (async () => {
                userEvent.click(doorSubmitButton);
            })


            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        })

        test("DoorStyle must be not Null or Empty", async () => {
            await act( async () => {
                user.upload(doorImageField, fakeImage);
                user.upload(door3dOBJ, fakeObj);
            });

            await act (async () => {
                userEvent.click(doorSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Door style must be supplied/i);
                expect(error).toBeInTheDocument()
             });


            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        })

        test("User must upload an OBJ file of door", async () => {
            await act( async () => {
                fireEvent.change(doorStyleField, {target: {value: validDoorValue.doorStyleSelection}})
                user.upload(doorImageField, fakeImage);
            });

            await act (async () => {
                userEvent.click(doorSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Provide an OBJ file to upload/i);
                expect(error).toBeInTheDocument()
             });

            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        })

        test("Users can only upload an OBJ file of a door", async () => {
            const sussyFileOBJ = new File(['linux fard'], 'bryce-midterms-answer.txt', { type: 'text/plain' });

            await act( async () => {
                fireEvent.change(doorStyleField, {target: {value: validDoorValue.doorStyleSelection}})
                user.upload(doorImageField, fakeImage);
                user.upload(door3dOBJ, sussyFileOBJ);
            });

            await act (async () => {
                userEvent.click(doorSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Only OBJ file is acceptable/i);
                expect(error).toBeInTheDocument()
             });

            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        })

        test("Users can only upload 5MB of OBJ File of a door", async () => {
            Object.defineProperty(fakeObj, 'size', { value: 1024 * 1024 * 5.5, configurable: true}) // 5.5MB in size

            await act( async () => {
                fireEvent.change(doorStyleField, {target: {value: validDoorValue.doorStyleSelection}})
                user.upload(doorImageField, fakeImage);
                user.upload(door3dOBJ, fakeObj);
            });

            await act (async () => {
                userEvent.click(doorSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Given OBJ File must be at most 5MB/i);
                expect(error).toBeInTheDocument()
             });

            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        })

        test("Door Photo must be a PNG/JPEG file", async () => {
            const sussyFileGIF = new File(['dancing cabinet with cats gangnam styling'], 'DOOR_01.gif', { type: 'image/gif' });

            await act( async () => {
                fireEvent.change(doorStyleField, {target: {value: validDoorValue.doorStyleSelection}})
                user.upload(doorImageField, sussyFileGIF);
                user.upload(door3dOBJ, fakeObj);
            });

            await act (async () => {
                userEvent.click(doorSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Only JPEG OR PNG files are acceptable/i);
                expect(error).toBeInTheDocument()
             });

            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        })

        test("Users must uplaod a photo file", async () => {

            await act( async () => {
                fireEvent.change(doorStyleField, {target: {value: validDoorValue.doorStyleSelection}})
                user.upload(door3dOBJ, fakeObj);
            });

            await act (async () => {
                userEvent.click(doorSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Please include a JPEG OR PNG file of your desired Cabinet Item/i);
                expect(error).toBeInTheDocument()
             });

            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        })

        test("Users must uplod a photo file that is below 5MB", async () => {
            Object.defineProperty(fakeImage, 'size', { value: 1024 * 1024 * 5.5, configurable: true}) // 5.5MB in size

            await act( async () => {
                fireEvent.change(doorStyleField, {target: {value: validDoorValue.doorStyleSelection}})
                user.upload(doorImageField, fakeImage);
                user.upload(door3dOBJ, fakeObj);
            });

            await act (async () => {
                userEvent.click(doorSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Given Image File must be at most 5MB/i);
                expect(error).toBeInTheDocument()
             });

            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        })
    });

    describe("FORM INPUT VALIDATION (STYLE)" , () => {
        let styleNameField;
        let styleDBNameField;
        let styleInsideEdgeField;
        let styleOutsideEdgeField;
        let styleMaterialField;
        let styleRaisePanelField;
        let styleRoutePatternField;

        let styleSubmitButton;

        let validStyleInfo;

        beforeEach(()=> {


            function MockedStyle(props) {
                const { register, handleSubmit, formState:{ errors }} = useForm({
                    resolver: yupResolver(DisplayErrorForStyleForm),
                  });
              
                return ( <AddStyleItemModal onSubmit={props.submitHandler} submitHandler={handleSubmit} errorList={errors} objRegister={register} isLoading={false}/>);
            };

            mockOnSubmit.mockClear();
            render(<MockedStyle submitHandler={mockOnSubmit}/>);

            styleNameField = screen.getByRole('textbox', { name: /style name:/i });
            styleDBNameField = screen.getByRole('textbox', { name: /database name:/i });
            styleInsideEdgeField = screen.getByRole('textbox', { name: /inside edge:/i });
            styleOutsideEdgeField = screen.getByRole('textbox', { name: /outside edge:/i });
            styleMaterialField = screen.getByRole('textbox', { name: /material:/i });
            styleRaisePanelField = screen.getByRole('textbox', { name: /raised panel:/i });
            styleRoutePatternField = screen.getByRole('textbox', { name: /route pattern:/i });
            styleSubmitButton = screen.getByRole('button', { name:/submit/i });

            validStyleInfo = cloneDeep(validStyleInfoForm);

        });

        test("Successful validation of a valid style information form", async () => {
            
            await act( async () => {
                user.type(styleNameField, validStyleInfo.styleName);
                user.type(styleDBNameField, validStyleInfo.databaseName);
                user.type(styleMaterialField, validStyleInfo.material);
            });

            await act (async () => {
                userEvent.click(styleSubmitButton);
            })
            
            // We should expect that this submitHandler has been called ONCE only!
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        })

        test("The Style name must be not null/empty", async () => {
            await act( async () => {
                user.type(styleDBNameField, validStyleInfo.databaseName);
                user.type(styleMaterialField, validStyleInfo.material);
            });

            await act (async () => {
                userEvent.click(styleSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Door style name must be supplied/i);
                expect(error).toBeInTheDocument()
             });
            
            // We should expect that this submitHandler has been called ONCE only!
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        test("The Style name must be 255 characters", async () => {
            
            await act( async () => {
                user.type(styleNameField, valid255Letters);
                user.type(styleDBNameField, validStyleInfo.databaseName);
                user.type(styleMaterialField, validStyleInfo.material);
            });

            await act (async () => {
                userEvent.click(styleSubmitButton);
            })
            
            // We should expect that this submitHandler has been called ONCE only!
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        test("The Style name must be 256 characters", async () => {
            await act( async () => {
                user.type(styleNameField, invalid256Letters);
                user.type(styleDBNameField, validStyleInfo.databaseName);
                user.type(styleMaterialField, validStyleInfo.material);
            });

            await act (async () => {
                userEvent.click(styleSubmitButton);
            })

        
            await waitFor(async () => {
                const error = screen.getByText(/Door style name must be, at most, 255 characters in length/i);
                expect(error).toBeInTheDocument()
             });
            
            
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        });

        
        test("The Database Name must be not null/empty", async () => {
            await act( async () => {
                user.type(styleNameField, validStyleInfo.styleName);
                user.type(styleMaterialField, validStyleInfo.material);
            });

            await act (async () => {
                userEvent.click(styleSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Database Name must be supplied/i);
                expect(error).toBeInTheDocument()
             });
            
            // We should expect that this submitHandler has been called ONCE only!
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
        })

        test("Database name must be 255 character", async () => {
            await act( async () => {
                user.type(styleNameField, validStyleInfo.styleName);
                user.type(styleDBNameField, valid255Letters);
                user.type(styleMaterialField, validStyleInfo.material);
            });

            await act (async () => {
                userEvent.click(styleSubmitButton);
            })
            
            // We should expect that this submitHandler has been called ONCE only!
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        })

        test("The Database Name cannot be 256 characters", async () => {
            await act( async () => {
                user.type(styleNameField, validStyleInfo.styleName);
                user.type(styleDBNameField, invalid256Letters);
                user.type(styleMaterialField, validStyleInfo.material);
            });

            await act (async () => {
                userEvent.click(styleSubmitButton);
            })

            await waitFor(async () => {
                const error = screen.getByText(/Database Name must be, at most, 255 characters in length/i);
                expect(error).toBeInTheDocument()
             });
            
            
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);

        })

    });
});

