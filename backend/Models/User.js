const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    fullname: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Must be 10 digits.`
        }
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@gmail\.com$/.test(v);
            },
            message: props => `${props.value} is not a valid email! Must end with @gmail.com`
        }
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);