const mongoose = require('mongoose')
let transactionSchema = mongoose.Schema({
    historyVoucherTopup: {
        gameName: {
            type: String,
            require: [
                true,
                'Nama game harus diis'
            ]
        },
        category: {
            type: String,
            require: [
                true,
                'Kategori harus diis'
            ]
        },
        thumbnail: {
            type: String,
        },
        coinName: {
            type: String,
            require: [
                true,
                'Nama koin harus diis'
            ]
        },
        coinQuantity: {
            type: String,
            require: [
                true,
                'Jumlah koin harus diis'
            ]
        },
        price: {
            type: Number
        }
    },
    historyPayment: {
        name: {
            type: String,
            require: [
                true,
                'Nama harus diis'
            ]
        },
        type: {
            type: String,
            require: [
                true,
                'Tipe pembayaran harus diis'
            ]
        },
        bankName: {
            type: String,
            require: [
                true,
                'Nama bank harus diis'
            ]
        },
        noRekening: {
            type: String,
            require: [
                true,
                'Nomor rekening harus diis'
            ]
        },
    },
    type: {
        type: String,
        require: [
            true,
            'Tipe pembayaran harus diisi'
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
    accountUser: {
        type: String,
        require: [
            true,
            'Nama akun harus diisi'
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
    tax: {
        type: Number,
        default: 0
    },
    value: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    historyUser: {
        name: {
            type: String,
            require: [
                true,
                'Nama player harus diisi'
            ]
        },
        phoneNumber: {
            type: Number,
            require: [
                true,
                'Nama akun harus diisi'
            ],
            maxlength: [
                225,
                'Panjang harus 3 - 225 karakter'
            ],
            minlength: [
                3,
                'Panjang harus 3 - 225 karakter'
            ],
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } 
}, {
    timestamps: true
})

module.exports = mongoose.model('Transaction', transactionSchema)