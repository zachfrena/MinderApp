const moment = require('moment');
const db = require('../data/index');

const generateSingleDate = (start, end, day) => {
  var result = [];
  var current = moment(start);
  while (current.day(day).isBefore(end)) {
    if (current.day(day).isSameOrAfter(start)) {
      result.push(current.clone().day(day));
    }
    current.day(7 + day);
  }
  return result;
};

// where sunday is 0 and saturday is 6
const generateDates = (start, end, days) => {
  var result = [];
  console.log(days);
  for (let weekday of days) {
    generateSingleDate(start, end, weekday).forEach((date) => {
      result.push(date);
    });
  }
  return result;
};

module.exports = generateDates;
