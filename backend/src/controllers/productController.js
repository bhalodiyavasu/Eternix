const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const createProduct = async (req, res) => {
  try {
    const { name, price, category, gender, status, description, sizes, colors } = req.body;

    if (!name || !price || !category || !gender || !status || !description) {
      return res.status(400).json({ status: "FAILURE", message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ status: "FAILURE", message: "Product image is required" });
    }

    const parsedSizes = JSON.parse(sizes || "[]");
    const parsedColors = JSON.parse(colors || "[]");

    if (parsedSizes.length === 0 || parsedColors.length === 0) {
      return res.status(400).json({ status: "FAILURE", message: "Size and Color are required" });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "eternix/products",
        format: "webp",
        quality: "auto",
      }
    );

    // Step 4 — DB ma save karo
    const product = await Product.create({
      name,
      price,
      category,
      gender,
      status,
      description,
      sizes: parsedSizes,
      colors: parsedColors,
      image: result.secure_url,
    });

    res.status(201).json({
      status: "SUCCESS",
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      status: "SUCCESS",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: "FAILURE", message: "Product not found" });
    }

    res.status(200).json({
      status: "SUCCESS",
      product,
    });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: "FAILURE", message: "Product not found" });
    }

    const { name, price, category, gender, status, description, sizes, colors } = req.body;

    const parsedSizes = sizes ? JSON.parse(sizes) : product.sizes;
    const parsedColors = colors ? JSON.parse(colors) : product.colors;

    if (parsedSizes.length === 0 || parsedColors.length === 0) {
      return res.status(400).json({ status: "FAILURE", message: "Size and Color are required" });
    }

    let imageUrl = product.image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "eternix/products",
          format: "webp",
          quality: "auto",
        }
      );
      imageUrl = result.secure_url;
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.gender = gender || product.gender;
    product.status = status || product.status;
    product.description = description || product.description;
    product.sizes = parsedSizes;
    product.colors = parsedColors;
    product.image = imageUrl;

    const updatedProduct = await product.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ status: "FAILURE", message: "Product not found" });
    }

    // Delete image from Cloudinary
    if (product.image) {
      const urlParts = product.image.split("/upload/");
      if (urlParts.length === 2) {
        const pathWithoutVersion = urlParts[1].replace(/^v\d+\//, "");
        const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, "");
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await product.deleteOne();

    res.status(200).json({
      status: "SUCCESS",
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };