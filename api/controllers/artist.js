('use strict')

let mongoosePaginate = require('mongoose-pagination');
let fs = require('fs');
let path = require('path');

let Artist = require('../models/artist');
let Album = require('../models/album');
let Song = require('../models/song');


function getArtist(req, res) {
    let artist_id = req.params.id;

    Artist.findById(artist_id, (err, artist) => {
        if (err) {
            res.status(404).send({ message: "El Artista no existe" });
        } else {
            res.status(200).send({ artist });
        }
    });
    //res.status(200).send({ message: "Método getArtist del controlador artist.js" });
}

function saveArtist(req, res) {
    let artist = new Artist();

    let params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: "error al guardar el artista" });
        } else {
            if (!artistStored) {
                res.status(404).send({ message: "El artista no ha sido guardado" });
            } else {
                res.status(200).send({
                    message: "Artista Creado Satisfactoriamente",
                    artist: artistStored
                });
            }
        }
    });
}

function getArtists(req, res) {
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    let itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion" });
        } else {
            if (!artists) {
                res.status(404).send({ message: "No hay Artistas" });
            } else {
                return res.status(200).send({
                    Total_Items: total,
                    artists: artists
                });
            }
        }
    });
}

function updateArtist(req, res) {
    let artist_id = req.params.id;
    let update = req.body;
    Artist.findByIdAndUpdate(artist_id, update, (err, ArtistUpdated) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion" });
        } else {
            if (!ArtistUpdated) {
                res.status(404).send({ message: "El artista no ha sido actualizado" });
            }
            else {
                res.status(200).send({ artist: ArtistUpdated });
            }
        }
    });
}

function deleteArtist(req, res) {
    let artist_id = req.params.id;
    //console.log("El id q llega: ", req.params.id);

    Artist.deleteOne({ _id: artist_id }, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion" });
            console.log("Error: ", err);
        } else {
            if (!artistRemoved) {
                res.status(404).send({ message: "El artista no ha sido eliminado" });
            }
            else {
                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
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
                                        res.status(200).send({ artist: artistRemoved });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    let artist_id = req.params.id;
    let file_name = "no subido...";
    let filepath;

    if (req.files) {
        filepath = req.files.image.path;
        let fileSplit = filepath.split('\\');
        fileName = fileSplit[2];
        let extSplit = fileName.split('\.');
        let fileExt = extSplit[1];
        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
            Artist.findByIdAndUpdate(artist_id, { image: fileName }, (err, artistUpdated) => {
                if (!artistUpdated) {
                    res.status(404).send({ message: "No se ha podido actualizar el Artista" });
                } else {
                    res.status(200).send({
                        message: "Artist Actualizado exitosamente",
                        artist: artistUpdated
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
    let imagePath = ('./uploads/artists/' + imageFile);

    fs.exists(imagePath, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(imagePath));
        } else {//
            res.status(404).send({ message: "El archivo no existe" });
        }
    });
}


module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImage
}
