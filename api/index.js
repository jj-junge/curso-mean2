'use strict'

let mongoose = require('mongoose');
let app = require('./app');
let port = process.env.port || 3977;

mongoose.set('strictQuery', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/curso_mean2', (err, res) => {
    if (err) {
        console.log("Error al conectar DB");
        throw err;
    } else {
        console.log("La conexion a la Base de datos está funcionando correctamente...");
        app.listen(port, function () {
            console.log("Servidor del api de música escuchando en http://localhost:", port);
        });
    }
});
