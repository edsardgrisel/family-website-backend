const bcrypt = require('bcrypt');

exports.verifyPassword = async (req, res) => {
    const { password } = req.body;
    const hashedPassword = process.env.HASHED_PASSWORD;

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid password' });
    }
};
