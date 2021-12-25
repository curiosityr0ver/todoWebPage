const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("css"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    name: String,

}

const Item = mongoose.model("Item", itemSchema);
const LeisureItem = mongoose.model("LeisureItem", itemSchema);

const running = new Item(
    {
        name: "Running"
    }
)

const eating = new Item(
    {
        name: "Eating"
    }
)
const shitting = new Item(
    {
        name: "Shitting"
    }
)


const defaultItems = [running, eating, shitting];

Item.count({}, function (err, count) {
    console.log(count);
    if (count == 0) {
        Item.insertMany(defaultItems, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("Successfully inserted.")
            }
        })
    }
})





app.get("/", function (req, res) {
    Item.find({}, function (err, foundItems) {
        res.render("list", {
            listTitle: date.getDay(), newListItem: foundItems
        })
    });
});


app.get("/:route", function (req, res) {
    var found;
    var listName = req.params.route;
    mongoose.modelNames().forEach(element => {
        console.log(element);
        if (element == listName) {
            found = true;
        }
    });

    if (found) {
        Item.find({}, function (err, foundItems) {
            res.render("list", {
                listTitle: req.params.route, newListItem: foundItems
            })
        });
    } else {
        res.send(listName)
    }  
})

app.get("/about", function (req, res) {
    res.render("about");
})

app.post("/", function (req, res) {
    if (req.body.newItem != "") {
        console.log(req.body)
        Item.create({
            name: req.body.newItem
        })
    }
    res.redirect("/");
})

app.post("/remove", function (req, res) {
    console.log(req.body.deleteButton)
    Item.findByIdAndRemove(req.body.deleteButton, function (err) {

    })
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("listening to port 3000");
})

