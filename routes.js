const express = require('express');
const routes = express.Router();

const clientesController = require('./controllers/clientesController');
const festasController = require('./controllers/festasController');
const itensController = require('./controllers/itensController');

routes.get('/', (req, res) =>{
    res.render('index.ejs')
})

//================================= ROTAS RELACIONADAS A CLIENTES =================================

routes.get('/clienteCadastro', (req, res) =>{
    res.render('clienteCadastro.ejs', {mensagem: false})
})

routes.post('/clienteCadastro', clientesController.adicionar);

routes.get('/clienteConsulta', (req, res) =>{
    res.render('clienteConsulta.ejs', {data: false, mensagem: false})
})

routes.post('/clienteConsulta', clientesController.consultar);

routes.get('/clienteAlterar/:id', clientesController.buscar);

routes.post('/clienteAlterar/:id', clientesController.alterar);

routes.get('/clienteExcluir/:id', clientesController.excluir);

routes.get('/clienteValidar', clientesController.validar);

//================================= ROTAS RELACIONADAS A FESTA =================================

routes.get('/festaCadastro', (req, res) =>{
    res.render('festaCadastro.ejs', {mensagem: false})
})

routes.post('/festaCadastro', festasController.adicionar);

routes.get('/festaConsulta', (req, res) =>{
    res.render('festaConsulta.ejs', {data: false, mensagem: false})
})

routes.post('/festaConsulta', festasController.consultar);

routes.get('/festaAlterar/:id', festasController.buscar);

routes.post('/festaAlterar/:id', festasController.alterar);

routes.get('/festaExcluir/:id', festasController.excluir);

routes.get('/festaAdicionarItens/:id', festasController.listarItens);

routes.post('/festaAdicionarItens/', festasController.atualizarLista);

//================================= ROTAS RELACIONADAS A ITENS =================================

routes.get('/itemCadastro', (req, res) =>{
    res.render('itemCadastro.ejs', {mensagem: false})
})

routes.post('/itemCadastro', itensController.adicionar);

routes.get('/itemConsulta', (req, res) =>{
    res.render('itemConsulta.ejs', {data: false, mensagem: false})
})

routes.post('/itemConsulta', itensController.consultar);

routes.get('/itemAlterar/:id', itensController.buscar);

routes.post('/itemAlterar/:id', itensController.alterar)

routes.get('/itemExcluir/:id', itensController.excluir);

routes.get('/ajaxFestaItens', itensController.ajaxConsultar);

// ================================= ROTAS RELACIONADAS A AGENDA =================================

routes.get('/agenda', (req, res) =>{
    res.render('agenda.ejs', {result: false});
})

routes.post('/agenda', festasController.consultarPorData);

module.exports = routes;