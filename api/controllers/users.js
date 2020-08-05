// Models
const UserModel = require('../models/user');

const getUsers = async (req, res) => {
    try {
        const { limit, skip } = req.query;

        const users = await UserModel.find().limit(+limit).skip(+skip);

        res.status(200).json({
            count: users.length,
            users,
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

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findOne({ _id: id });

        // Handle error if user isn't exist
        if(!user) {
            return res.status(400).json({
                error: { message: 'User isn\'t exist' }
            })
        }

        res.status(200).json({
            user: user._doc,
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
    getUsers,
    getUserById
}