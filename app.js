const https = require("https");
let express = require("express");
let app = express();
let fs = require("fs");
const fetch = require("node-fetch");

let suggestDish = require("./routes/suggestDish");
let getRamadanDay = require("./routes/cookTime");

app.use(express.json());

let dishesList = JSON.parse(fs.readFileSync("./dev-data/dishes.json"));
// console.log(dishesList);

app.use("/api/suggest", suggestDish);
app.use("/api/cooktime", getRamadanDay);

////////////////////////// Running Server ///////////////////
app.listen(3000, () => {
  console.log("Server is listening on Port 3000 .... ");
});
