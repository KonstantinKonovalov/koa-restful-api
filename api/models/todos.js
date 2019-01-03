const mongoose = require('mongoose');

const todosSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    text: String
});

module.exports.Todo = mongoose.model('Todos', todosSchema);
