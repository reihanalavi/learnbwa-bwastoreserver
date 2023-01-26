const path = require('path');
const fs = require('fs')
const config = require('../../config')

const bankModel = require('./model')

module.exports={
    index:async(req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')

            const alert = {
                message: alertMessage,
                status: alertStatus
            }

            const bank = await bankModel.find()
            console.log(bank)

            res.render('admin/bank/view_bank', {
                bank,
                alert,
                name: req.session.user.name,
                title: 'Halaman Bank'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/bank')
        }
    },
    viewCreate:async(req, res) => {
        try {

            res.render('admin/bank/create', {
                name: req.session.user.name,
                title: 'Halaman Tambah Bank'
            })

        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/bank')
        }
    },
    actionCreate:async(req, res) => {
        try {
            const {name, bankName, noRekening} = req.body

            let banks = await bankModel({ name, bankName, noRekening })
            await banks.save()

            req.flash('alertMessage', 'Berhasil tambah bank')
            req.flash('alertStatus', 'success')

            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/voucher')
        }
    },
    viewEdit:async(req, res) => {
        try {
            const {id} = req.params

            const bank = await bankModel.findOne({
                _id: id
            })

            console.log(bank)

            res.render('admin/bank/edit', {
                bank,
                name: req.session.user.name,
                title: 'Halaman Ubah Bank'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/bank')
        }
    },
    actionEdit:async(req, res) => {
        try {
            const {id} = req.params
            const {name, bankName, noRekening} = req.body

            await bankModel.findOneAndUpdate({
                _id: id
            },{
                name,
                bank,
                noRekening
            })

            req.flash('alertMessage', 'Berhasil ubah bank')
            req.flash('alertStatus', 'success')

            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/bank')
        }
    },
    actionDelete:async(req, res) => {
        try {
            const {id} = req.params

            await bankModel.findOneAndRemove({
                _id: id
            })

            req.flash('alertMessage', 'Berhasil hapus bank')
            req.flash('alertStatus', 'success')

            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/bank')
        }
    },
    // actionStatus:async(req, res) => {
    //     try {
    //         const {id} = req.params

    //         const voucher = await voucherModel.findOne({
    //             _id: id
    //         })

    //         let statusChange = voucher.status === 'Y' ? 'N' : 'Y'
    //         console.log(statusChange)

    //         await voucherModel.updateOne({
    //             _id: id
    //         }, {
    //             status: statusChange
    //         })

    //         req.flash('alertMessage', 'Berhasil toggle status voucher')
    //         req.flash('alertStatus', 'success')

    //         res.redirect('/voucher')
    //     } catch (error) {
    //         req.flash('alertMessage', `${error.message}`)
    //         req.flash('alertStatus', 'danger')
            
    //         res.redirect('/voucher')
    //     }
    // }
}