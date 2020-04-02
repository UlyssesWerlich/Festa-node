const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const app = express()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost:27017/sistema_aluguel_festa', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
}); 

mongoose.plugin(schema => {
    schema.pre('findOneAndUpdate', setRunValidators);
    schema.pre('updateMany', setRunValidators);
    schema.pre('updateOne', setRunValidators);
    schema.pre('update', setRunValidators);
  });
function setRunValidators() {
    this.setOptions({ runValidators: true });
}

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
    cpf: {type: String, required: true},
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
    res.render('clienteCadastro.ejs', {mensagem: false})
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
      data.save().then(function(result){
        res.render('clienteCadastro.ejs', {mensagem: true,
            conteudo: "Cliente cadastrado com sucesso"});
    }).catch((err) => {
        console.log(err);
        res.render('clienteCadastro.ejs', {mensagem: true,
            conteudo: "Não foi possível cadastrar esse cliente. Favor verificar os campos preenchidos e tentar novamente"});
    }); 
})

app.get('/clienteConsulta', (req, res) =>{
    res.render('clienteConsulta.ejs', {data: false, mensagem: false})
})

app.post('/clienteConsulta', (req, res) =>{  
    var busca = { "nome": RegExp(req.body.nomeConsulta , 'i')}
    clientes.find(busca)
    .then(function(result){
        res.render('clienteConsulta.ejs', {data: result, mensagem: false})
    }).catch((err) => {
        console.log(err);
        res.render('clienteConsulta.ejs', {mensagem: true,
            conteudo: "Não foi possível realizar a consulta. Favor verificar os campos preenchidos e tentar novamente"});
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
        }})
        .then(function(result){
            res.render('clienteConsulta.ejs', {data: false, mensagem: true,
                conteudo: "Sucesso na alteração de dados de cliente"});
        }).catch((err) => {
            console.log(err);
            res.render('clienteConsulta.ejs', {data: false, mensagem: true,
                conteudo: "Não foi possível alterar dados. Favor verificar os campos preenchidos e tentar novamente"});
        });
})

app.get('/clienteExcluir/:id', (req, res) =>{
    var id = { "_id": req.params.id}
    clientes.deleteOne(id)
    .then(function(result){
        res.render('clienteConsulta.ejs', {data: false, mensagem: true, 
            conteudo: "Item excluído com sucesso"})
    }).catch((err) => {
        console.log(err)
        res.render('itemConsulta.ejs', {data: false, mensagem: true, 
            conteudo: "Falha ao excluir item, favor tentar novamente"});
    })
})

app.get('/clienteValidar', (req, res) =>{
    var busca = { 
        $or : [
            {"cpf": req.query.consulta},
            {"nome": RegExp(req.query.consulta , 'i')}
        ]
    }
    clientes.findOne(busca).select('cpf nome').limit(1)
    .then(function(result){    
        if (result)
            res.send(`${result.cpf}<td>${result.nome}`) ;
        else
            res.send(` <td>Não encontrado`) ;
    }).catch((err) => {
        return console.log(err)
    }); 
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
    res.render('festaCadastro.ejs', {mensagem: false})
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
      data.save().then(function(result){
        res.render('festaCadastro.ejs', {mensagem: true,
            conteudo: "Festa cadastrado com sucesso"});
    }).catch((err) => {
        console.log(err);
        res.render('festaCadastro.ejs', {mensagem: true,
            conteudo: "Não foi possível cadastrar esta festa. Favor verificar os campos preenchidos e tentar novamente"});
    }); 
})

app.get('/festaConsulta', (req, res) =>{
    res.render('festaConsulta.ejs', {data: false, mensagem: false})
})

app.post('/festaConsulta', (req, res) =>{
    var busca = { "status": RegExp(req.body.statusConsulta , 'i')}
    festas.find(busca)
    .then(function(result){
        res.render('festaConsulta.ejs', {data: result, mensagem: false});
    }).catch((err) => {
        console.log(err);
        res.render('festaConsulta.ejs', {mensagem: true,
            conteudo: "Não foi possível realizar a consulta. Favor verificar os campos preenchidos e tentar novamente"});
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
        }})
        .then(function(result){
            res.render('festaConsulta.ejs', {data: false, mensagem: true,
                conteudo: "Sucesso na alteração de dados da festa"});
        }).catch((err) => {
            console.log(err);
            res.render('festaConsulta.ejs', {data: false, mensagem: true,
                conteudo: "Não foi possível alterar dados. Favor verificar os campos preenchidos e tentar novamente"});
        });
});

