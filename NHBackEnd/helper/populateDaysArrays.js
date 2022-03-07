const populateDaysArray = (reminder) => {
  let results = [];
  if (reminder.recurringDates.sundays) results.push(0);
  if (reminder.recurringDates.mondays) results.push(1);
  if (reminder.recurringDates.tuesdays) results.push(2);
  if (reminder.recurringDates.wednesdays) results.push(3);
  if (reminder.recurringDates.thursdays) results.push(4);
  if (reminder.recurringDates.fridays) results.push(5);
  if (reminder.recurringDates.saturdays) results.push(6);
  return results;
};

module.exports = populateDaysArray;
