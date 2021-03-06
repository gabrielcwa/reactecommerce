const User = require("../models/user")
const { errorHandler } = require("../helpers/dbErrorHandler")
const jwt = require("jsonwebtoken") // to generate signed token
const expressJwt = require("express-jwt") // for authorization check

exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

exports.update = (req, res) => {
    User.findByIdAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to perform this action"
                })
            }
            user.hashed_password = undefined
            user.salt = undefined
            res.json(user)
        })
}

exports.signup = (req, res) => {
    const user = new User(req.body)

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user
        })
    })
}

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup"
            })
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(402).json({
                error: 'Email and password dont match'
            })
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 })

        // return response with user and token to frontend client
        const { _id, name, email, role } = user
        return res.json({ token, user: { _id, email, name, role } })
    })

}

exports.signout = (req, res) => {
    res.clearCookie("t")
    res.json({ message: "Signout success!" })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
})

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if (!user) {
        return res.status(403).json({
            error: "Access denied!"
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    const admin = 1
    if (req.profile && req.profile.role != admin) {
        return res.status(403).json({
            error: "Admin resourse! Access denied!"
        })
    }
    next()
}