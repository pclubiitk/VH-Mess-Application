// =================================================================
//                   PASSWORD HASH GENERATOR
// =================================================================
// File: generate-hash.js
// Description: A simple utility to generate a bcrypt hash for a password.
// Usage: node generate-hash.js yourpassword
// =================================================================

const bcrypt = require('bcrypt');
const saltRounds = 10; // The cost factor for hashing

// Get the password from command-line arguments
const password = process.argv[2];

if (!password) {
    console.error('Usage: node generate-hash.js <your_password_here>');
    process.exit(1);
}



// Generate the hash
bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error generating hash:', err);
        return;
    }
    console.log('Your secret password:', password);
    console.log('Your secure hash (copy this to your .env file):');
    console.log(hash);
});

