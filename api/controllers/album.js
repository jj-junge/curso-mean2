('use strict')

let mongoosePaginate = require('mongoose-pagination');
let fs = require('fs');
let path = require('path');

let Album = require('../models/album');
let Artist = require('../models/artist');
let Song = require('../models/song');

//const { param } = require('../app');
//const { find } = require('../models/artist');


function saveAlbum(req, res) {
    //res.status(404).send({ message: "Prueba de Controlador de album con NodeJS y MongoDB" });
    let album = new Album();
    let params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion saveAlbum" });
        } else {
            if (!albumStored) {
                res.status(404).send({ message: "No se ha guardado el Album" });
            } else {
                res.status(200).send({ album: albumStored });
            }
        }
    });
}

function getAlbum(req, res) {
    let album_id = req.params.id;

    Album.findById(album_id).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion Cargar album" });
        } else {
            if (!album) {
                res.status(404).send({ message: "No existe el Album solicitado" });
            } else {
                res.status(200).send({ album });
            }
        }
    });
}

function getAlbums(req, res) {
    let artist_id = req.params.artist;
    let find;
    if (!artist_id) {
        //Sacar todos los albums de BD
        find = Album.find({}).sort('title');
    } else {
        //Sacar los albums del artista
        find = Album.find({ artist: artist_id }).sort('year');
    }

    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion Cargar albums" });
        } else {
            if (!albums) {
                res.status(404).send({ message: "No existen los Albums solicitados" });
            } else {
                res.status(200).send({ albums });
            }
        }
    });
}

function updateAlbum(req, res) {
    let album_id = req.params.id;
    let update = req.body;

    Album.findByIdAndUpdate(album_id, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion actulizar album" });
        } else {
            if (!albumUpdated) {
                res.status(404).send({ message: "No existe el Album solicitado" });
            } else {
                res.status(200).send({ albumUpdated });
            }
        }
    });
}

function deleteAlbum(req, res) {
    let album_id = req.params.id;
    Album.findByIdAndRemove(album_id, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion borrar album" });
        } else {
            if (!albumRemoved) {
                res.status(404).send({ message: "El album no ha sido eliminado" });
            }
            else {
                Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({ message: "error en la peticion borrar cancion" });
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({ message: "la cancion no ha sido eliminada" });
                        }
                        else {
                            res.status(200).send({ album: albumRemoved });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    let album_id = req.params.id;
    let file_Name = "no subido...";
    let filepath;

    if (req.files) {
        filepath = req.files.image.path;
        let fileSplit = filepath.split('\\');
        fileName = fileSplit[2];
        let extSplit = fileName.split('\.');
        let fileExt = extSplit[1];
        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
            Album.findByIdAndUpdate(album_id, { image: fileName }, (err, albumUpdated) => {
                if (!albumUpdated) {
                    res.status(404).send({ message: "No se ha podido actualizar el Artista" });
                } else {
                    res.status(200).send({
                        message: "Album Actualizado exitosamente",
                        album: albumUpdated
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
    let imagePath = ('./uploads/albums/' + imageFile);

    fs.exists(imagePath, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(imagePath));
        } else {//
            res.status(404).send({ message: "El archivo no existe" });
        }
    });
}

module.exports = {
    saveAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImage
};