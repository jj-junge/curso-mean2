'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: {type: Schema.ObjectId, ref: 'Album'}
    
});

module.exports = mongoose.model('Song', SongSchema);