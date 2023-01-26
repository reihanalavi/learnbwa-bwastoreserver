const userModel = require('./model')

const bcrypt = require('bcrypt')

module.exports={
    viewSignin:async(req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')

            const alert = {
                message: alertMessage,
                status: alertStatus
            }

            if(req.session.user === null || req.session.user === undefined) {
                res.render('admin/user/view_signin', {
                    alert,
                    title: 'Halaman Sign In'
                })
            } else {
                res.redirect('/dashboard')
            }

        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/')
        }
    },
    actionSignin:async(req, res) => {
        try {
            const {email, password} = req.body
            const check = await userModel.findOne({
                email: email
            })

            if(check) {
                if(check.status === 'Y') {
                    const checkPassword = await bcrypt.compare(password, check.password)

                    if(checkPassword) {
                        req.session.user = {
                            id: check._id,
                            email: check.email,
                            status: check.status,
                            name: check.name
                        }
                        res.redirect('/dashboard') 
                    } else {
                        req.flash('alertMessage', 'Password salah')
                        req.flash('alertStatus', 'danger')
                        
                        res.redirect('/') 
                    }
                } else {
                    req.flash('alertMessage', 'Status user tidak aktif')
                    req.flash('alertStatus', 'danger')
                    
                    res.redirect('/')                    
                }
            } else {
                req.flash('alertMessage', 'Email tidak ditemukan')
                req.flash('alertStatus', 'danger')
                
                res.redirect('/')
            }
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            
            res.redirect('/')
        }
    },
    actionLogout: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    }
}