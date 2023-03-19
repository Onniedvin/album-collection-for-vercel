const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { Album } = require('../models/Album')
const testAlbums = require('./testAlbums.json')

const api = supertest(app)

beforeEach(async () => {
    await Album.deleteMany({})
    await Album.create(testAlbums)
})

test('Correct number of albums in database', async () => {
    const response = await api.get('/api/albums')
    expect(response.body).toHaveLength(testAlbums.length)
})

test('Posting an album saves the album to the dabase', async () => {
    const newAlbum = {
        _id: "636906d66f24040e565b42e5",
        title: "testi5",
        artist: "testi5",
        year: 2000,
        tracks: 5
    }

    await api
        .post('/api/albums')
        .send(newAlbum)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/albums')
    expect(response.body).toHaveLength(testAlbums.length + 1)
    expect(response.body).toContainEqual(newAlbum)
})

test('Deletion of an album result in removing this album from the database', async () => {
    const album = testAlbums[0]

    await api
        .delete('/api/albums/' + album._id)
        .expect(200)

    const response = await api.get('/api/albums')
    expect(response.body).toHaveLength(testAlbums.length - 1)
    expect(response.body).not.toContainEqual(album)
})

afterAll(() => {
    mongoose.connection.close()
})