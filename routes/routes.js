const express = require('express');
const routes = express.Router();
var passport = require('passport');

const clientesController = require('../controllers/clientesController');
const festasController = require('../controllers/festasController');
const itensController = require('../controllers/itensController');
const usersController = require('../controllers/usersController');

routes.get('/', (req, res) =>{
    res.render('login.ejs', {mensagem: false});
});

routes.get('/login', (req, res) =>{
    res.render('login.ejs', {mensagem: "Falha ao realizar login"});
})

routes.post('/login' , passport.authenticate('local', 
    { successRedirect: '/index', failureRedirect: '/login' })
);

routes.get('/index', authentication() ,(req, res) =>{
    res.render('index.ejs', {permissao: req.user.permissao, mensagem: false});
});

routes.get('/logoff', function(req, res, next){
    req.logOut();
    res.redirect('/');
  })

//================================= ROTAS RELACIONADAS A USUÁRIOS =================================

routes.get('/userCadastro', authentication(), permission('usersEditar'), (req, res) =>{ 
        res.render('userCadastro.ejs', {permissao: req.user.permissao, mensagem: false})   
})

routes.post('/userCadastro', authentication(), permission('usersEditar'), usersController.adicionar);

routes.get('/userConsulta', authentication(), permission('usersConsultar'), (req, res) =>{
    res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, mensagem: false})
})

routes.post('/userConsulta', authentication(), permission('usersConsultar'), usersController.consultar);

routes.get('/userAlterar/:id', authentication(), permission('usersConsultar'), usersController.buscar);

routes.post('/userAlterar/:id', authentication(), permission('usersEditar'), usersController.alterar);

routes.get('/userSenha', authentication(), (req, res) => { res.render('userSenha.ejs', {
    permissao: req.user.permissao, mensagem: false, 
    id: req.user._id, nome: req.user.nome, login: req.user.login, cpf: req.user.cpf})});

routes.post('/userSenha/:id', authentication(), usersController.alterarSenha);

routes.get('/userExcluir/:id',authentication(), permission('usersEditar'), usersController.excluir);

//================================= ROTAS RELACIONADAS A CLIENTES =================================

routes.get('/clienteCadastro', authentication(), permission('clienteEditar'), (req, res) =>{
    res.render('clienteCadastro.ejs', {permissao: req.user.permissao, mensagem: false, permissao: req.user.permissao})
})

routes.post('/clienteCadastro', authentication(), permission('clienteEditar'), clientesController.adicionar);

routes.get('/clienteConsulta', authentication(), permission('clienteConsultar'), (req, res) =>{
    res.render('clienteConsulta.ejs', {permissao: req.user.permissao, data: false, mensagem: false})
})

routes.post('/clienteConsulta', authentication(), permission('clienteConsultar'), clientesController.consultar);

routes.get('/clienteAlterar/:id', authentication(), permission('clienteConsultar'), clientesController.buscar);

routes.post('/clienteAlterar/:id', authentication(), permission('clienteEditar'), clientesController.alterar);

routes.get('/clienteExcluir/:id', authentication(), permission('clienteEditar'), clientesController.excluir);

routes.get('/clienteValidar', authentication(), permission('clienteEditar'), clientesController.validar);

//================================= ROTAS RELACIONADAS A FESTA =================================

routes.get('/festaCadastro', authentication(), permission('festaEditar'), (req, res) =>{
    res.render('festaCadastro.ejs', {permissao: req.user.permissao, mensagem: false})
})

routes.post('/festaCadastro', authentication(), permission('festaEditar'), festasController.adicionar);

routes.get('/festaConsulta', authentication(), permission('festaConsultar'), (req, res) =>{
    res.render('festaConsulta.ejs', {permissao: req.user.permissao, data: false, mensagem: false})
})

routes.post('/festaConsulta', authentication(), permission('festaConsultar'), festasController.consultar);

routes.get('/festaAlterar/:id', authentication(), permission('festaConsultar'), festasController.buscar);

routes.post('/festaAlterar/:id', authentication(), permission('festaEditar'), festasController.alterar);

routes.get('/festaExcluir/:id', authentication(), permission('festaEditar'), festasController.excluir);

routes.get('/festaAdicionarItens/:id', authentication(), permission('festaEditar'), festasController.listarItens);

routes.post('/festaAdicionarItens/:id', authentication(), permission('festaEditar'), festasController.atualizarLista);

//================================= ROTAS RELACIONADAS A ITENS =================================

routes.get('/itemCadastro', authentication(), permission('itensEditar'), (req, res) =>{
    res.render('itemCadastro.ejs', {permissao: req.user.permissao, mensagem: false})
})

routes.post('/itemCadastro', authentication(), permission('itensEditar'), itensController.adicionar);

routes.get('/itemConsulta', authentication(), permission('itensConsultar'), (req, res) =>{
    res.render('itemConsulta.ejs', {permissao: req.user.permissao, data: false, mensagem: false})
})

routes.post('/itemConsulta', authentication(), permission('itensConsultar'), itensController.consultar);

routes.get('/itemAlterar/:id', authentication(), permission('itensConsultar'), itensController.buscar);

routes.post('/itemAlterar/:id', authentication(), permission('itensEditar'), itensController.alterar)

routes.get('/itemExcluir/:id', authentication(), permission('itensEditar'), itensController.excluir);

routes.get('/ajaxFestaItens', authentication(), itensController.ajaxConsultar);

// ================================= ROTAS RELACIONADAS A AGENDA =================================

routes.get('/agenda', authentication(), permission('festaConsultar'), (req, res) =>{
    res.render('agenda.ejs', {permissao: req.user.permissao, result: false});
})

routes.post('/agenda', authentication(), permission('festaConsultar'), festasController.consultarPorData);

// ================================= FUNÇÃO DE AUTENTICAÇÃO =================================

function authentication () {  
    return function (req, res, next) {
        if (req.isAuthenticated()) { return next() }
        res.redirect('/login')
    }
}

function permission (permissao) {  
    return function (req, res, next) {
        switch (permissao) {
            case 'festaConsultar':
                if (req.user.permissao.festaConsultar) { return next() }
                break;
            case 'festaEditar':
                if (req.user.permissao.festaEditar) { return next() }
                break;
            case 'clienteConsultar':
                if (req.user.permissao.clienteConsultar) { return next() }
                break;
            case 'clienteEditar':
                if (req.user.permissao.clienteEditar) { return next() }
                break;
            case 'itensConsultar':
                if (req.user.permissao.itensConsultar) { return next() }
                break;
            case 'itensEditar':
                if (req.user.permissao.itensEditar) { return next() }
                break;
            case 'usersConsultar':
                if (req.user.permissao.usersConsultar) { return next() }
                break;
            case 'usersEditar':
                if (req.user.permissao.usersEditar) { return next() }
                break;
          }
        res.render('index.ejs', {mensagem: "Sem permissao de acesso"})
    }
}

module.exports = routes;