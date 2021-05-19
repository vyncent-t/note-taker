const { json } = require("body-parser");
const express = require("express");
const path = require('path')
const app = express();
const db = require('./db/db.json')
// let options = {

// }
app.use(express.static("public", options));

app.listen(3000, () => {
    console.log("connected to port 3000")
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    res.json(db)
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})