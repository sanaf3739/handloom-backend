module.exports = function customerWhatsAppMessage(order) {
  return `Hi ${order.shippingAddress.name}, 👋
  
  ✅ Your order *#${order.orderNumber}* has been received successfully!
  
  🛍️ Total: $${order.totalAmount.toFixed(2)}
  📦 Payment Method: ${order.paymentMethod}
  
  Thank you for shopping with us! 🙏`;
};
