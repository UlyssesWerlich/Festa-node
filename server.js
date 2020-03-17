const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const app = express()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost:27017/sistema_aluguel_festa');  

app.listen( 3000, () =>{
    console.log('Servidor rodando na porta 3000')
})

app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
    res.render('index.ejs')
})

//================================= ROTAS RELACIONADAS A CLIENTES =================================

const schemaCliente = new Schema({
    nome: {type: String, required: true},
    cpf: String,
    dataNascimento: String,
    telefone: String,
    celular: String,
    email: String,
    cep: String,
    uf: String,
    cidade: String,
    endereco: String
}, {collection: 'clientes'})

var clientes = mongoose.model('UserData', schemaCliente)

app.get('/clienteCadastro', (req, res) =>{
    res.render('clienteCadastro.ejs')
})

app.post('/clienteCadastro', (req, res) =>{
    var cliente = {  
        nome: req.body.nome,  
        cpf: req.body.cpf,
        dataNascimento: req.body.dataNascimento,
        telefone: req.body.telefone,
        celular: req.body.celular,
        email: req.body.email,
        cep: req.body.cep,
        uf: req.body.uf,
        cidade: req.body.cidade,
        endereco: req.body.endereco
      };  

      var data = new clientes(cliente);  
      data.save().catch((err) => {
        return console.log(err)
    }); 
    res.render('clienteCadastro.ejs')
})

app.get('/clienteConsulta', (req, res) =>{
    res.render('clienteConsulta.ejs', {data: false})
})

