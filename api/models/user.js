const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: {
            hash: String,
            iterations: Number,
            salt: String
        },
        required: true
    }
});

const User = mongoose.model('User', userSchema, 'userCollection');

const createUser = (email, password) => new User({ email, password });

const getUsers = () => User.find({}).select('_id email password');

const deleteUser = id => User.findByIdAndDelete({ _id: id });

const findUserByEmail = email => User.findOne({ email });

module.exports = {
    createUser,
    getUsers,
    deleteUser,
    findUserByEmail
};
