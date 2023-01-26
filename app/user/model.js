const e = require('connect-flash')
const mongoose = require('mongoose')
let userSchema = mongoose.Schema({
    email: {
        type: String,
        require: [
            true,
            'Email pembayaran harus diisi'
        ]
    },
    name: {
        type: String,
        require: [
            true,
            'Nama harus diisi'
        ]
    },
    password: {
        type: String,
        require: [
            true,
            'Password harus diisi'
        ]
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'Admin'
    },
    phoneNumber: {
        type: String,
        require: [
            true,
            'Nomor hp harus diisi'
        ]
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)