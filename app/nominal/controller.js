const nominalModel = require('./model')

module.exports={
    index:async(req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')

            const alert = {
                message: alertMessage,
                status: alertStatus
            }

            const nominal = await nominalModel.find()
            console.log(nominal)

            res.render('admin/nominal/view_nominal', {
                nominal,
                alert,
                name: req.session.user.name,
                title: 'Halaman Nominal'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/nominal')
        }
    },
    viewCreate:async(req, res) => {
        try {
            res.render('admin/nominal/create', {
                name: req.session.user.name,
                title: 'Halaman Tambah Nominal'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/nominal')
        }
    },
    actionCreate:async(req, res) => {
        try {
            const {coinQuantity, coinName, price} = req.body

            let nominal = await nominalModel({ coinQuantity, coinName, price })
            await nominal.save()

            req.flash('alertMessage', 'Berhasil tambah nominal')
            req.flash('alertStatus', 'success')

            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/nominal')
        }
    },
    viewEdit:async(req, res) => {
        try {
            const {id} = req.params

            const nominal = await nominalModel.findOne({
                _id: id
            })

            res.render('admin/nominal/edit', {
                nominal,
                name: req.session.user.name,
                title: 'Halaman Ubah Nominal'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/nominal')
        }
    },
    actionEdit:async(req, res) => {
        try {
            const {id} = req.params
            const {coinQuantity, coinName, price} = req.body

            await nominalModel.findOneAndUpdate({
                _id: id
            }, {
                coinQuantity,
                coinName,
                price
            })

            req.flash('alertMessage', 'Berhasil ubah kategori')
            req.flash('alertStatus', 'success')

            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/nominal')
        }
    },
    actionDelete:async(req, res) => {
        try {
            const {id} = req.params

            await nominalModel.findOneAndRemove({
                _id: id
            })

            req.flash('alertMessage', 'Berhasil hapus kategori')
            req.flash('alertStatus', 'success')

            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/nominal')
        }
    }
}