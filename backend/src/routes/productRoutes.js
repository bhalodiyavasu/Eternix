const express = require("express");
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/", protect, upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.patch("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;