app.post('/clienteConsulta', (req, res) =>{  
    var busca = { "nome": RegExp(req.body.nomeConsulta , 'i')}
    clientes.find(busca)
    .then(function(result){
        res.render('clienteConsulta.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
        //res.redirect('/clienteConsulta'); 
    }); 
})

app.get('/clienteAlterar/:id', (req, res) =>{
    var busca = { "_id": req.params.id}
    clientes.find(busca)
    .then(function(result){
        res.render('clienteAlterar.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
    })
})

app.post('/clienteAlterar/:id', (req, res) =>{ 
    
    /*cliente = {  
        $set: {
            nome: req.body.nome,  
            cpf: req.body.cpf,
            dataNascimento: req.body.dataNascimento,
            telefone: req.body.telefone,
            celular: req.body.celular,
            email: req.body.email,
            cep: req.body.cep,
            uf: req.body.uf,
            cidade: req.body.cidade,
            endereco: req.body.endereco,
            __v: 0
        }
    };  
    var data = new clientes(cliente);  */
    
    clientes.updateOne({ "_id": req.params.id}, { 
        $set: {
            nome: req.body.nome,  
            cpf: req.body.cpf,
            dataNascimento: req.body.dataNascimento,
            telefone: req.body.telefone,
            celular: req.body.celular,
            email: req.body.email,
            cep: req.body.cep,
            uf: req.body.uf,
            cidade: req.body.cidade,
            endereco: req.body.endereco,
            __v: 0
    }}, (err, result) =>{
        if (err) return res.send(err)
        res.render('clienteConsulta.ejs', {data: false})
    }); 
})

app.get('/clienteExcluir/:id', (req, res) =>{
    var id = { "_id": req.params.id}
    clientes.deleteOne(id)
    .then(function(result){
        res.render('clienteConsulta.ejs', {data: false})
    }).catch((err) => {
        return console.log(err)
    })
})
 

//================================= ROTAS RELACIONADAS A FESTA =================================

const schemaFesta = new Schema({
    dataFesta: {type: String, required: true},
    horaMontagem: String,
    horaDesmontagem: String,
    cep: String,
    uf: String,
    cidade: String,
    endereco: String,
    cpfCliente: String,
    nomeCliente: String,
    valorFesta: String,
    status: String,
    observacao: String,
}, {collection: 'festas'})

var festas = mongoose.model('UserData2', schemaFesta)

app.get('/festaCadastro', (req, res) =>{
    res.render('festaCadastro.ejs', {info: false})
})

app.post('/festaCadastro', (req, res) =>{
    var festa = {  
        dataFesta: req.body.dataFesta,  
        horaMontagem: req.body.horaMontagem,
        horaDesmontagem: req.body.horaDesmontagem,
        cep: req.body.cep,
        uf: req.body.uf,
        cidade: req.body.cidade,
        endereco: req.body.endereco,
        cpfCliente: req.body.cpfCliente,
        nomeCliente: req.body.nomeCliente,
        valorFesta: req.body.valorFesta,
        status: req.body.status,
        observacao: req.body.observacao
      };  

      var data = new festas(festa);  
      data.save().catch((err) => {
        return console.log(err)
    }); 
    res.render('festaCadastro.ejs', {info: 1})
})

app.get('/festaConsulta', (req, res) =>{
    res.render('festaConsulta.ejs', {data: false})
})

app.post('/festaConsulta', (req, res) =>{
    var busca = { "status": RegExp(req.body.statusConsulta , 'i')}
    festas.find(busca)
    .then(function(result){
        res.render('festaConsulta.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
        //res.redirect('/clienteConsulta'); 
    }); 
})

app.get('/festaAlterar/:id', (req, res) => {
    var busca = { "_id": req.params.id}
    festas.find(busca)
    .then(function(result){
        res.render('festaAlterar.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
    })
})

app.post('/festaAlterar/:id', (req, res) =>{
    festas.updateOne({ "_id": req.params.id}, { 
        $set: {
            dataFesta: req.body.dataFesta,  
            horaMontagem: req.body.horaMontagem,
            horaDesmontagem: req.body.horaDesmontagem,
            cep: req.body.cep,
            uf: req.body.uf,
            cidade: req.body.cidade,
            endereco: req.body.endereco,
            cpfCliente: req.body.cpfCliente,
            nomeCliente: req.body.nomeCliente,
            valorFesta: req.body.valorFesta,
            status: req.body.status,
            observacao: req.body.observacao
    }}, (err, result) =>{
        if (err) return res.send(err)
        res.render('festaConsulta.ejs', {data: false})
    }); 
})

app.get('/festaExcluir/:id', (req, res) =>{
    var id = { "_id": req.params.id}
    festas.deleteOne(id)
    .then(function(result){
        res.render('festaConsulta.ejs', {data: false})
    }).catch((err) => {
        return console.log(err)
    })
})

//================================= ROTAS RELACIONADAS A PRODUTOS =================================

const schemaProduto = new Schema({
    produto: {type: String, required: true},
    tipo: String,
    tema: String,
    preco: String,
    descricao: String
}, {collection: 'produtos'})

var produtos = mongoose.model( "userData2", schemaProduto)

app.get('/produtoCadastro', (req, res) =>{
    res.render('produtoCadastro.ejs', {data: false})
})

app.post('/produtoCadastro', (req, res) =>{
    var produto = {  
        produto: req.body.produto,  
        tipo: req.body.tipo,
        tema: req.body.tema,
        preco: req.body.preco,
        descricao: req.body.descricao
      };  

      var data = new produtos(produto);  
      data.save().catch((err) => {
        return console.log(err)
    }); 
    res.render('produtoCadastro.ejs')
})

app.get('/produtoConsulta', (req, res) =>{
    res.render('produtoConsulta.ejs', {data: false})
})

app.post('/produtoConsulta', (req, res) =>{
    var busca = { "produto": RegExp(req.body.produtoConsulta , 'i')}
    produtos.find(busca)
    .then(function(result){
        res.render('produtoConsulta.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
        //res.redirect('/clienteConsulta'); 
    }); 
})

app.get('/produtoAlterar/:id', (req, res) => {
    var busca = { "_id": req.params.id}
    produtos.find(busca)
    .then(function(result){
        res.render('produtoAlterar.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
    })
})

app.post('/produtoAlterar/:id', (req, res) =>{
    produtos.updateOne({ "_id": req.params.id}, { 
        $set: {
            produto: req.body.produto,  
            tipo: req.body.tipo,
            tema: req.body.tema,
            preco: req.body.preco,
            descricao: req.body.descricao
    }}, (err, result) =>{
        if (err) return res.send(err)
        res.render('produtoConsulta.ejs', {data: false})
    }); 
})

app.get('/produtoExcluir/:id', (req, res) =>{
    var id = { "_id": req.params.id}
    produtos.deleteOne(id)
    .then(function(result){
        res.render('produtoConsulta.ejs', {data: false})
    }).catch((err) => {
        return console.log(err)
    })
})

// ================================= ROTAS RELACIONADAS A AGENDA =================================

app.get('/agenda', (req, res) =>{
    res.render('agenda.ejs')
})