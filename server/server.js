const express = require("express");
const cors = require('cors');
var multer = require('multer');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path')
var upload = multer();
//const userPAge = require('client/src/user.js');
const app = express();
const router = express.Router();

app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static(path.join(__dirname, 'notes/build')));

let ddjanjna = "dadajd";

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes/build', 'index.html'))
})


app.use(cors());

mongoose.connect("mongodb://localhost:27017/notesApp", {
    useNewUrlParser: true,
});

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    saved: {
        type: String,
        required: true
    }
})

//const notesModel = mongoose.model("notes", notesSchema)

app.get("/allNotes/:email", (req, res) => {
    const usersNotes = mongoose.model(`${req.params.email}`, notesSchema)

    usersNotes.find(function(err, notes) {
        if (err) {
            console.log(err)
        } else {
            res.json(notes)
        }
    })
})

app.post("/saveNote/:email/:title/:description", (req, res) => {
    const usersNotes = mongoose.model(`${req.params.email}`, notesSchema)

    let dateTime = new Date();
let hours = dateTime.getHours();
let minutes = dateTime.getMinutes();
let seconds = dateTime.getSeconds();

let amPm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12;

minutes = minutes < 10 ? '0'+minutes : minutes;
seconds = seconds < 10 ? '0'+seconds : seconds;

let dateString = `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime.getFullYear()} at ${hours}:${minutes} ${amPm}`;

    usersNotes.findOneAndUpdate({ title: req.params.title}, { description: req.params.description, saved: dateString}, function(err, success) {
        if (err) {
            console.log(err)
            res.send(err);
        } else {
            console.log("Updated");
            res.redirect("/")
        }
    })
})

app.post("/note/:email", (req, res) => {
    let dateTime = new Date();
let hours = dateTime.getHours();
let minutes = dateTime.getMinutes();
let seconds = dateTime.getSeconds();

let amPm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12;

minutes = minutes < 10 ? '0'+minutes : minutes;
seconds = seconds < 10 ? '0'+seconds : seconds;

let dateString = `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime.getFullYear()} at ${hours}:${minutes} ${amPm}`;
        res.redirect("/")
        const usersNotes = mongoose.model(`${req.params.email}`, notesSchema)
        usersNotes.create({
            title: req.body.title,
            description: req.body.desc,
            saved: dateString
        }, (err, note) => {
            if (err) {
                console.log("Error saving data")
            } else {
                console.log(note)
            }
        })

    /* let newNote = notesModel.create({
        title: "Test",
        description: "Just a test"
    })
    newNote.save()*/
})

app.post("/deleteNote/:email/:title", (req, res) => {
    const usersNotes = mongoose.model(`${req.params.email}`, notesSchema)
    usersNotes.findOneAndDelete({ title: req.params.title}, function(err, note) {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.redirect("/")
        }
    })
})

app.listen(process.env.PORT || 5000)

module.exports = app