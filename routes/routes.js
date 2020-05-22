const express = require('express');
const routes = express.Router();
const passport = require('passport');

var auth = require('../middlewares/authentication');
var enable = require('../middlewares/permission');
const multer = require('../middlewares/multer');

const clientesCtrl = require('../controllers/clientesController');
const festasCtrl = require('../controllers/festasController');
const itensCtrl = require('../controllers/itensController');
const usersCtrl = require('../controllers/usersController');

routes.get('/', (req, res) =>{
    res.render('login.ejs', {mensagem: false});
});

routes.get('/login', (req, res) =>{
    res.render('login.ejs', {mensagem: "Falha ao realizar login"});
})

routes.post('/login' , passport.authenticate('local', 
    { successRedirect: '/index', failureRedirect: '/login' })
);

routes.get('/index', auth() ,(req, res) =>{
    res.render('index.ejs', {permissao: req.user.permissao, mensagem: false});
});

routes.get('/logoff', function(req, res, next){
    req.logOut();
    res.redirect('/');
  })

//================================= ROTAS RELACIONADAS A USUÁRIOS =================================

routes.get('/userCadastro', auth(), enable('usersEditar'), (req, res) =>{ 
        res.render('userCadastro.ejs', {permissao: req.user.permissao, mensagem: false})   
})

routes.post('/userCadastro', auth(), enable('usersEditar'), usersCtrl.adicionar);

routes.get('/userConsulta', auth(), enable('usersConsultar'), (req, res) =>{
    res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, mensagem: false})
})

routes.post('/userConsulta', auth(), enable('usersConsultar'), usersCtrl.consultar);

routes.get('/userAlterar/:id', auth(), enable('usersConsultar'), usersCtrl.buscar);

routes.post('/userAlterar/:id', auth(), enable('usersEditar'), usersCtrl.alterar);

routes.get('/userSenha', auth(), (req, res) => { res.render('userSenha.ejs', {
    permissao: req.user.permissao, mensagem: false, 
    id: req.user._id, nome: req.user.nome, login: req.user.login, cpf: req.user.cpf})});

routes.post('/userSenha/:id', auth(), usersCtrl.alterarSenha);

routes.get('/userExcluir/:id',auth(), enable('usersEditar'), usersCtrl.excluir);

//================================= ROTAS RELACIONADAS A CLIENTES =================================

routes.get('/clienteCadastro', auth(), enable('clienteEditar'), (req, res) =>{
    res.render('clienteCadastro.ejs', {permissao: req.user.permissao, mensagem: false, permissao: req.user.permissao})
})

routes.post('/clienteCadastro', auth(), enable('clienteEditar'), clientesCtrl.adicionar);

routes.get('/clienteConsulta', auth(), enable('clienteConsultar'), (req, res) =>{
    res.render('clienteConsulta.ejs', {permissao: req.user.permissao, data: false, mensagem: false})
})

routes.post('/clienteConsulta', auth(), enable('clienteConsultar'), clientesCtrl.consultar);

routes.get('/clienteAlterar/:id', auth(), enable('clienteConsultar'), clientesCtrl.buscar);

routes.post('/clienteAlterar/:id', auth(), enable('clienteEditar'), clientesCtrl.alterar);

routes.get('/clienteExcluir/:id', auth(), enable('clienteEditar'), clientesCtrl.excluir);

routes.get('/clienteValidar', auth(), enable('clienteEditar'), clientesCtrl.validar);

//================================= ROTAS RELACIONADAS A FESTA =================================

routes.get('/festaCadastro', auth(), enable('festaEditar'), (req, res) =>{
    res.render('festaCadastro.ejs', {permissao: req.user.permissao, mensagem: false})
})

routes.post('/festaCadastro', auth(), enable('festaEditar'), festasCtrl.adicionar);

routes.get('/festaConsulta', auth(), enable('festaConsultar'), (req, res) =>{
    res.render('festaConsulta.ejs', {permissao: req.user.permissao, data: false, mensagem: false})
})

routes.post('/festaConsulta', auth(), enable('festaConsultar'), festasCtrl.consultar);

routes.get('/festaAlterar/:id', auth(), enable('festaConsultar'), festasCtrl.buscar);

routes.post('/festaAlterar/:id', auth(), enable('festaEditar'), festasCtrl.alterar);

routes.get('/festaExcluir/:id', auth(), enable('festaEditar'), festasCtrl.excluir);

routes.get('/festaAdicionarItens/:id', auth(), enable('festaEditar'), festasCtrl.listarItens);

routes.post('/festaAdicionarItens/:id', auth(), enable('festaEditar'), festasCtrl.atualizarLista);

//================================= ROTAS RELACIONADAS A ITENS =================================

routes.get('/itemCadastro', auth(), enable('itensEditar'), (req, res) =>{
    res.render('itemCadastro.ejs', {permissao: req.user.permissao, mensagem: false})
})

routes.post('/itemCadastro', auth(), enable('itensEditar'), multer.single('image'), itensCtrl.adicionar);

routes.get('/itemConsulta', auth(), enable('itensConsultar'), (req, res) =>{
    res.render('itemConsulta.ejs', {permissao: req.user.permissao, data: false, mensagem: false})
})

routes.post('/itemConsulta', auth(), enable('itensConsultar'), itensCtrl.consultar);

routes.get('/itemAlterar/:id', auth(), enable('itensConsultar'), itensCtrl.buscar);

routes.post('/itemAlterar/:id', auth(), enable('itensEditar'), multer.single('image'), itensCtrl.alterar)

routes.get('/itemExcluir/:id', auth(), enable('itensEditar'), itensCtrl.excluir);

routes.get('/getFestaItens', auth(), itensCtrl.ajaxConsultar);

// ================================= ROTAS RELACIONADAS A AGENDA =================================

routes.get('/agenda', auth(), enable('festaConsultar'), (req, res) =>{
    res.render('agenda.ejs', {permissao: req.user.permissao, result: false});
})

routes.post('/agenda', auth(), enable('festaConsultar'), festasCtrl.consultarPorData);

module.exports = routes;