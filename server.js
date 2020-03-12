const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const objectId = require('mongodb').objectId
/*const uri = ""

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client('bancoDeDados')

    app.listen( 3000, () =>{
        console.log('Servidor rodando na porta 3000')
    })
})*/

app.listen( 3000, () =>{
    console.log('Servidor rodando na porta 3000')
})

app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
    res.render('index.ejs')
})

app.get('/produtoCadastro', (req, res) =>{
    res.render('produtoCadastro.ejs')
})

app.get('/produtoConsulta', (req, res) =>{
    res.render('produtoConsulta.ejs')
})

app.get('/clienteCadastro', (req, res) =>{
    res.render('clienteCadastro.ejs')
})

app.get('/clienteConsulta', (req, res) =>{
    res.render('clienteConsulta.ejs')
})

app.get('/festaCadastro', (req, res) =>{
    res.render('festaCadastro.ejs')
})

app.get('/festaConsulta', (req, res) =>{
    res.render('festaConsulta.ejs')
})

app.get('/agenda', (req, res) =>{
    res.render('agenda.ejs')
})