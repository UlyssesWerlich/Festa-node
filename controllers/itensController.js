const itens = require('../database/itensSchema');

module.exports = {

    async adicionar(req, res) {
        var item = {  
            item: req.body.item,  
            tipo: req.body.tipo,
            tema: req.body.tema,
            preco: req.body.preco,
            descricao: req.body.descricao
          };  
    
        var data = new itens(item);  
        data.save().then(function(result){
            res.render('itemCadastro.ejs', { permissao: req.user.permissao,
                mensagem: "Item cadastrado com sucesso"});
        }).catch((err) => {
            console.log(err);
            res.render('itemCadastro.ejs', { permissao: req.user.permissao,
                mensagem: "Não foi possível cadastrar esse item. Favor verificar os campos preenchidos e tentar novamente"});
        }); 
    },

    async consultar(req, res){
        var busca = { "item": RegExp(req.body.itemConsulta , 'i'),
                      "tipo": RegExp(req.body.tipoConsulta , 'i'),
                      "tema": RegExp(req.body.temaConsulta , 'i'),
                      "_visible": true,}
        itens.find(busca)
        .then(function(result){
            res.render('itemConsulta.ejs', {permissao: req.user.permissao, data: result, mensagem: false})
        }).catch((err) => {
            console.log(err);
            res.render('itemConsulta.ejs', {permissao: req.user.permissao, data: false, 
                mensagem: "Não foi possível realizar a consulta. Favor verificar os campos preenchidos e tentar novamente"});
        }); 
    },

    async buscar(req, res){
        var busca = { "_id": req.params.id}
        itens.find(busca)
        .then(function(result){
            res.render('itemAlterar.ejs', {permissao: req.user.permissao, data: result})
        }).catch((err) => {
            return console.log(err)
        })
    },

    async alterar(req, res){
        itens.updateOne({ "_id": req.params.id},  { 
            $set: {
                item: req.body.item,  
                tipo: req.body.tipo,
                tema: req.body.tema,
                preco: req.body.preco,
                descricao: req.body.descricao,
                _visible: true,
        }}  ).then(function(result){
            res.render('itemConsulta.ejs', {permissao: req.user.permissao, data: false, 
                mensagem: "Sucesso na alteração de dados do item"
            });
        }).catch((err) => {
            console.log(err);
            res.render('itemConsulta.ejs', {permissao: req.user.permissao, data: false, 
                mensagem: "Não foi possível alterar dados. Favor verificar os campos preenchidos e tentar novamente"});
        });
    },

    async excluir(req,res){
        var id = { "_id": req.params.id}
        itens.deleteOne(id)
        .then(function(result){
            res.render('itemConsulta.ejs', {permissao: req.user.permissao, data: false, 
                mensagem: "Item excluído com sucesso"
            })
        }).catch((err) => {
            console.log(err)
            res.render('itemConsulta.ejs', {permissao: req.user.permissao, data: false, 
                mensagem: "Falha ao excluir item, favor tentar novamente"
            });
        })
    },

    async ajaxConsultar(req, res){
        var busca = {   "item": RegExp(req.query.item , 'i'),
                        "tipo": RegExp(req.query.tipo, 'i'),
                        "tema": RegExp(req.query.tema, 'i'),
                        "_visible": true
                    }
        itens.find(busca).limit(3)
        .then(function(result){
            res.render('../views/ajax/festaItens.ejs', {data: result})
        }).catch((err) => {
            return console.log(err)
        }); 
    }
}