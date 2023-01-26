const paymentModel = require('./model')
const bankModel = require('../bank/model')

module.exports={
    index:async(req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')

            const alert = {
                message: alertMessage,
                status: alertStatus
            }

            const payment = await paymentModel.find().populate('banks')
            console.log(payment)

            res.render('admin/payment/view_payment', {
                payment,
                alert,
                name: req.session.user.name,
                title: 'Halaman Payment'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/payment')
        }
    },
    viewCreate:async(req, res) => {
        try {
            const bank = await bankModel.find()
            res.render('admin/payment/create', {
                bank,
                name: req.session.user.name,
                title: 'Halaman Tambah Payment'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/payment')
        }
    },
    actionCreate:async(req, res) => {
        try {
            const {typebanks} = req.body

            let payment = await paymentModel({ typebanks })
            await payment.save()

            req.flash('alertMessage', 'Berhasil tambah payment')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/payment')
        }
    },
    viewEdit:async(req, res) => {
        try {
            const {id} = req.params

            const bank = await bankModel.find()
            const payment = await paymentModel.findOne({
                _id: id
            }).populate('banks')

            res.render('admin/payment/edit', {
                payment,
                bank,
                name: req.session.user.name,
                title: 'Halaman Ubah Payment'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/payment')
        }
    },
    actionEdit:async(req, res) => {
        try {
            const {id} = req.params
            const {typebanks} = req.body

            await paymentModel.findOneAndUpdate({
                _id: id
            }, {
                typebanks
            })

            req.flash('alertMessage', 'Berhasil ubah kategori')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/payment')
        }
    },
    actionDelete:async(req, res) => {
        try {
            const {id} = req.params

            await paymentModel.findOneAndRemove({
                _id: id
            })

            req.flash('alertMessage', 'Berhasil hapus kategori')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/payment')
        }
    },
    actionStatus:async(req, res) => {
        try {
            const {id} = req.params

            const payment = await paymentModel.findOne({
                _id: id
            })

            let statusChange = payment.status === 'Y' ? 'N' : 'Y'
            console.log(statusChange)

            await paymentModel.updateOne({
                _id: id
            }, {
                status: statusChange
            })

            req.flash('alertMessage', 'Berhasil toggle status payment')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/voucher')
        }
    }
}