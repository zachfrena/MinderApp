const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const cron = require('node-cron');
const moment = require('moment');

const getRemindersForPatient = require('./reminders');

cron.schedule('* * * * * *', function () {
  console.log('running a task every minute');
  getRemindersForPatient().then(() => {
    console.log('getRemindersForPatient ran');
  });
});
