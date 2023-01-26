const path = require('path');
const fs = require('fs')
const config = require('../../config')

const voucherModel = require('./model')
const categoryModel = require('../category/model')
const nominalModel = require('../nominal/model')

module.exports={
    index:async(req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')

            const alert = {
                message: alertMessage,
                status: alertStatus
            }

            const voucher = await voucherModel.find()
            .populate('category')
            .populate('nominals')
            console.log(voucher)

            res.render('admin/voucher/view_voucher', {
                voucher,
                alert,
                name: req.session.user.name,
                title: 'Halaman Voucher'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/voucher')
        }
    },
    viewCreate:async(req, res) => {
        try {
            const category = await categoryModel.find()
            const nominal = await nominalModel.find()

            res.render('admin/voucher/create', {
                category,
                nominal,
                name: req.session.user.name,
                title: 'Halaman Tambah Voucher'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/voucher')
        }
    },
    actionCreate:async(req, res) => {
        try {
            const {name, category, nominals } = req.body

            if(req.file) {
                let tmpPath = req.file.path
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
                let filename = req.file.filename + '.' + originalExt
                let targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`)

                const src = fs.createReadStream(tmpPath)
                const dest = fs.createWriteStream(targetPath)

                src.pipe(dest)

                src.on('end', async () => {
                    try {
                        let voucher = await voucherModel({
                            name,
                            category,
                            nominals,
                            thumbnail: filename
                        })

                        await voucher.save()

                        req.flash('alertMessage', 'Berhasil tambah voucher')
                        req.flash('alertStatus', 'success')

                        res.redirect('/voucher')
                    } catch (error) {
                        console.log(error)
                    }
                })
            } else {
                let voucher = await voucherModel({
                    name,
                    category,
                    nominals,
                })

                await voucher.save()

                req.flash('alertMessage', 'Berhasil tambah voucher')
                req.flash('alertStatus', 'success')

                res.redirect('/voucher')
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/voucher')
        }
    },
    viewEdit:async(req, res) => {
        try {
            const {id} = req.params

            const category = await categoryModel.find()
            const nominal = await nominalModel.find()

            const voucher = await voucherModel.findOne({
                _id: id
            }).populate('category')
            .populate('nominals')

            console.log(nominal)
            console.log(voucher)

            res.render('admin/voucher/edit', {
                voucher,
                category,
                nominal,
                name: req.session.user.name,
                title: 'Halaman Ubah Voucher'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/voucher')
        }
    },
    actionEdit:async(req, res) => {
        try {
            const {id} = req.params
            const {name, category, nominals } = req.body

            if(req.file) {
                let tmpPath = req.file.path
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
                let filename = req.file.filename + '.' + originalExt
                let targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`)

                const src = fs.createReadStream(tmpPath)
                const dest = fs.createWriteStream(targetPath)

                src.pipe(dest)

                src.on('end', async () => {
                    try {

                        const voucher = await voucherModel.findOne({
                            _id: id
                        })

                        let currImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`
                        if(fs.existsSync(currImage)) {
                            fs.unlinkSync(currImage)
                        }

                        await voucherModel.findOneAndUpdate({
                            _id: id
                        },{
                            name,
                            category,
                            nominals,
                            thumbnail: filename
                        })

                        req.flash('alertMessage', 'Berhasil tambah voucher')
                        req.flash('alertStatus', 'success')

                        res.redirect('/voucher')
                    } catch (error) {
                        console.log(error)
                    }
                })
            } else {
                await voucherModel.findOneAndUpdate({
                    _id: id
                },{
                    name,
                    category,
                    nominals
                })

                req.flash('alertMessage', 'Berhasil tambah voucher')
                req.flash('alertStatus', 'success')

                res.redirect('/voucher')
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/voucher')
        }
    },
    actionDelete:async(req, res) => {
        try {
            const {id} = req.params

            const voucher = await voucherModel.findOne({
                _id: id
            })

            await voucherModel.findOneAndRemove({
                _id: id
            })

            let currImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`
            if(fs.existsSync(currImage)) {
                fs.unlinkSync(currImage)
            }

            req.flash('alertMessage', 'Berhasil hapus voucher')
            req.flash('alertStatus', 'success')

            res.redirect('/voucher')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/voucher')
        }
    },
    actionStatus:async(req, res) => {
        try {
            const {id} = req.params

            const voucher = await voucherModel.findOne({
                _id: id
            })

            let statusChange = voucher.status === 'Y' ? 'N' : 'Y'
            console.log(statusChange)

            await voucherModel.updateOne({
                _id: id
            }, {
                status: statusChange
            })

            req.flash('alertMessage', 'Berhasil toggle status voucher')
            req.flash('alertStatus', 'success')

            res.redirect('/voucher')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/voucher')
        }
    }
}