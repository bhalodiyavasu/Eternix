const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({ status: "FAILURE", message: "All fields are required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, size, color }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.size === size &&
          item.color.hex === color.hex
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, size, color });
      }

      await cart.save();
    }

    res.status(200).json({ status: "SUCCESS", message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ status: "FAILURE", message: "Cart not found" });
    }

    let subtotal = 0;
    if (cart.items) {
      cart.items.forEach(item => {
        if (item.product && typeof item.product.price === 'number') {
          subtotal += item.product.price * item.quantity;
        }
      });
    }

    const shippingCharge = 0;
    const cartTotal = subtotal + shippingCharge;

    const cartObj = cart.toObject();
    cartObj.subtotal = subtotal;
    cartObj.shippingCharge = shippingCharge;
    cartObj.cartTotal = cartTotal;

    res.status(200).json({
      status: "SUCCESS",
      cart: cartObj,
      subtotal,
      shippingCharge,
      cartTotal
    });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ status: "FAILURE", message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color.hex === color.hex
    );

    if (!item) {
      return res.status(404).json({ status: "FAILURE", message: "Item not found in cart" });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({ status: "SUCCESS", message: "Quantity updated", cart });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ status: "FAILURE", message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size === size &&
          item.color.hex === color.hex
        )
    );

    await cart.save();

    res.status(200).json({ status: "SUCCESS", message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart };