const playerModel = require('./model')
const voucherModel = require('../voucher/model')
const nominalModel = require('../nominal/model')
const paymentModel = require('../payment/model')
const bankModel = require('../bank/model')
const transactionModel = require('../transaction/model')
const categoryModel = require('../category/model')

const path = require('path');
const fs = require('fs')
const config = require('../../config')

module.exports = {
    landingPage:async(req, res) => {
        try {
            const voucher = await voucherModel.find()
            .select('_id name status category thumbnail')
            .populate('category')

            res.status(200).json({
                data: voucher
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        }
    },
    detailPage:async(req, res) => {
        try {
            const {id} = req.params
            const voucher = await voucherModel.findOne({
                _id: id
            })
            .populate('category')
            .populate('nominals')
            .populate('user', '_id name phoneNumber')

            if(!voucher) {
                res.status(404).json({
                    message: 'Voucher game tidak ditemukan'
                })
            } else {
                res.status(200).json({
                    data: voucher
                })

            }
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        }
    },
    category:async(req, res) => {
        try {
            const category = await categoryModel.find()
            res.status(200).json({
                data: category
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        }
    },
    checkout:async(req, res) => {
        try {
            const {accountUser, name, nominal, voucher, payment, bank} = req.body

            const resVoucher = await voucherModel.findOne({
                _id: voucher
            }).select('category _id thumbnail user')
            .populate('category')
            .populate('user')

            if(!resVoucher) {
                res.status(404).json({
                    message: 'Voucher game tidak ditemukan'
                })
            }

            const resNominal = await nominalModel.findOne({
                _id: nominal
            })

            if(!resNominal) {
                res.status(404).json({
                    message: 'Nominal tidak ditemukan'
                })
            
            }
            
            const resPayment = await paymentModel.findOne({
                _id: payment
            })

            if(!resPayment) {
                res.status(404).json({
                    message: 'Payment tidak ditemukan'
                })
            }

            const resBank = await bankModel.findOne({
                _id: bank
            })

            if(!resBank) {
                res.status(404).json({
                    message: 'Bank tidak ditemukan'
                })
            }

            let tax = (10 / 100) * resNominal._doc.price
            let value = resNominal._doc.price - tax

            const payload = {
                historyVoucherTopup: {
                    gameName: resVoucher._doc.name,
                    category: resVoucher._doc.category ? resVoucher._doc.category.name : '-',
                    thumbnail: resVoucher._doc.thumbnail,
                    coinName: resNominal._doc.coinName,
                    coinQuantity: resNominal._doc.coinQuantity,
                    price: resNominal._doc.price,
                },
                historyPayment: {
                    name: resBank._doc.name,
                    type: resPayment._doc.type,
                    bankName: resBank._doc.bankName,
                    noRekening: resBank._doc.noRekening,
                },
                name: name,
                accountUser: accountUser,
                tax: tax,
                value: value,
                player: req.player._id,
                historyUser: {
                    name: resVoucher._doc.user?.name,
                    phoneNumber: resVoucher._doc.user?.phoneNumber,
                },
                category: resVoucher._doc.category?._id,
                user: resVoucher._doc.user?._id
            }

            const transaction = new transactionModel(payload)
            await transaction.save()

            res.status(201).json({
                data: transaction
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        }
    },
    history:async(req, res) => {
        try {
            const { status = '' } = req.query

            let criteria = {}
            
            if(status.length) {
                criteria = {
                    ...criteria,
                    status: {
                        $regex: `${status}`,
                        $options: 'i'
                    }
                }
            }

            if(req.player._id) {
                criteria = {
                    ...criteria,
                    player: req.player._id
                }
            }

            const history = await transactionModel.find(criteria)

            let docs = await transactionModel.aggregate([
                {$match: criteria},
                {
                    $group: {
                        _id: null,
                        value: {$sum: "$value"}
                    }
                }
            ])

            res.status(200).json({
                data: history,
                total: docs.length ? docs[0].value : 0
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        }
    },
    historyDetail:async(req, res) => {
        try {
            const { id } = req.params

            const history = await transactionModel.findOne({
                _id: id
            })

            if(!history) {
                return res.status(404).json({
                    message: 'History tidak ditemukan'
                })
            }

            res.status(200).json({
                data: history
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        }
    },
    dashboard:async(req, res) => {
        try {
            const count = await transactionModel.aggregate([
                {
                    $match: {
                        player: req.player._id
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        value: {
                            $sum: '$value'
                        }
                    }
                }
            ])

            const category = await categoryModel.find({

            })

            category.forEach(element => {
                count.forEach(data => {
                    if(data._id.toString() === element._id.toString()) {
                        data.name = element.name
                    }
                })
            })

            const history = await transactionModel.find({
                player: req.player._id
            }).populate('category')
            .sort({
                'updatedAt': -1
            })

            res.status(200).json({
                data: history,
                count: count
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        }
    },
    profile:async(req, res) => {
        try {

            const player = {
                id: req.player._id,
                username: req.player.username,
                email: req.player.email,
                name: req.player.name,
                avatar: req.player.avatar,
                phoneNumber: req.player.phoneNumber

            }

            res.status(200).json({
                data: player
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        }
    },
    editProfile:async(req, res) => {
        try {
            const { name = '', phoneNumber = '' } = req.body

            const payload = {}

            if(name.length) payload.username = name
            if(phoneNumber.length) payload.phoneNumber = phoneNumber

            if(req.file) {
                let player = await playerModel.findOne({
                    _id: req.player.id
                })
                let tmpPath = req.file.path
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
                let filename = req.file.filename + '.' + originalExt
                let targetPath = path.resolve(config.rootPath, `public/uploads/${player.avatar}`)

                const src = fs.createReadStream(tmpPath)
                const dest = fs.createWriteStream(targetPath)

                src.pipe(dest)

                src.on('end', async () => {
                    player = await playerModel.findOneAndUpdate({
                        _id: req.player._id
                    }, {
                        ...payload,
                        avatar: player.avatar 
                    }, {
                        new: true,
                        runValidators: true
                    })
    
                    res.status(201).json({
                        data: {
                            id: player.id,
                            username: player.username,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar,
                        }
                    })
                })
            } else {
                const player = await playerModel.findOneAndUpdate({
                    _id: req.player._id
                },
                payload,
                {
                    new: true,
                    runValidators: true
                })

                res.status(201).json({
                    data: {
                        id: player.id,
                        username: player.username,
                        phoneNumber: player.phoneNumber,
                        avatar: player.avatar,
                    }
                })
            }
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal Server Error'
            })
        }
    }
}