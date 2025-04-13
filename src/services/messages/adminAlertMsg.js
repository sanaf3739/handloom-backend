module.exports = function adminWhatsAppMessage(order) {
  return `📢 New Order Alert
  
  Customer: ${order.shippingAddress.name}
  Order #: ${order.orderNumber}
  Total: $${order.totalAmount.toFixed(2)}
  
  Please check the admin panel for details.`;
};
