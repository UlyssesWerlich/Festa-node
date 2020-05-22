module.exports = function enable (permissao) {  
    return function (req, res, next) {
        if (req.user.permissao[permissao]) 
            return next(); 
        else 
            res.render('index.ejs', {permissao: req.user.permissao, mensagem: "Sem permissao de acesso"})
    }
}
