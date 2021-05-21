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
    // console.log(reply)
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


app.delete('/api/notes/:id', (req, res) => {
    // return the array of obj json
    let reply = fileMaker();
    let noteID = req.params.id;
    console.log(noteID)
    // new array of all the notes but the one from the id param is not included - deleted
    let refReply = reply.filter(chosen => chosen.id !== noteID * 1)

    // need to take the array, select the one from the id param, splice it out

    let newRef = JSON.stringify(refReply)
    let refMain = fs.writeFile(`${__dirname}/db/db.json`, newRef, 'utf8', (err) => {
        if (err) { console.log(err) } else { console.log("note deleted") }
    })
    res.json(refMain);
})


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})


app.listen(PORT, () => {
    console.log(`connected to port ${PORT}`)
})