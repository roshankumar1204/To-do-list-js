const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js")
const _ =require("lodash");

const app = express();

//  var listitems  =[]
// var listitems =["eat","sleep","repeat"];            // storing locally
// var hustelitems=[];

mongoose.connect("mongodb://127.0.0.1/todolistDB", { useNewUrlParser: true });

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
    name: "welcome to do list !!!"
});
const item2 = new Item({
    name: "hit + to add item  !!!"
});
const item3 = new Item({
    name: "<---check the check box to delete  !!!"
});

var defaultItems = [item1, item2, item3];    // stored as array 

const listSchema = new mongoose.Schema({                            // new schema for custom list 
    name: String,
    item: [itemsSchema]                                             //linked with item schema // store array of item schema
});

const List = mongoose.model("List", listSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {



    Item.find().then((data) => {
        // console.log(data.name);
        if (data.length === 0) {
            Item.insertMany(defaultItems);   // used insert many to insert all items at once 
            res.redirect("/");
        }
        else {
            let day = date();
            res.render("list", { listTitle: day, newlists: data });
        }



        //        data.forEach(function(item){
        //          // mongoose.connection.close();
        //             // console.log(item);
        //             // listitems.push(item);

        //    });



    });


});

app.post("/", function (req, res) {
    let day = date();

    var listName = req.body.list; /// check the list in which you are adding

    var newTask = req.body.taskadded;

    console.log(req.body);
    const item = new Item({
        name: newTask
    });

    if (listName == day) {                                    //ading in default to do list 

        item.save();
        res.redirect("/");

    }
    else {                                 //adding in custom list 
        List.findOne({ name: listName }).then((docs) => {
            docs.item.push(item);
            docs.save();
            res.redirect("/" + listName);
        })

    }

});

app.listen(3000, function () {
    console.log("server running on 3000 ");
})
app.post("/delete", async (req, res) => {
    let day = date();

    var listName = req.body.listName;
    var checkedItemId = req.body.checkbox;
    console.log(checkedItemId);
    console.log(listName);



    if (listName == day) {
        const items = await Item.findByIdAndRemove(checkedItemId);
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { item: { _id: checkedItemId } } }).then((docs) => {
            // if (!docs) {
                res.redirect("/" + listName);
            // }

        });

    }
});

app.get("/:customListName", async (req, res) => {
  let  customlistname = _.capitalize(req.params.customListName);

    List.findOne({ name: customlistname }).then((docs) => {
        if (!docs) {

            const list = new List({
                name: customlistname,
                item: defaultItems
            });
            list.save();
            res.redirect("/" + customlistname);
        }
        else {

            res.render("list", { listTitle: docs.name, newlists: docs.item });
        }
    })



});



app.get("/about", function (req, res) {
    res.render("about");
})