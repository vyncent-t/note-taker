const { json } = require("body-parser");
const express = require("express");
const path = require('path');
const fs = require('fs');
const app = express();
const db = require('./db/db.json');
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function fileMaker() {
    let reply = JSON.parse(fs.readFileSync(`${__dirname}/db/db.json`, "utf8"));
    return reply
    // the reply returned is an object because JSON.parse turns it into an object that needs to be turned into a string if it needs to be read using JSON.stringify
    // res.json returns it in an array?
}

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    let reply = fileMaker()
    console.log(reply)
    res.json(reply)
})

app.post('/api/notes', (req, res) => {
    console.log(`console log for the res.body - its an object : ${JSON.stringify(req.body)}`);
    //take the req and add it to the db

    let reply = fileMaker()
    const newID = reply.length;
    const newInput = Object.assign({ id: newID }, req.body);

    reply.push(newInput);
    console.log(`the console log reply: ${res.json(reply)}`)

    let newNote = JSON.stringify(reply)
    console.log(`the console log the req.body info after turning into a string: ${newNote}`)
    // creating a new file with the string req.body into the file contents
    let reqMain = fs.writeFile(`${__dirname}/db/db.json`, newNote, "utf8", (err) => {
        if (err) { console.log(err) } else { console.log("file made") }
    });
    // new file is made and now sent as the response when a post is called
    res.json(reqMain);

})

// only need to make it so the get will pull the data from the json and put it on the side and the post will add to the json

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})


app.listen(PORT, () => {
    console.log(`connected to port ${PORT}`)
})