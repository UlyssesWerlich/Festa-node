const mongoose = require('./connection');

const Schema = mongoose.Schema;

const schemaUser = new Schema({
    nome: {type: String, required: true},
    cpf: {type: String, required: true},
    login: {type: String, required: true},
    dataNascimento: String,
    telefone: String,
    celular: String,
    email: String,
    senha: {type: String, required: true, length: 8},
    permissao: {
        festaConsultar: {type: Boolean},
        festaEditar: {type: Boolean},
        clienteConsultar: {type: Boolean},
        clienteEditar: {type: Boolean},
        itensConsultar: {type: Boolean},
        itensEditar: {type: Boolean},
        usersConsultar: {type: Boolean},
        usersEditar: {type: Boolean},
    },
    _visible: {type: Boolean,
        default: true}
}, {collection: 'users'});

var users = mongoose.model('UserData4', schemaUser);

module.exports = users;