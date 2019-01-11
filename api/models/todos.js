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
    },
    todoImage: {
        type: String,
        default: ''
    },
    isDone: {
        type: Boolean,
        default: false
    }
});

const Todo = mongoose.model('Todos', todosSchema, 'todos');

const getTodos = () => Todo.find().select('_id name text todoImage isDone');

const patchTodo = (id, data) => Todo.findByIdAndUpdate(
    {
        _id: id
    },
    {
        $set: data
    }
).select('_id name text todoImage isDone');

const deleteTodo = id => Todo.findByIdAndDelete(
    {
        _id: id
    }
);

const getTodoById = id => Todo.findById(id).select('_id name text todoImage isDone');

const createTodo = (name, text, imagePath) => new Todo({
    name,
    text,
    path: imagePath
});

module.exports.Todo = Todo;
module.exports.getTodos = getTodos;
module.exports.patchTodo = patchTodo;
module.exports.deleteTodo = deleteTodo;
module.exports.getTodoById = getTodoById;
module.exports.createTodo = createTodo;
