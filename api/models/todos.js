const mongoose = require('mongoose');

const todosSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name: {
        type: String,
        required: [true, 'Todo name is required']
    },
    text: {
        type: String,
        required: [true, 'Todo text is required']
    }
});

module.exports.Todo = mongoose.model('Todos', todosSchema, 'todos');
