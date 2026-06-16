const registerUser = (req, res) => {
    res.status(200).json({
      message: 'User registered successfully'
    });
}

module.exports = {registerUser};