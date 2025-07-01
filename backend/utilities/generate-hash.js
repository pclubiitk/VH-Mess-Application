const bcrypt = require('bcrypt');
const saltRounds = 10; 

const password = process.argv[2];

if (!password) {
    console.error('Usage: node generate-hash.js <your_password_here>');
    process.exit(1);
}



bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error generating hash:', err);
        return;
    }
    console.log('Your secret password:', password);
    console.log('Your secure hash (copy this to your .env file):');
    console.log(hash);
});

