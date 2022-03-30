let express = require("express");
let fetch = require("node-fetch");
let router = express.Router();
let fs = require("fs");
router.use(express.json());
// Importing Functions //
let handleCookTime = require("../utils/cookTimeFunction");
let handleCooktimeDisplay = require("../utils/displayCookTimeFunction");

let hijriYear = new Date().getFullYear() - 579;
let api_url = `http://api.aladhan.com/v1/hijriCalendar?latitude=51.508515&longitude=-0.1254872&method=2&month=9&year=${hijriYear}`;
let dishesList = JSON.parse(fs.readFileSync("./dev-data/dishes.json"));

// Fetching Days Function
async function fetchData() {
  const response = await fetch(api_url);
  const days = await response.json();
  return days.data;
}

router.get("/", async (req, res) => {
  // Start Returning List Of Dishes That Includes The User's Passed Ingredient //
  let suggDishes = [];
  let userIngredient =
    req.query.ingredient[0].toUpperCase() + req.query.ingredient.slice(1);
  dishesList.forEach((dish) => {
    if (dish.ingredients.includes(userIngredient)) {
      suggDishes = [...suggDishes, dish];
      return suggDishes;
    }
  });
  /// End Returning List Of Dishes That Includes The User's Passed Ingredient ///
  // Start Functions //
  const handleCookTime = (startDate, EndDate) => {
    // Converting EndDate //
    let endDateHrs = EndDate.split(":")[0];
    let endDateMin = EndDate.split(":")[1].split(" ")[0];
    let endDateInMins = Number(endDateHrs) * 60 + Number(endDateMin);
    // Converting StartDate //
    let startDateHrs = startDate.split(":")[0];
    let startDateMin = startDate.split(":")[1].split(" ")[0];
    let startDateInMins = Number(startDateHrs) * 60 + Number(startDateMin);
    // Calculating Available Time ( between Asr nd Maghrib Prayer )
    let availableTime = endDateInMins - startDateInMins;
    return availableTime;
  };
  const handleCooktimeDisplay = (dishDuration, availableTime, dish) => {
    if (dishDuration > availableTime - 15) {
      let minsBeforeAsr = dishDuration - availableTime;
      cookTime = `${minsBeforeAsr} mins Before Asr .`;
      dish.cookTime = cookTime;
      delete dish.duration;
    } else if (dishDuration == availableTime - 15) {
      let cookTime = "";
      let minsBeforeAsr = dishDuration - availableTime;
      cookTime = `${minsBeforeAsr} mins Before Asr .`;
      dish.cookTime = cookTime;
      delete dish.duration;
    } else if (dishDuration < availableTime - 15) {
      let cookTime = "";
      let minsAfterAsr = availableTime - 15 - dishDuration;
      cookTime = `${minsAfterAsr} mins After Asr .`;
      dish.cookTime = cookTime;
      delete dish.duration;
    }
    return dish;
  };

  /// Start Checking  Available Time To Cook  ///
  let userday = req.query.day;
  let array = await fetchData();
  let daySalatTiming = array[userday - 1];
  let endDate = await daySalatTiming.timings.Maghrib;
  let startDate = await daySalatTiming.timings.Asr;
  /// End Checking  Available Time To Cook  ///

  ///  Start Adding CookTime To Each Dish   ///
  suggDishes.forEach((dish) => {
    handleCooktimeDisplay(
      Number(dish.duration),
      handleCookTime(startDate, endDate),
      dish
    );
  });
  ///  End Adding CookTime To Each Dish   ///

  res.send({
    state: "success",
    SuggDishes: suggDishes,
  });
});

module.exports = router;
