const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Models
const UserModel = require('../models/user');

// Constants
const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        
        if(!user) {
            return res.status(401).json({
                auth: {
                    message: 'Email isn\'t founded'
                },
                request: {
                    type: req.method
                }
            })
        }

        let isEqual = await bcrypt.compare(password, user.password);

        if(!isEqual) {
            return res.status(401).json({
                auth: {
                    message: 'Wrong password'
                },
                request: {
                    type: req.method
                }
            })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: '6h'
            }
        )

        res.status(200).json({
            auth: {
                token
            },
            request: {
                type: req.method
            }
        })
    }
    catch(err) {
        console.log(err);

        res.status(500).json({
            error: { message: err }
        })
    }
}

const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: { message: errors.array() }
            })
        }

        let isExisted = await UserModel.findOne({ email });

        if(!!isExisted) {
            return res.status(400).json({
                errors: { message: 'User is already existed!' }
            })
        }

        let hashPassword = await bcrypt.hash(password, 12);
    
        if(!hashPassword) throw 'Something wrong!';

        const user = new UserModel({
            email,
            password: hashPassword,
            name
        });

        let result = await user.save();

        res.status(201).json({
            auth: {
                result,
                message: 'Created succefully'
            },
            request: {
                type: req.method
            }
        })
    }   
    catch(err) {
        console.log(err);

        res.status(500).json({
            error: { messsage: err }
        })
    }
}

const me = async (req, res) => {
    const userId = req.userId;

    try {
        if(!userId) {
            return res.status(401).json({
                error: { message: 'Can\'t authorizate!' }
            })
        }

        const user = await UserModel.findById(userId);

        if(!user) {
            return res.status(401).json({
                error: { message: 'User with provided id isn\'t exist!' }
            })
        }

        res.status(200).json({
            me: user,
            request: {
                type: req.method
            }
        })
    }   
    catch(err) {
        console.log(err);

        res.status(500).json({
            error: { message: err }
        })
    }
}

module.exports = {
    login,
    signup,
    me
}