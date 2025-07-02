// =================================================================
//                      DATABASE SEEDER
// =================================================================
// File: seed.js
// Description: Populates the database with the initial mess menu.
// Usage: node seed.js
// =================================================================

const { MenuItem, sequelize } = require('../config/database');

// Mess menu data based on your input
const menuItems = [
    // Monday
    { day_of_week: 'Monday', meal_type: 'Breakfast', description: 'Poha – Jalebi , Bounvita, Bread, Butter, Jam, Milk', price: 50.00 },
    { day_of_week: 'Monday', meal_type: 'Lunch', description: 'Plain Rice, Dhuli moong Dal, Parwal ki Sabji, Kadhi, Dahi, Roti', price: 70.00 },
    { day_of_week: 'Monday', meal_type: 'Dinner', description: 'Chola+ Bhatura / Dal parantha +Aloo Sabji, Chutney (Imly) [Optional: (Plain Rice, Malka Musur Dal, Mixed Veg)]', price: 80.00 },
    // Tuesday
    { day_of_week: 'Tuesday', meal_type: 'Breakfast', description: 'Bara, Sambhar/ Idli, Sambhar, Chutney, Bounvita, Bread, Butter, Jam, Milk', price: 50.00 },
    { day_of_week: 'Tuesday', meal_type: 'Lunch', description: 'Plain Rice, Arhar Dal, Moong Aloo Sabji, Dahi, Roti, Matha', price: 70.00 },
    { day_of_week: 'Tuesday', meal_type: 'Dinner', description: 'Veg Fried Rice, Plain Rice, Soyabin,Aloo French Fries, Chana Dal, Boondi Raita, Roti/Sweet (Paneer Patties)', price: 80.00 },
    // Wednesday
    { day_of_week: 'Wednesday', meal_type: 'Breakfast', description: 'Paav Bhaji / Bread Cutlet, Saus Chutney, Bounvita, Bread, Butter, Jam, Milk', price: 50.00 },
    { day_of_week: 'Wednesday', meal_type: 'Lunch', description: 'Plain Rice, Malka Musur Dal, Bhindi-Pyaaz Sabji, Dahi, Fruit, Roti', price: 70.00 },
    { day_of_week: 'Wednesday', meal_type: 'Dinner', description: 'Jeera Rice, Plain Rice, Roti, Pyazz Mirchi Pakora, Dhuli Moong Dal, Chutney (Imly)/Chicken (curry)/ Butter Chicken', price: 80.00 },
    // Thursday
    { day_of_week: 'Thursday', meal_type: 'Breakfast', description: 'Puri Sabji / Channa, Halwa, Bounvita, Bread, Butter, Jam, Milk', price: 50.00 },
    { day_of_week: 'Thursday', meal_type: 'Lunch', description: 'Plain Rice, Curd Rice, Arhar Dal, Ghuiya Fry Roti, Dahi, Matha', price: 70.00 },
    { day_of_week: 'Thursday', meal_type: 'Dinner', description: 'Naan, Paneer Tikka, Pulao, Dum aloo, Sweet( Rasgulla) ;Or Paneer Bhujiya, Jeera Puri,Kachuri, Veg Fried Rice, Dum aloo, Kheer', price: 80.00 },
    // Friday
    { day_of_week: 'Friday', meal_type: 'Breakfast', description: 'Vegetable Sandwich/ Bombay-Toast, Fruit, Bounvita, Bread, Butter, Jam, Milk', price: 50.00 },
    { day_of_week: 'Friday', meal_type: 'Lunch', description: 'Plain Rice, Lemon Rice, Sambhar, Malka Musur Dal,Taroai ki Sabji, Dahi, Roti, Rooafza', price: 70.00 },
    { day_of_week: 'Friday', meal_type: 'Dinner', description: 'Plain Rice, Dal Makhani, Bhindi-Pyaaz Sabji, Rasam, Roti, Custard/Egg Curry', price: 80.00 },
    // Saturday
    { day_of_week: 'Saturday', meal_type: 'Breakfast', description: 'Pyaaz-paneer parantha, Corn Flakes, Imli Chutney, Dahi, Bounvita, Bread, Butter, Jam, Milk', price: 50.00 },
    { day_of_week: 'Saturday', meal_type: 'Lunch', description: 'Plain Rice, Rajma Dal, Dahi Wada, Aloo Karela, Roti, Dahi', price: 70.00 },
    { day_of_week: 'Saturday', meal_type: 'Dinner', description: 'Veg Fried Rice, Plain Rice, Roti, Malai Kofta, Jalfarezi, Rasam/Fish', price: 80.00 },
    // Sunday
    { day_of_week: 'Sunday', meal_type: 'Breakfast', description: 'Dosa / Uttapam (tomato + Pyazz), Sambhar, Chutney, Bounvita, Bread, Butter, Jam, Milk', price: 50.00 },
    { day_of_week: 'Sunday', meal_type: 'Lunch', description: 'Taheri, Plain Rice, Matar Paneer, Papad, Madrashi Aloo, Boondi Raita, Dahi, Roti Ice-cream (Special)', price: 70.00 },
    { day_of_week: 'Sunday', meal_type: 'Dinner', description: 'Chowmin Rice, Plain Rice, Roti, Chilkewali Moong Dal, Stuffed Capsicum, Kheera Raita/Mutton Curry', price: 80.00 },
];

const seedDatabase = async () => {
    try {
        console.log('Connecting to the database...');
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        console.log('Syncing models...');
        await sequelize.sync({ force: true }); // { force: true } will drop tables if they exist
        console.log('All models were synchronized successfully.');
        
        console.log('Seeding menu items...');
        await MenuItem.bulkCreate(menuItems);
        console.log(`Successfully seeded ${menuItems.length} menu items.`);

    } catch (error) {
        console.error('Unable to seed the database:', error);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
};

seedDatabase();

