('use strict')

let mongoosePaginate = require('mongoose-pagination');
let fs = require('fs');
let path = require('path');

let Album = require('../models/album');
let Artist = require('../models/artist');
let Song = require('../models/song');
const { fileURLToPath } = require('url');

function getSong(req, res) {
    //res.status(200).send({ message: "Prueba de controlador de Cancion" });
    let song_id = req.params.id;
    console.log(song_id);
    if (song_id) {
        Song.findById(song_id).populate({ path: 'album' }).exec((err, song) => {
            if (err) {
                res.status(500).send({ message: "Error en la petición buscar cancion" });
            } else {
                if (!song) {
                    res.status(404).send({ message: "La cancion no existe" });
                } else {
                    res.status(200).send({ song });
                    console.log("La cancion esta aqui", song.file);
                }
            }
        });
    } else {
        res.status(404).send({ message: "Por favor Indique una cancion a consultar" });
    }

}
function getSongs(req, res) {
    let album_id = req.params.album;
    let song;
    console.log(req.params);
    if (!album_id) {
        song = Song.find({}).sort('number');
    } else {
        song = Song.find({ album: album_id }).sort('number');
    }

    song.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion listar canciones", err });
        } else {
            if (!songs) {
                res.status(404).send({ message: "No existen canciones" });
            } else {
                res.status(200).send({ songs });
            }
        }
    });
}

function saveSong(req, res) {
    let song = new Song();
    let data = req.body;

    song.number = data.number;
    song.name = data.name;
    song.duration = data.duration;
    song.file = 'null';
    song.album = data.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: "Error en la petición agregar cancion" });
        } else {
            if (!songStored) {
                res.status(404).send({ message: "No se pudo guardar la cancion" });
            } else {
                res.status(200).send({ song: songStored });
            }

        }
    });

}

function updateSong(req, res) {
    let song_id = req.params.id;
    let song = req.body;

    Song.findByIdAndUpdate(song_id, song, (err, songUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error al realizar la peticion actualizar cancion" });
        } else {
            if (!songUpdated) {
                res.status(404).send({ message: "Error al  actualizar cancion" });
            }
            else {
                res.status(200).send({ songUpdated });
            }
        }
    });
}

function deleteSong(req, res) {
    let song_id = req.params.id;
    Song.findByIdAndRemove(song_id, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion borrar cancion" });
        } else {
            if (!songRemoved) {
                res.status(404).send({ message: "la cancion no ha sido eliminada" });
            }
            else {
                res.status(200).send({ songRemoved });
            }
        }
    });
}

function uploadSong(req, res) {
    let song_id = req.params.id;
    let fileName = "no subido...";
    let filepath;

    if (req.files) {
        filepath = req.files.file.path;
        let fileSplit = filepath.split('\\');
        fileName = fileSplit[2];
        let extSplit = fileName.split('\.');
        let fileExt = extSplit[1];
        if (fileExt == 'mp3' || fileExt == 'wma') {
            Song.findByIdAndUpdate(song_id, { file: fileName }, (err, songUpdated) => {
                if (!songUpdated) {
                    res.status(404).send({ message: "No se ha podido actualizar la cancion" });
                } else {
                    res.status(200).send({
                        message: "Cancion agregada exitosamente",
                        song: { songUpdated }
                    });
                }
            });
        } else {
            res.status(404).send({ message: "Archivo Inválido" });
        }
        console.log();
    } else {
        res.status(404).send({ message: "No ha subido ninguna cancion" });
    }
}

function getFileSong(req, res) {
    let song_File = req.params.songFile;
    let songPath = ('./uploads/songs/' + song_File);

    fs.exists(songPath, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(songPath));
        } else {//
            res.status(404).send({ message: "El archivo no existe" });
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadSong,
    getFileSong
};