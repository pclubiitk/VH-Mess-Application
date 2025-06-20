// =================================================================
//                      COUPON TEST SCRIPT
// =================================================================
// File: test-coupons.js
// Description: Tests the coupon purchase workflow.
// Usage: node test-coupons.js
// =================================================================

const axios = require('axios');
const API_BASE_URL = 'http://localhost:3001/api';

// Sample data for the test
const customerData = {
    customerName: 'Rohan Sharma',
    customerEmail: 'rohan.sharma@example.com',
    customerPhone: '9876543210',
    selections: [
        { meal_date: '2025-06-23', meal_type: 'Lunch' }, // Monday Lunch
        { meal_date: '2025-06-24', meal_type: 'Dinner' }  // Tuesday Dinner
    ]
};

// Helper to print test results
const printResult = (testName, data) => {
    console.log(`\n--- ${testName} ---`);
    console.log(JSON.stringify(data, null, 2));
    console.log(`--- End of ${testName} ---\n`);
};

const runTests = async () => {
    try {
        // Test 1: Fetch the current menu to make sure the API is up
        console.log("Running Test 1: Fetching current menu...");
        const menuResponse = await axios.get(`${API_BASE_URL}/menu/current`);
        printResult('Menu Fetch Result', { status: menuResponse.status, items: menuResponse.data.menu.length });

        // Test 2: Initiate an order
        console.log("Running Test 2: Initiating a new order...");
        const initiateResponse = await axios.post(`${API_BASE_URL}/coupons/initiate-order`, customerData);
        const { order_id, totalAmount } = initiateResponse.data;
        printResult('Initiate Order Result', initiateResponse.data);

        if (!order_id) {
            throw new Error("Order initiation failed, no order_id received.");
        }

        // Test 3: Simulate a successful payment webhook
        console.log("Running Test 3: Simulating successful payment webhook...");
        const webhookPayload = {
            order_id: order_id,
            payment_id: `PAYMENT_${Date.now()}`,
            transaction_status: 'SUCCESS'
        };
        const webhookResponse = await axios.post(`${API_BASE_URL}/coupons/payment/webhook`, webhookPayload);
        printResult('Payment Webhook Result', { status: webhookResponse.status, data: webhookResponse.data });

        // Test 4: We will need a new endpoint to get the user's coupons to verify.
        // Let's assume we create it now.
        console.log("Running Test 4: Fetching user's active coupons...");
        // This endpoint doesn't exist yet, but we'll add it in the next step.
        // For now, this part of the test will fail until we build the endpoint.
        
        // const myCouponsResponse = await axios.get(`${API_BASE_URL}/coupons/my-coupons?phone=${customerData.customerPhone}`);
        // printResult("Fetch My Coupons Result", myCouponsResponse.data);

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


