const Order = require("../models/Order");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const { generateReceiptHTML } = require("../templates/receiptTemplate");

async function launchBrowser() {
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "SUCCESS", count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

const downloadReceipt = async (req, res) => {
  let browser;
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id }).populate("items.product");

    if (!order) {
      return res.status(404).json({ status: "FAILURE", message: "Order not found" });
    }

    const html = generateReceiptHTML(order);

    browser = await launchBrowser();

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "15mm", right: "15mm" },
    });

    await browser.close();
    browser = null;

    const filename = `Eternix_Receipt_${(order.orderNumber || order._id).toUpperCase()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

const downloadReceiptBySession = async (req, res) => {
  let browser;
  try {
    const order = await Order.findOne({ stripeSessionId: req.params.sessionId }).populate("items.product");

    if (!order) {
      return res.status(404).json({ status: "FAILURE", message: "Order not found" });
    }

    const html = generateReceiptHTML(order);

    browser = await launchBrowser();

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "15mm", right: "15mm" },
    });

    await browser.close();
    browser = null;

    const filename = `Eternix_Receipt_${String(order.orderNumber || order._id).toUpperCase()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ status: "FAILURE", message: error.message });
  }
};

module.exports = { getMyOrders, downloadReceipt, downloadReceiptBySession };
