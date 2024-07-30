import { Account, Client, Databases, Storage } from 'appwrite';


export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    projectId: "668e68b20025521cefb1",
    databaseId: "668e766d0015ff41a2d6",
    customerCollectionId: "6692bca00009b7a5977d",
    orderCollectionId: "6692bdf4003580b4cfc5",
    packageId: "668e77c700259d9fe8fa",
    storageId: "668f4822000c532d1a12",
    productId: "668f47b900319da4469f",
    comentId: "669118a6002ea46a5b89",
    userCollectionId: "66923781003636cca524",
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);


export const databases = new Databases(client)
export const account = new Account(client)
export const storage = new Storage(client)
