'use strict'
let fs = require('fs');
let path = require('path');
let User = require('../models/user');
let bcrypt = require('bcrypt-nodejs');
let jwt = require('../services/jwt');

function pruebas(req, res) {

    res.status(200).send({
        message: "Probando acción del controlador de usuarios del api rest con Node y MongoDB"
    });
}

function saveUser(req, res) {
    let user = new User();

    let params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        //encriptar la contraseña
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if ((user.name) && (user.surname) && (user.email)) {
                //guardamos el usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: "Error al guardar el usuario" });
                    } else {
                        if (!userStored) {
                            res.status(404).send({ message: "no se ha registrado el usuario" });
                        } else {
                            console.log("password:", user.password);
                            res.status(200).send({ user: userStored });
                            console.log(userStored);
                        }
                    }
                });
            } else {
                res.status(200).send({ message: "Rellena todos campos" });
            }
        });
    } else {
        res.status(200).send({
            message: 'Por favor ingresa la contraseña'
        });
    }
}

function loginUser(req, res) {
    let params = req.body;
    let email = params.email;
    let password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error en la petición" });
        } else {
            if (!user) {
                res.status(404).send({ message: "El usuario no existe aquii" });
            } else {
                //comprobar contraseña
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        //devolver los datos del usuario logeado
                        if (params.gethash) {
                            //devolver un token de JWT
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(404).send({ message: "Usuario o Clave errados" });
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error al actualizar el usuario" });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: "No se ha podido actualizar el usuario" });
            } else {
                res.status(200).send({
                    message: "usuario Actualizado exitosamente",
                    user: userUpdated
                });
            }
        }
    });
}

function uploadImage(req, res) {
    let userId = req.params.id;
    let fileName = 'No Subido...';
    let filepath;

    if (req.files) {
        filepath = req.files.image.path;
        let fileSplit = filepath.split('\\');
        fileName = fileSplit[2];
        let extSplit = fileName.split('\.');
        let fileExt = extSplit[1];
        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
            User.findByIdAndUpdate(userId, { image: fileName }, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({ message: "No se ha podido actualizar el usuario" });
                } else {
                    res.status(200).send({
                        message: "usuario Actualizado exitosamente",
                        image: fileName,
                        user: userUpdated
                    });
                }
            });
        } else {
            res.status(404).send({ message: "Archivo Inválido" });
        }
        console.log();
    } else {
        res.status(404).send({ message: "No ha subido ninguna imagen" });
    }
}

function getImage(req, res) {
    let imageFile = req.params.imageFile;
    let imagePath = ('./uploads/users/' + imageFile);

    fs.exists(imagePath, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(imagePath));
        } else {
            res.status(404).send({ message: "El archivo no existe" });
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImage
};