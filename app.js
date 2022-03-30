
let express = require("express");
let app = express();
const fetch = require("node-fetch");

// Importing Routes 
let suggestDish = require("./routes/suggestDish");
let getRamadanDay = require("./routes/cookTime");

app.use(express.json());


app.use("/api/suggest", suggestDish);
app.use("/api/cooktime", getRamadanDay);

// Running Server //
app.listen(3000, () => {
  console.log("Server is listening on Port 3000 .... ");
});
