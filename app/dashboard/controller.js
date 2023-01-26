const transactionModel = require('../transaction/model')
const voucherModel = require('../voucher/model')
const playerModel = require('../player/model')
const categoryModel = require('../category/model')

module.exports={
    index:async(req, res) => {
        try {
            const transaction = await transactionModel.countDocuments()
            const voucher = await voucherModel.countDocuments()
            const player = await playerModel.countDocuments()
            const category = await categoryModel.countDocuments()

            console.log(req.session.user)
            res.render('admin/dashboard/view_dashboard', {
                name: req.session.user.name,
                title: 'Halaman Dashboard',
                count: {
                    transaction,
                    voucher,
                    player,
                    category
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}