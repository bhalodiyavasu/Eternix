const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if(!name || !email || !password) {
      return res.status(400).json({ status: "FAILURE", message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "FAILURE", message: "Email already exist" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      name,
      email, 
      password: hashedPassword,
    });

    res.status(201).json({
      status: "SUCCESS",
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

module.exports = { registerUser };