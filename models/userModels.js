// userSchemaのモデル定義
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

const UserModel = model('User', userSchema);

module.exports = UserModel;