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
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema, 'userCollection');

const createUser = (email, password) => new User({ email, password });

const getUsers = () => User.find({}).select('_id email password');

const deleteUser = id => User.findByIdAndDelete({ _id: id });

module.exports = {
    createUser,
    getUsers,
    deleteUser
};
