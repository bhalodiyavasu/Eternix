const express = require("express");
const { addToCart, getCart, updateCartItem, removeFromCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.patch("/", protect, updateCartItem);
router.delete("/", protect, removeFromCart);

module.exports = router;