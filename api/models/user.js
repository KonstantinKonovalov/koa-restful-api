const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema, 'userCollection');

const createUser = (email, password) => new User({ email, password });

const getUsers = () => User.find({}).select('_id email password');

module.exports = {
    createUser,
    getUsers
};
