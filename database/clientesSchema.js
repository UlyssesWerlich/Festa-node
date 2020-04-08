const mongoose = require('./connection');

const Schema = mongoose.Schema;

const schemaCliente = new Schema({
    nome: {type: String, required: true},
    cpf: {type: String, required: true},
    dataNascimento: String,
    telefone: String,
    celular: String,
    email: String,
    cep: String,
    uf: String,
    cidade: String,
    endereco: String,
    _visible: {type: Boolean,
        default: true}
}, {collection: 'clientes'});

var clientes = mongoose.model('UserData', schemaCliente);

module.exports = clientes;