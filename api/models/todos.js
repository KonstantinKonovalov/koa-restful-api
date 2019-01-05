const mongoose = require('mongoose');

const todosSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    text: String
});

module.exports.Todo = mongoose.model('Todos', todosSchema, 'todos');
