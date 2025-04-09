module.exports = function adminAlertTemplate(order) {
    return {
      subject: `New Order Received - ${order.orderNumber}`,
      text: `A new order has been placed by ${order.shippingAddress.name}. Total: $${order.totalAmount}`,
      html: `
        <div style="font-family: Arial;">
          <h2>New Order Alert 🚨</h2>
          <p>Customer: ${order.shippingAddress.name}</p>
          <p>Total: <strong>$${order.totalAmount.toFixed(2)}</strong></p>
          <p>Order #: ${order.orderNumber}</p>
        </div>
      `
    };
  };
  