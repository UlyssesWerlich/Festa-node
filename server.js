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
    itens: [{ id: String,
             item: String,
             tipo: String,
             tema: String,
             preco: String
    }]

}, {collection: 'festas'})

var festas = mongoose.model('UserData2', schemaFesta);

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

app.get('/festaAdicionarItens/:id', (req, res) => {
    var id = { "_id": req.params.id}
    festas.find(id)
    .then(function(result){
        res.render('festaAdicionarItens.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
    })
})


app.post('/festaAdicionarItens/', (req,res) => {
    ids = req.body.ids;
    nomes = req.body.itens;
    tipo = req.body.tipo;
    tema = req.body.tema;
    preco = req.body.preco;

    listaItens = [];
    for (var i = 0; i < ids.length; i++){
        listaItens.push({
            _id: ids[i],
            item: nomes[i],
            tipo: tipo[i],
            tema: tema[i],
            preco: preco[i],
        })
    }

    festas.updateOne({"_id": req.body.id}, {$set: {"itens": listaItens}})
    .then(function(result){
        res.render('festaConsulta.ejs', {data: false})
    }).catch((err) => {
        return console.log(err)
    })
})

app.get('/ajaxFestaItens/:consultaItem', (req,res) =>{
    var busca = { "item": RegExp(req.params.consultaItem , 'i')}
    itens.find(busca).limit(3)
    .then(function(result){
        res.render('../ajax/ajaxFestaItens.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
    }); 
})


//================================= ROTAS RELACIONADAS A ITENS =================================

const schemaitem = new Schema({
    item: {type: String, required: true},
    tipo: String,
    tema: String,
    preco: String,
    descricao: String
}, {collection: 'itens'})

var itens = mongoose.model( "userData2", schemaitem)

app.get('/itemCadastro', (req, res) =>{
    res.render('itemCadastro.ejs', {data: false})
})

app.post('/itemCadastro', (req, res) =>{
    var item = {  
        item: req.body.item,  
        tipo: req.body.tipo,
        tema: req.body.tema,
        preco: req.body.preco,
        descricao: req.body.descricao
      };  

      var data = new itens(item);  
      data.save().catch((err) => {
        return console.log(err)
    }); 
    res.render('itemCadastro.ejs')
})

app.get('/itemConsulta', (req, res) =>{
    res.render('itemConsulta.ejs', {data: false})
})

app.post('/itemConsulta', (req, res) =>{
    var busca = { "item": RegExp(req.body.itemConsulta , 'i')}
    itens.find(busca).limit(13)
    .then(function(result){
        res.render('itemConsulta.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
    }); 
})

app.get('/itemAlterar/:id', (req, res) => {
    var busca = { "_id": req.params.id}
    itens.find(busca)
    .then(function(result){
        res.render('itemAlterar.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
    })
})

app.post('/itemAlterar/:id', (req, res) =>{
    itens.updateOne({ "_id": req.params.id}, { 
        $set: {
            item: req.body.item,  
            tipo: req.body.tipo,
            tema: req.body.tema,
            preco: req.body.preco,
            descricao: req.body.descricao
    }}, (err, result) =>{
        if (err) return res.send(err)
        res.render('itemConsulta.ejs', {data: false})
    }); 
})

app.get('/itemExcluir/:id', (req, res) =>{
    var id = { "_id": req.params.id}
    itens.deleteOne(id)
    .then(function(result){
        res.render('itemConsulta.ejs', {data: false})
    }).catch((err) => {
        return console.log(err)
    })
})

// ================================= ROTAS RELACIONADAS A AGENDA =================================

app.get('/agenda', (req, res) =>{
    res.render('agenda.ejs')
})