const bcrypt = require('bcryptjs')  
const LocalStrategy = require('passport-local').Strategy
const users = require('../database/usersSchema');

module.exports = function(passport){
   //configuraremos o passport aqui
    function findUser(login, callback){
        users.findOne({"login": login}, function(err, doc){
            callback(err, doc);
        });
    }
    
    function findUserById(id, callback){
        const ObjectId = require("mongodb").ObjectId;
        users.findOne({_id: ObjectId(id) }, (err, doc) => {
            callback(err, doc);
        });
    }

    passport.serializeUser(function(user, done){
        done(null,user._id);
    });

    passport.deserializeUser(function(id, done){
        findUserById(id, function(err,user){
            done(err, user);
        });
    });

    passport.use(new LocalStrategy( { 
            usernameField: 'login',
            passwordField: 'senha'
        },
        (username, password, done) => {
        findUser(username, (err, user) => {
          if (err) { return done(err) }
          if (!user) { return done(null, false) } // usuário inexistente
    
          bcrypt.compare(password, user.senha, (err, isValid) => { // comparando as senhas
            if (err) { return done(err) }
            if (!isValid) { return done(null, false) }
            return done(null, user)
          })
        })
      }
    ));
}