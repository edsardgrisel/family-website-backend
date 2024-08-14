const bcrypt = require('bcrypt');
const presetPassword = '';

bcrypt.hash(presetPassword, 10, (err, hash) => {
    if (err) throw err;
    console.log(`Hashed Password: ${hash}`);
});
