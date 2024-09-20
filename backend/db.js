const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://azilahmed2016:Azil2030%40hmed@cluster0.5ghpu.mongodb.net/todo-app");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const Todo = new Schema({
  userId: ObjectId,
  title: String,
  done: Boolean,
});

const UserModel = mongoose.model("users", User);
const TodoModel = mongoose.model("todos", Todo);

module.exports = { UserModel, TodoModel };
