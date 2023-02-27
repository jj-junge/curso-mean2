('use strict')
let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'clave_secreta_curso';
let payload

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: "La petición no tiene la cabecera de autenticación..." });
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: "El Token ha Expirado" });
        } else {

        }

    } catch (error) {
        //console.log(error);
        return res.status(404).send({ message: "Token No Válido" });
    }

    req.user = payload;

    next();

};