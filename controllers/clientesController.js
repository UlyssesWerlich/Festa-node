const clientes = require('../database/clientesSchema');

module.exports = {

    async adicionar(req, res) {
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
    },

    async consultar(req, res){
        var busca = { "nome": RegExp(req.body.nomeConsulta , 'i'),
                    "_visible": true}
        clientes.find(busca)
            .then(function(result){
                res.render('clienteConsulta.ejs', {data: result, mensagem: false})
        }).catch((err) => {
            console.log(err);
            res.render('clienteConsulta.ejs', {mensagem: true,
            conteudo: "Não foi possível realizar a consulta. Favor verificar os campos preenchidos e tentar novamente"});
        }); 
    },

    async buscar(req, res){
        var busca = { "_id": req.params.id}
        clientes.find(busca)
        .then(function(result){
            res.render('clienteAlterar.ejs', {data: result})
        }).catch((err) => {
            return console.log(err)
        })
    },

    async alterar(req, res){
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
                _visible: true,
            }})
            .then(function(result){
                res.render('clienteConsulta.ejs', {data: false, mensagem: true,
                    conteudo: "Sucesso na alteração de dados de cliente"});
            }).catch((err) => {
                console.log(err);
                res.render('clienteConsulta.ejs', {data: false, mensagem: true,
                    conteudo: "Não foi possível alterar dados. Favor verificar os campos preenchidos e tentar novamente"});
            });
    },

    async excluir(req,res){
        clientes.updateOne({ "_id": req.params.id},{
            $set: {
                _visible: false,
        }   })
        .then(function(result){
            res.render('clienteConsulta.ejs', {data: false, mensagem: true, 
                conteudo: "Item excluído com sucesso"})
        }).catch((err) => {
            console.log(err)
            res.render('itemConsulta.ejs', {data: false, mensagem: true, 
                conteudo: "Falha ao excluir item, favor tentar novamente"});
        })
    },

    async validar(req, res){
        var busca = { 
            $or : [
                {"cpf": req.query.consulta},
                {"nome": RegExp(req.query.consulta , 'i')}
        ]    }
        clientes.findOne(busca).select('cpf nome cep uf cidade endereco').limit(1)
        .then(function(result){    
            if (result)
                res.send(`${result.cpf}<td>${result.nome}<td>${result.cep}<td>` + 
                         `${result.uf}<td>${result.cidade}<td>${result.endereco}`) ;
            else
                res.send(` <td>Não encontrado<td> <td> <td> <td> `) ;
        }).catch((err) => {
            return console.log(err)
        }); 
    },
}