const https = require("https");
let moment = require("moment");
let express = require("express");
const fetch = require("node-fetch");
let router = express.Router();
let fs = require("fs");
router.use(express.json());

let year = 1443;
let api_url = `http://api.aladhan.com/v1/hijriCalendar?latitude=51.508515&longitude=-0.1254872&method=2&month=9&year=${year}`;
let dishesList = JSON.parse(fs.readFileSync("./dev-data/dishes.json"));

async function fetchData() {
  const response = await fetch(api_url);
  const days = await response.json();
  console.log(days.data);
  return days.data;
}

router.get("/", async (req, res) => {
  /// Start Getting Dishes With Specific Ingredient ///
  let suggDishes = [];
  let userIngredient =
    req.query.ingredient[0].toUpperCase() + req.query.ingredient.slice(1);

  dishesList.forEach((dish) => {
    if (dish.ingredients.includes(userIngredient)) {
      console.log(dish);
      suggDishes = [...suggDishes, dish];
      return suggDishes;
    }
  });
  /// End Getting Dishes With Specific Ingredient ///

  /// Start Checking  Available Time To Cook  ///
  let userday = req.query.day;
  let array = await fetchData();
  let daySalatTiming = array[userday - 1];
  let endDate = await daySalatTiming.timings.Maghrib;
  let endDateHrs = endDate.split(":")[0];
  let endDateMin = endDate.split(":")[1].split(" ")[0];
  let endDateInMins = Number(endDateHrs) * 60 + Number(endDateMin);
  let startDate = await daySalatTiming.timings.Asr;
  let startDateHrs = startDate.split(":")[0];
  let startDateMin = startDate.split(":")[1].split(" ")[0];
  let startDateInMins = Number(startDateHrs) * 60 + Number(startDateMin);
  let availableTime = endDateInMins - startDateInMins;
  /// StEnd art Checking  Available Time To Cook  ///
  ///  Start Adding CookTime To Each Dish   ///
  suggDishes.forEach((dish) => {
    if (Number(dish.duration) > availableTime - 15) {
      let minsBeforeAsr = Number(dish.duration) - availableTime;
      cookTime = `${minsBeforeAsr} mins Before Asr .`;
      dish.cookTime = cookTime;
      delete dish.duration;
    } else if (Number(dish.duration) == availableTime - 15) {
      let cookTime = "";
      let minsBeforeAsr = Number(dish.duration) - availableTime;
      cookTime = `${minsBeforeAsr} mins Before Asr .`;
      dish.cookTime = cookTime;
      delete dish.duration;
    } else if (Number(dish.duration) < availableTime - 15) {
      let cookTime = "";
      let minsAfterAsr = availableTime - 15 - Number(dish.duration);
      cookTime = `${minsAfterAsr} mins After Asr .`;
      dish.cookTime = cookTime;
      delete dish.duration;
    }
  });
  ///  End Adding CookTime To Each Dish   ///

  res.send({
    state: "success",
    availableTime: availableTime,
    SuggDishes: suggDishes,
  });
});

module.exports = router;
