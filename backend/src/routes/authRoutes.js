const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected route — for test
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    status: "SUCCESS",
    user: req.user,
  });
});

module.exports = router;