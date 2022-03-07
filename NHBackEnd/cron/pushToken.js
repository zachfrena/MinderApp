const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const moment = require('moment');

async function sendPushNotification(reminderObject) {
  console.log('sendPushNotification', reminderObject);
  const message = {
    to: reminderObject.ExpoToken,
    sound: 'default',
    title: reminderObject.ReminderTitle,
    // body: reminderObject.ReminderContent,
    data: {
      reminderID: reminderObject.ReminderID,
      reminderType: reminderObject.ReminderType,
      reminderTime: moment(
        new Date(reminderObject.ReminderDate + ' ' + reminderObject.TimeOfDay)
      )
        .format('h:mm a')
        .toString(),
      reminderDate: reminderObject.ReminderDate,
    },
  };

  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  console.log(res);
}

module.exports = sendPushNotification;
