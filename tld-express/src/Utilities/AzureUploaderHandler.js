//IMPORT THESE REQUIRED STUFF FROM @AZURE/STORAGE:
//  BlobServiceClient
import { BlobServiceClient } from "@azure/storage-blob";


// NOTE: FOR THOSE WHO WANTS TO TACKLE THIS AzureUploaderHandler to work with your Azure account, follow this guide:
//  https://learn.microsoft.com/en-us/azure/developer/javascript/tutorial/browser-file-upload-azure-storage-blob?tabs=typescript%2Cuser-delegated-sas
// https://github.com/Azure-Samples/ts-e2e-browser-file-upload-storage-blob/blob/main/src/azure-storage-blob.ts

// On that note, I can't emphasize how important to set your container's public access level to "Container" and your CORS!


// Note: These variables might be changed along the way if there's any changes that me and Cody needed for the Azure Blob Storage to work correctly :)
//const sasToken = "?sv=2021-12-02&ss=b&srt=co&sp=wlctf&se=2023-05-01T07:58:10Z&st=2023-03-15T23:58:10Z&spr=https&sig=YnI%2FbWBLcAtuG76fR9PzN2TP1KIT4K8vso%2BWb5db%2FZg%3D"
//const storageAccountName = "tldexpress"
const sasToken = process.env.REACT_APP_AZURE_STORAGE_SAS_TOKEN
const storageAccountName = process.env.REACT_APP_AZURE_STORAGE_RESOURCE_NAME

//DIFFERENTIATING BETWEEN TWO CONTAINERS
const photoContainerName = "uploaded-cab-door-photo-assets";
const objContainerName = "uploaded-cab-door-obj-assets";

//GET A UPLOAD URL
const azUploadURL = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;

//FOR TWO DIFFERENT CONTAINERS
const photoBlobService = new BlobServiceClient(azUploadURL);
const objBlobService = new BlobServiceClient(azUploadURL);

const photoContainerClient = photoBlobService.getContainerClient(photoContainerName);
const objContainerClient = objBlobService.getContainerClient(objContainerName)


/**
 * This function allows us:
 * - Get the files from the users by itself (photo or cabinet, NOT BOTH though)
 * - Push those file by using the uploadData(file, options)
 * - and after it is done, return an object that is based on this structure
 *   {
 *      blobURL: <URL link>
 *   }
 *  How? We call _retriveSpecificBlobURL to iterate a list of blobs and only get the required blob needed and paste it there
 * 
 * 
 *  MAKE SURE IT IS ASYNC!
 */
export async function uploadAssetToContainer(file)
{
    // LOGIC GOES HERE
    // to keep file names unique, we will need to check if the name already exists , if it does, filetype + counter until unique

    let uploadedFiles = {}


    for (const indFile of file)
    {
        if (indFile.type === "image/png" || indFile.type === "image/jpeg")
        {
            const photoBlobClient = photoContainerClient.getBlockBlobClient(indFile.name);
            await photoBlobClient.uploadData(indFile);
            uploadedFiles.photoPath = `https://${storageAccountName}.blob.core.windows.net/${photoContainerName}/${indFile.name}`
            
        }

        else
        {
            const objBlobClient = objContainerClient.getBlockBlobClient(indFile.name);
            await objBlobClient.uploadData(indFile);
            uploadedFiles.modelPath = `https://${storageAccountName}.blob.core.windows.net/${objContainerName}/${indFile.name}`
        }
    }

    return uploadedFiles;
}