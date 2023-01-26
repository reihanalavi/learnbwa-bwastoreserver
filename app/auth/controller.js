const playerModel = require('../player/model')
const path = require('path');
const fs = require('fs')
const config = require('../../config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    signup:async(req, res, next) => {
        try {
            const payload = req.body

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
                        const player = new playerModel({
                            ...payload, avatar: filename
                        })

                        await player.save()
                        delete player._doc.password

                        res.status(201).json({
                            data: player
                        })

                    } catch (error) {
                        if(error && error.name === 'ValidationError') {
                            return res.status(422).json({
                                error: 1,
                                message: error.message,
                                fields: error.errors
                            })
                        }
                        next()
                    }
                })
            } else {
                let player = new playerModel(payload)

                await player.save()

                delete player._doc.password

                res.status(201).json({
                    data: player
                })
            }

        } catch (error) {
            if(error && error.name === 'ValidationError') {
                return res.status(422).json({
                    error: 1,
                    message: error.message,
                    fields: error.errors
                })
            }
            next(error)
        }
    },
    signin: (req, res, next) => {
        const { email, password } = req.body
        playerModel.findOne({
            email: email
        }).then((player) => {
            if(player) {
                const checkPassword = bcrypt.compareSync(password, player.password)

                if(checkPassword) {
                    const token = jwt.sign({
                        player: {
                            id: player.id,
                            username: player.username,
                            email: player.email,
                            name: player.name,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar,
                        }
                    }, config.jwtKey)

                    res.status(200).json({
                        data: {
                            token
                        }
                    })
                } else {
                    res.status(403).json({
                        message: 'Password salah'
                    })
                }
            } else {
                res.status(403).json({
                    message: 'Email tidak ditemukan'
                })
            }
        }).catch((err) => {
            res.status(500).json({
                message: err.message || 'Internal Server Error'
            })

            next()
        })
    }
}