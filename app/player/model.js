const e = require('connect-flash')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const HASH_ROUND = 10

let playerSchema = mongoose.Schema({
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
        ],
        maxlength: [
            225,
            'Panjang harus 3 - 225 karakter'
        ],
        minlength: [
            3,
            'Panjang harus 3 - 225 karakter'
        ],
    },
    username: {
        type: String,
        require: [
            true,
            'Nama harus diisi'
        ],
        maxlength: [
            225,
            'Panjang harus 3 - 225 karakter'
        ],
        minlength: [
            3,
            'Panjang harus 3 - 225 karakter'
        ],
    },
    password: {
        type: String,
        require: [
            true,
            'Password harus diisi'
        ],
        maxlength: [
            225,
            'Panjang maksimal 225 karakter'
        ]
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    phoneNumber: {
        type: String,
        require: [
            true,
            'Nomor hp harus diisi'
        ]
    },
    avatar: {
        type: String
    },
    filename: {
        type: String
    },
    phoneNumber: {
        type: Number,
        require: [
            true,
            'Nama akun harus diisi'
        ],
        maxlength: [
            13,
            'Panjang harus 8 - 13 karakter'
        ],
        minlength: [
            8,
            'Panjang harus 8 - 13 karakter'
        ],
    },
    favorit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
}, {
    timestamps: true
})

playerSchema.path('email').validate(async function(value) {
    try {
        const count = await this.model('Player').countDocuments({
            email: value
        })
        return !count
    } catch (error) {
        throw error
    }
}, attr => `${attr.value} sudah terdaftar`)

playerSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = mongoose.model('Player', playerSchema)