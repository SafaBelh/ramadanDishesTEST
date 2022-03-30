let express = require("express");
let router = express.Router();
let fetch = require("node-fetch");
let fs = require("fs");
// Importing Functions // 
let handleCookTime = require("../utils/cookTimeFunction");
let handleCooktimeDisplay = require("../utils/displayCookTimeFunction");
router.use(express.json());

let hijriYear = new Date().getFullYear() - 579;
let api_url = `http://api.aladhan.com/v1/hijriCalendar?latitude=51.508515&longitude=-0.1254872&method=2&month=9&year=${hijriYear}`;
let dishesList = JSON.parse(fs.readFileSync("./dev-data/dishes.json"));

// Suggest Dish Randomly Function //
let Max = dishesList.length;
function generateRandom(min = 0, max = Max) {
  let difference = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
}
let suggestedDish = dishesList[generateRandom()];

// Fetching Api Date Function
async function fetchData() {
  const response = await fetch(api_url);
  const days = await response.json();
  return days.data;
}
// Managing CookTime Function //
// const handleCookTime = (startDate, EndDate) => {
//   // Converting EndDate //
//   let endDateHrs = EndDate.split(":")[0];
//   let endDateMin = EndDate.split(":")[1].split(" ")[0];
//   let endDateInMins = Number(endDateHrs) * 60 + Number(endDateMin);
//   // Converting StartDate //
//   let startDateHrs = startDate.split(":")[0];
//   let startDateMin = startDate.split(":")[1].split(" ")[0];
//   let startDateInMins = Number(startDateHrs) * 60 + Number(startDateMin);
//   // Calculating Available Time ( between Asr nd Maghrib Prayer )
//   let availableTime = endDateInMins - startDateInMins;
//   return availableTime;
// };
// // Managing CookTime's Response Function //
// const handleCooktimeDisplay = (dishDuration, availableTime, dish) => {
//   if (dishDuration > availableTime - 15) {
//     let minsBeforeAsr = dishDuration - availableTime;
//     cookTime = `${minsBeforeAsr} mins Before Asr .`;
//     dish.cookTime = cookTime;
//     delete dish.duration;
//   } else if (dishDuration == availableTime - 15) {
//     let cookTime = "";
//     let minsBeforeAsr = dishDuration - availableTime;
//     cookTime = `${minsBeforeAsr} mins Before Asr .`;
//     dish.cookTime = cookTime;
//     delete dish.duration;
//   } else if (dishDuration < availableTime - 15) {
//     let cookTime = "";
//     let minsAfterAsr = availableTime - 15 - dishDuration;
//     cookTime = `${minsAfterAsr} mins After Asr .`;
//     dish.cookTime = cookTime;
//     delete dish.duration;
//   }
//   return dish;
// };
router.get("/", async (req, res) => {
  let userday = req.query.day;
  let array = await fetchData();
  let daySalatTiming = array[userday];
  let endDate = await daySalatTiming.timings.Maghrib;
  let startDate = await daySalatTiming.timings.Asr;

  handleCookTime(startDate, endDate);
  handleCooktimeDisplay(
    Number(suggestedDish.duration),
    handleCookTime(startDate, endDate),
    suggestedDish
  );

  res.send({
    state: "success",
    SuggDishes: suggestedDish,
  });
});

module.exports = router;
