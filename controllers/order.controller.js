const Order = require("../models/order.model.js");
const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");
const adminAlertTemplate = require("../services/emails/templates/adminAlert.js");
const sendEmail = require("../services/emailService.js");
const orderConfirmationTemplate = require("../services/emails/templates/orderConfirmation.js");
const sendWhatsApp = require("../services/whatsappService.js");
const adminWhatsAppMessage = require("../services/messages/adminAlertMsg.js")
exports.createOrder = async (req, res) => {
  try {
    const { items, total, user, paymentMethod, couponApplied, discountAmount } = req.body;

    // Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    // Verify user exists
    const existingUser = await User.findById(req.user._id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate product availability and prices
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item._id);
        if (!product) {
          throw new Error(`Product ${item._id} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }
        return {
          productId: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      totalAmount: total,
      shippingAddress: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        pinCode: user.pinCode,
      },
      paymentMethod,
      couponApplied,
      discountAmount,
    });

    // Process payment based on method
    if (paymentMethod === "Stripe") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: "inr",
        payment_method_types: ["card"],
      });

      order.paymentDetails = {
        transactionId: paymentIntent.id,
        gateway: "Stripe",
      };
      order.paymentStatus = "Pending";
    }

    // Save order
    await order.save();

    // Update product inventory
    await Promise.all(
      orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity },
        });
      })
    );

    // Send confirmation email
    await sendOrderConfirmationEmail(order);

    res.status(201).json({
      message: "Order placed successfully",
      orderNumber: order.orderNumber,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  console.log("feching orders...");
  // return res.json({success: true})
  try {
    const orders = await Order.find({ userId: req.user._id });
    // .sort({ createdAt: -1 })
    // .populate("items.product");

    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve order",
      error: error.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation for pending orders
    if (order.status !== "Pending") {
      return res.status(400).json({
        message: "Cannot cancel order. Current status: " + order.status,
      });
    }

    // Update order status
    order.status = "Cancelled";
    await order.save();

    // Restore product inventory
    await Promise.all(
      order.items.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: item.quantity },
        });
      })
    );

    res.status(200).json({
      message: "Order cancelled successfully",
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

// Helper function to send order confirmation email
async function sendOrderConfirmationEmail(order) {
  // send email to the customer
  const customerEmail = orderConfirmationTemplate(order);
  await sendEmail({
    to: order.shippingAddress.email,
    ...customerEmail,
  });

  // send email to the admin
  const adminEmail = adminAlertTemplate(order);
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    ...adminEmail,
  });

    // WhatsApp to admin
    await sendWhatsApp(process.env.ADMIN_WHATSAPP, adminWhatsAppMessage(order));
}

// async function sendOrderConfirmationEmail(order) {
//   // Configure nodemailer transporter
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: order.shippingAddress.email,
//       subject: `Order Confirmation - ${order.orderNumber}`,
//       text: `
//     Hi ${order.shippingAddress.name},

//     Thank you for your order ${order.orderNumber}.
//     Total: $${order.totalAmount.toFixed(2)}
//     Payment Method: ${order.paymentMethod}

//     We’ll notify you when it ships!
//   `,
//       html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h1 style="color: #4a4a4a;">Order Confirmation</h1>
//                     <p>Dear ${order.shippingAddress.name},</p>
//                     <p>Your order <strong>${
//                       order.orderNumber
//                     }</strong> has been successfully placed.</p>

//                     <h2>Order Details</h2>
//                     <table style="width: 100%; border-collapse: collapse;">
//                         <thead>
//                             <tr>
//                                 <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
//                                 <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
//                                 <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             ${order.items
//                               .map(
//                                 (item) => `
//                                 <tr>
//                                     <td style="border: 1px solid #ddd; padding: 8px;">${
//                                       item.name
//                                     }</td>
//                                     <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
//                                       item.quantity
//                                     }</td>
//                                     <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${item.price.toFixed(
//                                       2
//                                     )}</td>
//                                 </tr>
//                             `
//                               )
//                               .join("")}
//                         </tbody>
//                     </table>

//                     <p>Total Amount: <strong>$${order.totalAmount.toFixed(2)}</strong></p>
//                     <p>Payment Method: ${order.paymentMethod}</p>

//                     <p>Thank you for your purchase!</p>
//                 </div>
//             `,
//     });
//   } catch (error) {
//     console.error("Email sending failed:", error);
//   }
// }
