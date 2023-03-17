const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname+"/date.js")

const app= express();
var listitems =["eat","sleep","repeat"];
var hustelitems=[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){

let day = date(); 
res.render("list",{listTitle:day,newlists:listitems})

});

app.post("/",function(req,res){

    let listitem =req.body.taskadded;
    console.log(req.body);
    if (req.body.list === "Hustel") {
        hustelitems.push(listitem);
        res.redirect("/hustel");
    }
    else{
    listitems.push(listitem);
    res.redirect("/");
    }
})

app.listen(3000, function(){
    console.log("server running on 3000 ");
})

app.get("/hustel",function(req,res){
    res.render("list",{listTitle:"Hustel",newlists:hustelitems})
})
app.get("/about",function(req,res){
    res.render("about");
})