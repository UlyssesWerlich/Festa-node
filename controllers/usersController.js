const users = require('../database/usersSchema');
const bcrypt = require('bcryptjs') 

module.exports = {

    async adicionar(req, res) {
        var password = '123456';
        const cryptPwd = bcrypt.hashSync(password, 10)

        var festaConsultar = (req.body.festaConsultar) ? true : false ;
        var festaEditar = (req.body.festaEditar) ? true : false ;
        var clienteConsultar = (req.body.clienteConsultar) ? true : false ;
        var clienteEditar = (req.body.clienteEditar) ? true : false ;
        var itensConsultar = (req.body.itemConsultar) ? true : false ;
        var itensEditar = (req.body.itemEditar) ? true : false ;
        var usersConsultar = (req.body.userConsultar) ? true : false ;
        var usersEditar = (req.body.userEditar) ? true : false ;

        var user = {  
            nome: req.body.nome,
            cpf: req.body.cpf,
            login: req.body.login,
            dataNascimento: req.body.dataNascimento,
            telefone: req.body.telefone,
            celular: req.body.celular,
            email: req.body.email,
            senha: cryptPwd,
            permissao: {
                festaConsultar: festaConsultar,
                festaEditar: festaEditar,
                clienteConsultar: clienteConsultar,
                clienteEditar: clienteEditar,
                itensConsultar: itensConsultar,
                itensEditar: itensEditar,
                usersConsultar: usersConsultar,
                usersEditar: usersEditar,
            },
          };  
          var data = new users(user);  
          data.save().then(function(result){
            res.render('userCadastro.ejs', {permissao: req.user.permissao, 
                mensagem: "Usuário cadastrado com sucesso"
            });
        }).catch((err) => {
            console.log(err);
            res.render('userCadastro.ejs', { permissao: req.user.permissao,
                mensagem: "Não foi possível cadastrar esse Usuário. Favor verificar os campos preenchidos e tentar novamente"});
        }); 
    },

    async consultar(req, res){
        var busca = { "nome": RegExp(req.body.nomeConsulta , 'i'),
                    "_visible": true}
        users.find(busca)
            .then(function(result){
                res.render('userConsulta.ejs', {permissao: req.user.permissao, data: result, mensagem: false})
        }).catch((err) => {
            console.log(err);
            res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false,
                mensagem: "Não foi possível realizar a consulta. Favor verificar os campos preenchidos e tentar novamente"});
        }); 
    },

    async buscar(req, res){
        var busca = { "_id": req.params.id}
        users.find(busca)
        .then(function(result){
            res.render('userAlterar.ejs', {permissao: req.user.permissao, data: result})
        }).catch((err) => {
            return console.log(err)
        })
    },

    async alterar(req, res){
        var password = '123456';
        const cryptPwd = bcrypt.hashSync(password, 10)

        var festaConsultar = (req.body.festaConsultar) ? true : false ;
        var festaEditar = (req.body.festaEditar) ? true : false ;
        var clienteConsultar = (req.body.clienteConsultar) ? true : false ;
        var clienteEditar = (req.body.clienteEditar) ? true : false ;
        var itensConsultar = (req.body.itemConsultar) ? true : false ;
        var itensEditar = (req.body.itemEditar) ? true : false ;
        var usersConsultar = (req.body.userConsultar) ? true : false ;
        var usersEditar = (req.body.userEditar) ? true : false ;

        users.updateOne({ "_id": req.params.id}, { 
            $set: {
                nome: req.body.nome,
                cpf: req.body.cpf,
                login: req.body.login,
                dataNascimento: req.body.dataNascimento,
                telefone: req.body.telefone,
                celular: req.body.celular,
                email: req.body.email,
                senha: cryptPwd,
                permissao: {
                    festaConsultar: festaConsultar,
                    festaEditar: festaEditar,
                    clienteConsultar: clienteConsultar,
                    clienteEditar: clienteEditar,
                    itensConsultar: itensConsultar,
                    itensEditar: itensEditar,
                    usersConsultar: usersConsultar,
                    usersEditar: usersEditar,
                },
            }})
            .then(function(result){
                res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, 
                    mensagem: "Sucesso na alteração de dados do usuário"
                });
            }).catch((err) => {
                console.log(err);
                res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, 
                    mensagem: "Não foi possível alterar dados. Favor verificar os campos preenchidos e tentar novamente"});
            });
    },

    async alterarSenha(req, res){
        var password = req.body.novaSenha;
        const cryptPwd = bcrypt.hashSync(password, 10)
        var busca = { "login": req.body.login };

        users.findOne(busca).select('login senha')
        .then(function(result){
            if (result) {
                if (result.senha === req.body.senha){
                    users.updateOne({ "_id": req.params.id}, { 
                        $set: {
                            senha: cryptPwd,
                        }})
                        .then(function(result){
                            res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, 
                                mensagem:"Senha alterada com sucesso"
                            });
                        }).catch((err) => {
                            console.log(err);
                            res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, 
                                mensagem: "Não foi possível alterar senha. Favor verificar os campos preenchidos e tentar novamente"});
                        });
                } else {
                    res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, 
                        mensagem: "Senha inválida, favor tentar novamente"
                    });
                }
            } else {
                res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, 
                    mensagem: "Usuário não encontrado, favor tentar novamente"
                });
            }
    })},

    async excluir(req,res){
        users.updateOne({ "_id": req.params.id},{
            $set: {
                _visible: false,
        }   })
        .then(function(result){
            res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, 
                mensagem: "Usuário excluído com sucesso"
            })
        }).catch((err) => {
            console.log(err)
            res.render('userConsulta.ejs', {permissao: req.user.permissao, data: false, 
                mensagem: "Falha ao excluir usuário, favor tentar novamente"
            });
        })
    },
}