const mongoose = require('./connection');

const Schema = mongoose.Schema;

const schemaFesta = new Schema({
    dataFesta: {dia: {
                    type: String,
                    length: 2,
                    required: true,},
                mes: {
                    type: String, 
                    length: 2,
                    required: true,},
                ano: {
                    type: Number, 
                    length: 4,
                    required: true,
                    min: 2019,
                    max: 2080,
                }},
    horaMontagem: {
                    type: Number,
                    min: 6,
                    max: 22,
    },
    horaDesmontagem: {
                    type: Number,
                    min: 6,
                    max: 22,
            },
    cep: String,
    uf: String,
    cidade: String,
    endereco: String,
    cpfCliente: String,
    nomeCliente: String,
    valorFesta: Number,
    status: String,
    observacao: String,
    _visible: {type: Boolean,
                default: true},
    itens: [{ id: String,
             item: String,
             tipo: String,
             tema: String,
             preco: Number
    }]
}, {collection: 'festas'})

var festas = mongoose.model('UserData2', schemaFesta);

module.exports = festas;