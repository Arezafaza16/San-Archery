import { ID, ImageGravity, Query } from "appwrite";
import { account, appwriteConfig, databases, storage } from "./config.js";

export async function getAllPackage() {
    try {
        const packages = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.packageId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        );

        if (!packages) throw Error;

        return packages;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProducts(searchTerm = '') {
    try {
        const queries = [Query.orderAsc('$createdAt'), Query.limit(20)];

        if (searchTerm) {
            queries.push(Query.search('name', searchTerm)); // Menambahkan kondisi pencarian
        }

        const products = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            queries
        );

        if (!products) throw new Error('Failed to fetch products');

        return products;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllComments() {
    try {
        const comments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.comentId,
            [Query.orderAsc('$createdAt'), Query.limit(20)]
        );

        if (!comments) throw Error;

        return comments;
    } catch (error) {
        console.log(error);
    }
}

export async function createComment(comment) {
    try {
        const newComment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.comentId,
            ID.unique(),
            {
                name: comment.name,
                caption: comment.caption
            }
        );
        console.log("halo", newComment);

        if (!newComment) throw Error;

        return newComment;
    } catch (error) {
        console.log(error);
    }
}

export async function saveOrder(customerData, cartItems) {
    try {
        console.log('Saving order with customerData:', customerData);
        console.log('Saving order with cartItems:', cartItems);

        // Simpan data customer
        const customer = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.customerCollectionId,
            ID.unique(),
            {
                name: customerData.name,
                email: customerData.email,
                phoneNumber: customerData.phoneNumber,
                address: customerData.address,
                shippingOption: customerData.shippingOption
            }
        );


        // Simpan data pesanan
        for (const item of cartItems) {
            try {
                const order = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.orderCollectionId, // Ganti dengan ID koleksi OrderedList Anda
                    ID.unique(),
                    {
                        customer: customer.$id, // Menyimpan ID customer sebagai creator
                        product: item.product,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice
                    }
                );
                console.log(order, "ini ordernya");
            } catch (orderError) {
                console.error('Error saving order item:', orderError);
            }
        }

        console.log('Order saved successfully');
    } catch (error) {
        console.error('Error saving order:', error);
        throw error;
    }
}


export async function getAllCustomer() {
    try {
        const customers = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.customerCollectionId,
            [Query.orderAsc('$createdAt'), Query.limit(20)]
        );
        if (!customers) throw Error;

        return customers;
    } catch (error) {
        console.log(error);
    }
}

export async function getOrderByCustomerId(customerId) {
    try {
        console.log('Fetching order with customer ID:', customerId); // Tambahkan log ID
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.orderCollectionId,
            [Query.equal('customer', customerId)]
        );
        // console.log('Fetched orders:', response.documents); // Tambahkan log data order
        return response.documents;
    } catch (error) {
        console.error('Error fetching order by customer ID:', error);
        throw error;
    }
}

export async function getAllProductsAdmin() {
    try {
        const products = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        );
        return products;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100
        );

        return fileUrl
    } catch (error) {
        console.log(error);

    }
}

export async function deleteFile(fileId) {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
}

export async function createProduct(product) {
    try {
        const uploadedFile = await uploadFile(product.file[0]);

        if (!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            deleteFile(uploadedFile.$id)
            throw Error
        }
        const newProduct = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            ID.unique(),
            {
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: fileUrl
            }
        );

        if (!newProduct) {
            await deleteFile(uploadedFile.$id)
            throw Error
        };

        return newProduct;
    } catch (error) {
        console.log(error);
    }
}

export async function updateProduct(product) {
    const hasFileToUpdate = product.file.length > 0;
    try {
        let image = {
            imageUrl: product.imageUrl
        };
        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(product.file[0]);
            const fileUrl = getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw new Error("Failed to get file URL");
            }
            image = { ...image, imageUrl: fileUrl };
        }
        const updatedProduct = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            product.productId,
            {
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: image.imageUrl
            }
        );
        return updatedProduct;
    } catch (error) {
        console.log(error);
        throw error; // Tambahkan throw error untuk menangani error di tempat lain
    }
}

export async function getProductById(productId) {
    try {
        const product = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            productId
        );
        return product;
    } catch (error) {
        console.log(error);

    }
}

export async function deleteProduct(productId) {
    await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.productId, productId);
}

export async function findUser(email) {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('email', email)]
        )
        return response
    } catch (error) {
        console.log(error);
    }
}

export async function updateOrder(orderId, status) {
    await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.orderCollectionId, orderId, {
        status: status
    });
}