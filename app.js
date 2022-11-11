
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-binit:test123@cluster0.7rr9pwb.mongodb.net/todoListDB");

const itemsSchema = {
  name : String
};

const listSchema = {
  name : String,
  items : [itemsSchema]
}
const Item = mongoose.model("Item", itemsSchema);

const defaultItems = [];

app.get("/", function(req, res) {
  const day = date.getDate();  
  Item.find({},function(err,foundItems){
      res.render("list", {listTitle: day, newListItems: foundItems});
  })  
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const itemToAdd = new Item({
    name : itemName,
  })

  defaultItems.push(itemToAdd);
  itemToAdd.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  Item.findByIdAndRemove(req.body.checkbox,function(err){
    if (!err) {
      res.redirect("/");
    }
  })
})


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT ||  3000, function() {
  console.log("Server started on port 3000");
});