app.get('/festaExcluir/:id', (req, res) =>{
    var id = { "_id": req.params.id}
    festas.deleteOne(id)
    .then(function(result){
        res.render('festaConsulta.ejs', {data: false, mensagem: true, 
            conteudo: "Festa excluído com sucesso"})
    }).catch((err) => {
        console.log(err)
        res.render('festaConsulta.ejs', {data: false, mensagem: true, 
            conteudo: "Falha ao excluir festa, favor tentar novamente"});
    })
})

app.get('/festaAdicionarItens/:id', (req, res) => {
    var id = { "_id": req.params.id}
    festas.find(id)
    .then(function(result){
        res.render('festaAdicionarItens.ejs', {data: result, mensagem: false})
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
    })}

    festas.updateOne({"_id": req.body.id}, {$set: {"itens": listaItens}})
    .then(function(result){
        res.render('festaConsulta.ejs', {data: false, mensagem: true, 
            conteudo: "Lista de itens da festa atualizado com sucesso"})
    }).catch((err) => {
        console.log(err);
        res.render('festaConsulta.ejs', {data: false, mensagem: true, 
            conteudo: "Falha ao atualizar lista de itens. Favor tentar novamente"});
    })
})

app.get('/ajaxFestaItens', (req,res) =>{
    var busca = {   "item": RegExp(req.query.item , 'i'),
                    "tipo": RegExp(req.query.tipo, 'i'),
                    "tema": RegExp(req.query.tema, 'i')
                }
    itens.find(busca).limit(3)
    .then(function(result){
        res.render('../ajax/ajaxFestaItens.ejs', {data: result})
    }).catch((err) => {
        return console.log(err)
    }); 
})
//================================= ROTAS RELACIONADAS A ITENS =================================

const schemaItem = new Schema({
    item: {type: String, required: true},
    tipo: {type: String, required: true},
    tema: String,
    preco: String,
    descricao: String
}, {collection: 'itens'})

const itens = mongoose.model( "userData2", schemaItem);

app.get('/itemCadastro', (req, res) =>{
    res.render('itemCadastro.ejs', {mensagem: false})
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
    data.save().then(function(result){
        res.render('itemCadastro.ejs', {mensagem: true,
            conteudo: "Item cadastrado com sucesso"});
    }).catch((err) => {
        console.log(err);
        res.render('itemCadastro.ejs', {mensagem: true,
            conteudo: "Não foi possível cadastrar esse item. Favor verificar os campos preenchidos e tentar novamente"});
    }); 
})

app.get('/itemConsulta', (req, res) =>{
    res.render('itemConsulta.ejs', {data: false, mensagem: false})
})

app.post('/itemConsulta', (req, res) =>{
    var busca = { "item": RegExp(req.body.itemConsulta , 'i')}
    itens.find(busca).limit(13)
    .then(function(result){
        res.render('itemConsulta.ejs', {data: result, mensagem: false})
    }).catch((err) => {
        console.log(err);
        res.render('itemConsulta.ejs', {mensagem: true,
            conteudo: "Não foi possível realizar a consulta. Favor verificar os campos preenchidos e tentar novamente"});
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
    itens.updateOne({ "_id": req.params.id},  { 
        $set: {
            item: req.body.item,  
            tipo: req.body.tipo,
            tema: req.body.tema,
            preco: req.body.preco,
            descricao: req.body.descricao
    }})
    .then(function(result){
        res.render('itemConsulta.ejs', {data: false, mensagem: true,
            conteudo: "Sucesso na alteração de dados do item"});
    }).catch((err) => {
        console.log(err);
        res.render('itemConsulta.ejs', {data: false, mensagem: true,
            conteudo: "Não foi possível alterar dados. Favor verificar os campos preenchidos e tentar novamente"});
    });
})

app.get('/itemExcluir/:id', (req, res) =>{
    var id = { "_id": req.params.id}
    itens.deleteOne(id)
    .then(function(result){
        res.render('itemConsulta.ejs', {data: false, mensagem: true, 
            conteudo: "Item excluído com sucesso"})
    }).catch((err) => {
        console.log(err)
        res.render('itemConsulta.ejs', {data: false, mensagem: true, 
            conteudo: "Falha ao excluir item, favor tentar novamente"});
    })
})

// ================================= ROTAS RELACIONADAS A AGENDA =================================

app.get('/agenda', (req, res) =>{
    res.render('agenda.ejs')
})