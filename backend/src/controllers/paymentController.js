const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const CLIENT_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const calculateShipping = (subtotal) => {
  if (subtotal < 200) return 80;
  if (subtotal < 500) return 40;
  if (subtotal < 800) return 20;
  return 0;
};

const generateOrderNumber = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";

  // 1. Generate 3 random alphabets for the prefix
  let prefix = "";
  for (let i = 0; i < 3; i++) {
    prefix += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // 2. For the 5-char alphanumeric suffix, pick 3:2 or 2:3 ratio of letters:numbers randomly
  const ratioOption = Math.random() < 0.5 ? { l: 3, d: 2 } : { l: 2, d: 3 };

  let suffixChars = [];
  for (let i = 0; i < ratioOption.l; i++) {
    suffixChars.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }
  for (let i = 0; i < ratioOption.d; i++) {
    suffixChars.push(digits.charAt(Math.floor(Math.random() * digits.length)));
  }

  // Shuffle the suffix characters randomly
  for (let i = suffixChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [suffixChars[i], suffixChars[j]] = [suffixChars[j], suffixChars[i]];
  }

  return `${prefix}-${suffixChars.join("")}`;
};

const createOrderFromSession = async (session) => {
  const existing = await Order.findOne({ stripeSessionId: session.id });
  if (existing) return;

  const userId = session.metadata.userId;
  const contactInfo = JSON.parse(session.metadata.contactInfo);
  const shippingInfo = JSON.parse(session.metadata.shippingInfo);

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) return;

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCharge = calculateShipping(subtotal);

  // Generate unique order number
  let orderNumber;
  let isUnique = false;
  while (!isUnique) {
    orderNumber = generateOrderNumber();
    const existingOrder = await Order.findOne({ orderNumber });
    if (!existingOrder) {
      isUnique = true;
    }
  }

  await Order.create({
    user: userId,
    items: cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    })),
    contactInfo,
    shippingInfo,
    subtotal,
    shippingCharge,
    totalAmount: subtotal + shippingCharge,
    paymentStatus: "Paid",
    stripeSessionId: session.id,
    orderNumber,
    paymentId: session.payment_intent,
  });

  await Cart.findOneAndDelete({ user: userId });
};

// POST /api/payment/create-checkout-session
const createCheckoutSession = async (req, res) => {
  try {
    const { contactInfo, shippingInfo } = req.body;

    if (!contactInfo || !shippingInfo) {
      return res.status(400).json({ status: "FAILURE", message: "All fields are required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ status: "FAILURE", message: "Cart is empty" });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingCharge = calculateShipping(subtotal);

    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
          images: item.product.image ? [item.product.image] : [],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"],
      mode: "payment",
      line_items,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: Math.round(shippingCharge * 100), currency: "inr" },
            display_name: shippingCharge === 0 ? "Free Shipping" : "Standard Shipping",
          },
        },
      ],
      metadata: {
        userId: req.user._id.toString(),
        contactInfo: JSON.stringify(contactInfo),
        shippingInfo: JSON.stringify(shippingInfo),
      },
      success_url: `${CLIENT_URL}/payment-recipt?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/checkout`,
    });

    res.status(200).json({ status: "SUCCESS", url: session.url });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

// POST /api/payment/webhook
const stripeWebhook = async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    await createOrderFromSession(event.data.object).catch(console.error);
  }

  res.status(200).json({ received: true });
};

// GET /api/payment/verify-session/:sessionId
const verifySession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    if (session.payment_status !== "paid") {
      return res.status(200).json({ status: "SUCCESS", paid: false });
    }

    await createOrderFromSession(session).catch(console.error);

    const order = await Order.findOne({ stripeSessionId: session.id }).populate("items.product");
    res.status(200).json({ status: "SUCCESS", paid: true, order });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

module.exports = { createCheckoutSession, stripeWebhook, verifySession };
