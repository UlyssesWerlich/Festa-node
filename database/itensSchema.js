const mongoose = require('./connection');

const Schema = mongoose.Schema;
const schemaItem = new Schema({
    item: {type: String, required: true},
    tipo: {type: String, required: true},
    tema: String,
    preco: String,
    descricao: String,
    _visible: {type: Boolean,
        default: true}
}, {collection: 'itens'})

const itens = mongoose.model( "userData2", schemaItem);

module.exports = itens;