let express = require("express");
let router = express.Router();
const fetch = require("node-fetch");

let fs = require("fs");
router.use(express.json());
let year = 1443;
let api_url = `http://api.aladhan.com/v1/hijriCalendar?latitude=51.508515&longitude=-0.1254872&method=2&month=9&year=${year}`;
let dishesList = JSON.parse(fs.readFileSync("./dev-data/dishes.json"));

let Max = dishesList.length;
function generateRandom(min = 0, max = Max) {
  let difference = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
}

let suggestedDish = dishesList[generateRandom()];

async function fetchData() {
  const response = await fetch(api_url);
  const days = await response.json();
  console.log(days.data);
  return days.data;
}

router.get("/", async (req, res) => {
  /// Start Checking  Available Time To Cook  ///
  let userday = req.query.day;
  console.log(userday);
  let array = await fetchData();
  let daySalatTiming = array[userday];
  console.log(daySalatTiming);
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

  if (Number(suggestedDish.duration) > availableTime - 15) {
    let minsBeforeAsr = Number(suggestedDish.duration) - availableTime;
    cookTime = `${minsBeforeAsr} mins Before Asr .`;
    suggestedDish.cookTime = cookTime;
    // delete suggestedDish.duration;
  } else if (Number(suggestedDish.duration) == availableTime - 15) {
    let cookTime = "";
    let minsBeforeAsr = Number(suggestedDish.duration) - availableTime;
    cookTime = `${minsBeforeAsr} mins Before Asr .`;
    suggestedDish.cookTime = cookTime;
    // delete suggestedDish.duration;
  } else if (Number(suggestedDish.duration) < availableTime - 15) {
    let cookTime = "";
    let minsAfterAsr = availableTime - 15 - Number(suggestedDish.duration);
    cookTime = `${minsAfterAsr} mins After Asr .`;
    suggestedDish.cookTime = cookTime;
    // delete suggestedDish.duration;
  }

  ///  End Adding CookTime To Each Dish   ///
  res.send({
    state: "success",
    availableTime: availableTime,
    //   availableTime: availableTime,
    SuggDishes: suggestedDish,
  });
});

module.exports = router;
