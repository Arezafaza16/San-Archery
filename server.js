import express from 'express';
import midtransClient from 'midtrans-client';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { saveOrder } from './src/appwrite/api.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Endpoint untuk membuat transaksi Midtrans
app.post('/create-transaction', async (req, res) => {
    const { customerData, cartItems } = req.body;

    // Buat instance Midtrans Snap
    let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.VITE_MIDTRANS_SERVER_KEY,
        clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY
    });

    // Buat parameter transaksi
    let totalItemAmount = cartItems.reduce((acc, item) => {
        return acc + (item.totalPrice * item.quantity);
    }, 0);

    let parameter = {
        transaction_details: {
            order_id: `order-${Date.now()}`,
            gross_amount: totalItemAmount
        },
        customer_details: {
            first_name: customerData.name,
            email: customerData.email,
            phone: customerData.phoneNumber,
            address: customerData.address
        },
        item_details: cartItems.map(item => ({
            id: item.product,
            price: item.totalPrice,
            quantity: item.quantity,
            name: item.product
        }))
    };

    try {
        const transaction = await snap.createTransaction(parameter);
        console.log('Transaction created:', transaction.token, "kontolllll");

        await saveOrder(customerData, cartItems, transaction.token);
        res.json({ token: transaction.token });
    } catch (error) {
        console.log(error, "ini error");
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});