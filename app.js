//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

//Connect to database
mongoose.set("useFindAndModify",false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Successfully connected to database");
    app.listen(3000, () => console.log("Server is up and running on port 3000!"));
});

const app = express();

app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//view engine configuration
app.set("view engine","ejs");
//This urlencoded feature is used to retrieve the data from the server in the form of JSON data....
app.use(express.urlencoded({extended: true}));

//GET Method
app.get("/", (req, res) => {
    TodoTask.find({}, (err,tasks) => {
        res.render("todo.ejs",{ todoTasks: tasks});
    });
});

//POST Method
app.post("/",async (req, res) => {
    console.log(req.body);
    const toDoListItem = new TodoTask ({
        content: req.body.content
    });
    try {
        await toDoListItem.save();
        res.redirect("/");
    }
    catch(err) {
        console.error(err);
        res.redirect("/");
    }
});

//UPDATE method
app.route("/edit/:id")
.get((req,res) => {
    const id = req.params.id;
    TodoTask.find({}, (err,tasks) => {
        if(err) 
        {
            console.error(err);
            return res.send(500,err);
        } else
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
})
.post((req,res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if(err){
            console.error(err);
            return res.send(500, err);
        } 
        res.redirect("/");
    });
});

//DELETE method
app.route("/remove/:id").get((req,res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id,err => {
        if(err) {
            console.error(err);
            res.send(500, err);
        }
        res.redirect("/");
    });
});