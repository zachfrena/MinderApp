// console.log(new Date('2022-02-27').getUTCDay());
const moment = require('moment');

const generateSingleDate = (start, end, day) => {
  var result = [];
  var current = moment(start);

  while (current.day(7 + day).isBefore(end)) {
    result.push(current.clone());
  }

  //   return result.map((m) => m.format('LLLL'));
  return result;
};

const generateDates = (start, end, days) => {
  var result = [];
  for (let weekday of days) {
    generateSingleDate(start, end, weekday).forEach((date) => {
      result.push(date);
    });
  }
  return result;
};

console.log(
  generateDates('2022-02-01', '2022-02-25', [0, 1]).map((m) => m.format('LLLL'))
);

const generateReminder = () => {
  return {
    reminderID: null,
    description: null,
    endDate: null,
    patientID: null,
    recurring: false,
    recurringDates: {
      fridays: false,
      mondays: false,
      saturdays: false,
      sundays: false,
      thursdays: false,
      tuesdays: false,
      wednesdays: false,
    },
    reminderType: 'Other',
    startDate: '',
    time: '',
    title: '',
  };
};

console.log(generateReminder());
