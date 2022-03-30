module.exports = handleCooktimeDisplay = (
  dishDuration,
  availableTime,
  dish
) => {
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
// export default handleCooktimeDisplay;
