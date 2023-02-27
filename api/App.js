//Lógica de Express aqui...
'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var cors = require('cors');
//cargar rutas
let user_routes = require('./routes/user');//.default;
let artist_routes = require('./routes/artist');
let album_routes = require('./routes/album');
let song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configurar cabeceras http
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API_KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Acces-Control-Allow-Method', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});
//carga de rutas base
app.use('/api', [user_routes, artist_routes, album_routes, song_routes]);
// app.get('/pruebas', function(req, res){
//     res.status(200).send({message:'Bienvenido al curso de VictorRobleweb.es'});
// })

module.exports = app;