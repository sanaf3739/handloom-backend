const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const ShippingAddressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    }
});

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderNumber: {
        type: String,
        unique: true
    },
    items: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    paymentMethod: {
        type: String,
        enum: ['COD', 'Stripe', 'Razorpay'],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    couponApplied: {
        type: String
    },
    status: {
        type: String,
        enum: [
            'Pending', 
            'Processing', 
            'Shipped', 
            'Delivered', 
            'Cancelled', 
            'Refunded'
        ],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    paymentDetails: {
        transactionId: String,
        gateway: String
    }
}, {
    timestamps: true
});

// Generate order number before saving
OrderSchema.pre('save', function(next) {
    if (!this.orderNumber) {
        this.orderNumber = `ORD-${this._id.toString().slice(-6).toUpperCase()}`;
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);