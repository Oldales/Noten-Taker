
// DEPENDENCIES
const express = require("express");
const fs = require("fs");
const path = require("path");


// EXPRESS CONFIGURATION

// This sets up the basic properties for our express server
// Tells node that we are creating an "express" server
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Serve a public folder
app.use(express.static("public"));

let notes = [];
let id;

//Storing read/write Note variables to make it easier to reference later on
const readNotes = () => {
    fs.readFile(__dirname + "/db/db.json", (err, response) => {
        if (err) throw err;
        notes = JSON.parse(response); 
    });
};

const writeNotes = () => {
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err; 
    });
};


// HTML ROUTER

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});



app.get("/api/notes", (req, res) => {
    readNotes();
    
    res.json(notes);
});


app.post("/api/notes", (req, res) => {

    //Allows for unique ID's
    newNote = req.body;
    id = notes.length + 1;
    newNote.id = id++;

    notes.push(newNote);

    writeNotes();
    console.log("Note written to db.json");

    res.json(notes);

});


    // Stores the Id parameter from the API
    app.delete("/api/notes/:id", (req, res) => {
        var chosenId = parseInt(req.params.id);
        let foundNote = notes.find(note => note.id === chosenId);

        notes.splice(notes.indexOf(foundNote), 1);

        writeNotes();
        console.log("Note deleted from db.json");

        readNotes();

        res.json(foundNote);
    })

    
  

    app.listen(PORT, function () {
        console.log("App is listening on PORT: " + PORT);
    });