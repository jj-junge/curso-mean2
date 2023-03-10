'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: {type: Schema.ObjectId, ref:'Artist'}
});

module.exports = mongoose.model('Album', AlbumSchema);