const mongoose = require("mongoose");

const AlbumSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Give a title"],
        },
        artist: {
            type: String,
            trim: true,
            required: [true, "Give an artist"],
        },
        year: {
            type: Number,
            min: [1899, "The album is too old"],
            max: [new Date().getFullYear(), "You can't create an album in the future"],
        },
        tracks: {
            type: Number,
            min: [1, "The album can't be empty"],
        },
    },
    {
        versionKey: false,
    }
);

const Album = mongoose.model("Album", AlbumSchema, "album_collection");

module.exports = {
    Album,
};