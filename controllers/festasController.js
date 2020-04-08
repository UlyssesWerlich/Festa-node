const festas = require('../database/festasSchema');

module.exports = {

    async adicionar(req, res) {
        array = req.body.dataFesta.split('-');
        var festa = {  
            dataFesta: {
                dia: array[2],
                mes: array[1],
                ano: array[0],
            },  
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
            observacao: req.body.observacao,
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
    },

    async consultar(req, res){
        var busca = { "status": RegExp(req.body.statusConsulta , 'i'),
                    "_visible": true}
        festas.find(busca)
        .then(function(result){
            res.render('festaConsulta.ejs', {data: result, mensagem: false});
        }).catch((err) => {
            console.log(err);
            res.render('festaConsulta.ejs', {mensagem: true,
                conteudo: "Não foi possível realizar a consulta. Favor verificar os campos preenchidos e tentar novamente"});
        }); 
    },

    async buscar(req, res){
        var busca = { "_id": req.params.id}
        festas.find(busca)
        .then(function(result){
            res.render('festaAlterar.ejs', {data: result})
        }).catch((err) => {
            return console.log(err)
        })
    },

    async alterar(req, res){
        array = req.body.dataFesta.split('-');
        festas.updateOne({ "_id": req.params.id}, { 
            $set: {
                dataFesta: {
                    dia: array[2],
                    mes: array[1],
                    ano: array[0],
                },  
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
                observacao: req.body.observacao,
                _visible: true,
            }})
            .then(function(result){
                res.render('festaConsulta.ejs', {data: false, mensagem: true,
                    conteudo: "Sucesso na alteração de dados da festa"});
            }).catch((err) => {
                console.log(err);
                res.render('festaConsulta.ejs', {data: false, mensagem: true,
                    conteudo: "Não foi possível alterar dados. Favor verificar os campos preenchidos e tentar novamente"});
        }   );
    },

    async excluir(req,res){
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
    },

    async listarItens(req, res){
        var id = { "_id": req.params.id}
        festas.find(id)
        .then(function(result){
            res.render('festaAdicionarItens.ejs', {data: result, mensagem: false})
        }).catch((err) => {
            return console.log(err)
        })
    },

    async atualizarLista(req, res){
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
    },

    async consultarPorData(req,res){
        var mes = req.body.mes;
        var ano = req.body.ano;
        festas.find({
            "dataFesta.mes": mes,
            "dataFesta.ano": ano 
        }).then(function(result){
                res.render('agenda.ejs', {result: result, mes: mes, ano: ano, mensagem: false})
            }).catch((err) => {
                console.log(err);
                res.render('agenda.ejs', {result: false, mensagem: true,
                    conteudo: "Não foi possível realizar a consulta. Favor verificar os campos preenchidos e tentar novamente"});
        }   ); 
    }
}