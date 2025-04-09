module.exports = function orderConfirmationTemplate(order) {
  return {
    subject: `Order Confirmation - ${order.orderNumber}`,
    text: `
      Hi ${order.shippingAddress.name},
  
      Thank you for your order ${order.orderNumber}.
      Total: $${order.totalAmount.toFixed(2)}
      Payment Method: ${order.paymentMethod}
  
      We’ll notify you when it ships!
    `,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a4a4a;">Order Confirmation</h1>
        <p>Dear ${order.shippingAddress.name},</p>
        <p>Your order <strong>${
          order.orderNumber
        }</strong> has been successfully placed.</p>

        <h2>Order Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${order.items
                  .map(
                    (item) => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                          item.name
                        }</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
                          item.quantity
                        }</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${item.price.toFixed(
                          2
                        )}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>

        <p>Total Amount: <strong>$${order.totalAmount.toFixed(2)}</strong></p>
        <p>Payment Method: ${order.paymentMethod}</p>

        <p>Thank you for your purchase!</p>
    </div>
    `,
  };
};
