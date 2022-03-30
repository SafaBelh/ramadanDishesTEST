module.exports = handleCookTime = (startDate, EndDate) => {
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

// export default handleCookTime;
