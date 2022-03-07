const db = require('../data/index');
const sendPushNotification = require('./pushToken');

const getReminders = async () => {
  let sql = `
  SELECT * FROM REMINDER R
  JOIN APPUSER A ON R.PatientID = A.UID
  WHERE STR_TO_DATE(CONCAT(ReminderDate, ' ', TimeOfDay), '%Y-%m-%d %H:%i:%s') < NOW()
  AND Deleted = FALSE
  AND ReminderCount = 0;`;
  const results = await db.promise().query(sql);
  return results[0];
};

const incrementReminderCount = async (id) => {
  let sql = `
    UPDATE REMINDER
    SET ReminderCount = ReminderCount + 1
    WHERE ReminderId = ?;`;
  await db.promise().query(sql, [id]);
};

async function getRemindersForPatient() {
  result = await getReminders();

  for (let i = 0; i < result.length; i++) {
    await incrementReminderCount(result[i].ReminderID);
    await sendPushNotification(result[i]);
  }
  console.log('getRemindersForPatient done');
}

module.exports = getRemindersForPatient;
