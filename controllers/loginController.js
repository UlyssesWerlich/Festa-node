const users = require('../database/usersSchema');

module.exports = {

    async login(req, res){
        var busca = { "login": req.body.login };
        users.findOne(busca).select('cpf nome login senha permissao')
        .then(function(result){
            if (result) {
                if (result.senha === req.body.senha){
                    res.render('index.ejs');
                } else {
                    res.render('login.ejs', {permissao: req.user.permissao, mensagem: true, conteudo: "Senha inválida, favor tentar novamente"});
                }
            } else {
                res.render('login.ejs', {permissao: req.user.permissao, mensagem: true, conteudo: "Usuário não encontrado, favor tentar novamente"});
            }
        }).catch((err) => {
            return console.log(err)
        }); 
    }
}