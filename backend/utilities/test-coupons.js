const axios = require('axios');
const API_BASE_URL = 'http://localhost:3001/api';

const customerData = {
    customerName: 'Rohan Sharma',
    customerEmail: 'rohan.sharma@example.com',
    customerPhone: '9876543210',
    selections: [
        { meal_date: '2025-06-23', meal_type: 'Lunch' }, // Monday Lunch
        { meal_date: '2025-06-24', meal_type: 'Dinner' }  // Tuesday Dinner
    ]
};

const printResult = (testName, data) => {
    console.log(`\n--- ${testName} ---`);
    console.log(JSON.stringify(data, null, 2));
    console.log(`--- End of ${testName} ---\n`);
};

const runTests = async () => {
    try {
        console.log("Running Test 1: Fetching current menu...");
        const menuResponse = await axios.get(`${API_BASE_URL}/menu/current`);
        printResult('Menu Fetch Result', { status: menuResponse.status, items: menuResponse.data.menu.length });

        console.log("Running Test 2: Initiating a new order...");
        const initiateResponse = await axios.post(`${API_BASE_URL}/coupons/initiate-order`, customerData);
        const { order_id, totalAmount } = initiateResponse.data;
        printResult('Initiate Order Result', initiateResponse.data);

        if (!order_id) {
            throw new Error("Order initiation failed, no order_id received.");
        }

        console.log("Running Test 3: Simulating successful payment webhook...");
        const webhookPayload = {
            order_id: order_id,
            payment_id: `PAYMENT_${Date.now()}`,
            transaction_status: 'SUCCESS'
        };
        const webhookResponse = await axios.post(`${API_BASE_URL}/coupons/payment/webhook`, webhookPayload);
        printResult('Payment Webhook Result', { status: webhookResponse.status, data: webhookResponse.data });

        console.log("Running Test 4: Fetching user's active coupons...");
        console.log("\n✅ All tests passed (except fetching user coupons, which is not built yet).");

    } catch (error) {
        console.error("\n❌ A test failed!");
        if (error.response) {
            console.error('Error Response:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Message:', error.message);
        }
    }
};

runTests();


