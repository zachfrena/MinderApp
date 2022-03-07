var express = require('express')
var router = express.Router()
const db = require('../data/index')
let mysql = require('mysql')
let bodyparser = require('body-parser')
let app = express()
app.use(bodyparser.json())
let generateDates = require('../helper/generateDates')
let populateDaysArray = require('../helper/populateDaysArrays')

/* GET all reminders for specific date for a specific patient */
router.get('/getReminder', async function (req, res, next) {
  let { date, id } = req.query
  let sql =
    'SELECT * FROM REMINDER WHERE ReminderDate = ? AND PatientID = ? AND DELETED = 0'
  const results = await db.promise().query(sql, [date, id])
  res.status(200).json(results[0])
})

//  GET all data for either single or recurring reminders
router.get('/getReminderData', async function (req, res, next) {
  try {
    let { id } = req.query
    let sql = `
  SELECT * FROM RECURRINGREMINDER RR
  JOIN REMINDER R ON R.RecurringID = RR.RecurringID
  WHERE R.ReminderID = ?
  ORDER BY R.TimeOfDay;
  `
    const results = await db.promise().query(sql, [id])
    if (results[0].length === 0) {
      let sqlSequel = `
    SELECT * FROM REMINDER WHERE ReminderID = ?;
    `
      const resultsSequel = await db.promise().query(sqlSequel, [id])
      res.status(200).json(resultsSequel[0][0])
    } else {
      res.status(200).json(results[0][0])
    }
  } catch (err) {
    res.status(500).json({ error: err })
    console.log(err)
  }
})

/* GET all reminders for specific date for a specific caregiver */
router.get('/caregiverReminders', async function (req, res, next) {
  let { date, caregiverID } = req.query
  let sql = `
    SELECT * FROM REMINDER as r 
    LEFT JOIN CAREGIVER as c ON c.PatientID = r.PatientID
    WHERE c.CaregiverID=? 
    AND r.ReminderDate=? 
    AND r.Deleted=0
    ORDER BY r.TimeOfDay;
    `
  const results = await db.promise().query(sql, [caregiverID, date])
  res.status(200).json(results[0])
})

/* GET patientID as a caregiverID */
router.get('/getPatientID', async function (req, res, next) {
  let { caregiverID } = req.query
  let sql = 'SELECT PatientID FROM CAREGIVER WHERE CaregiverID = ?;'
  const results = await db.promise().query(sql, [caregiverID])
  res.status(200).json(results[0][0])
})

/* CREATE new reminder */
router.post('/newReminder', async function (req, res, next) {
  let reminder = await generateReminder(req)
  if (reminder.recurring === false) {
    await insertSingleReminder(reminder)
    res.status(200).send({ msg: 'added new one-off reminder' })
  } else {
    await insertRecurringReminder(reminder)
    let recIDSql = 'SELECT MAX((RecurringID)) FROM RECURRINGREMINDER'
    const recIDResults = await db.promise().query(recIDSql)
    let dates = generateDates(
      reminder.startDate,
      reminder.endDate,
      populateDaysArray(reminder)
    ).map(m => m.format('YYYY-MM-DD'))
    for (let date of dates) {
      insertMultiReminder(
        reminder,
        date,
        recIDResults[0][0]['MAX((RecurringID))']
      )
    }
    res.status(200).send({ msg: 'added new recurring reminder' })
  }
})

//helper function to insert single reminder into reminderTable in DB
async function insertSingleReminder (reminder) {
  let sql = `
      INSERT INTO REMINDER (
      PatientID, 
      ReminderTitle,
      ReminderContent,
      ReminderDate,
      TimeOfDay,
      RecurringID,
      ReminderType
      )
    VALUES(?, ?, ?, ?, ?, ?, ?)`

  const results = await db
    .promise()
    .query(sql, [
      reminder.patientID,
      reminder.title,
      reminder.description,
      reminder.startDate,
      reminder.time,
      null,
      reminder.reminderType
    ])
}

//helper function to insert recurring reminder into recurringReminder Table in DB
async function insertRecurringReminder (reminder) {
  let reqSql = `
        INSERT INTO RECURRINGREMINDER(
        PatientID, 
        StartDate, 
        EndDate, 
        Monday, 
        Tuesday, 
        Wednesday, 
        Thursday, 
        Friday, 
        Saturday, 
        Sunday) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const results = await db
    .promise()
    .query(reqSql, [
      reminder.patientID,
      reminder.startDate,
      reminder.endDate,
      reminder.recurringDates.mondays,
      reminder.recurringDates.tuesdays,
      reminder.recurringDates.wednesdays,
      reminder.recurringDates.thursdays,
      reminder.recurringDates.fridays,
      reminder.recurringDates.saturdays,
      reminder.recurringDates.sundays
    ])
}

//helper function to insert single reminder into DB
async function insertMultiReminder (reminder, date, recurringID) {
  console.log('CALLING INSERT MUILTI REMINDER')
  let sql = `
      INSERT INTO REMINDER (
      PatientID, 
      ReminderTitle,
      ReminderContent,
      ReminderDate,
      TimeOfDay,
      RecurringID,
      ReminderType
      )
    VALUES(?, ?, ?, ?, ?, ?, ?)`

  const results = await db
    .promise()
    .query(sql, [
      reminder.patientID,
      reminder.title,
      reminder.description,
      date,
      reminder.time,
      recurringID,
      reminder.reminderType
    ])
}

const generateReminder = async req => {
  return {
    reminderID: null,
    description: req.body.description,
    endDate: req.body.endDate,
    patientID: req.body.patientID,
    recurring: req.body.recurring,
    recurringDates: {
      fridays: req.body.recurringDates.fridays,
      mondays: req.body.recurringDates.mondays,
      saturdays: req.body.recurringDates.saturdays,
      sundays: req.body.recurringDates.sundays,
      thursdays: req.body.recurringDates.thursdays,
      tuesdays: req.body.recurringDates.tuesdays,
      wednesdays: req.body.recurringDates.wednesdays
    },
    reminderType: req.body.reminderType,
    startDate: req.body.startDate,
    time: req.body.time,
    title: req.body.title
  }
}

router.put('/deleteSingleReminder', async function (req, res, next) {
  let { reminderID } = req.query
  let sql = 'UPDATE REMINDER SET Deleted = 1 WHERE ReminderID = ?'
  const results = await db.promise().query(sql, [reminderID])
  res.status(200).send({ msg: 'deleted single reminder' })
})

router.put('/deleteRecurringReminder', async function (req, res, next) {
  let { reminderID } = req.query
  let sql = `
  UPDATE REMINDER AS A, 
  (SELECT RecurringID FROM REMINDER WHERE ReminderID = ?) AS B
  SET A.Deleted = 1
  WHERE A.RecurringID = B.RecurringID;
`
  // let sql = 'UPDATE REMINDER SET Deleted = 1 WHERE RecurringID = ?';
  const results = await db.promise().query(sql, [reminderID])
  console.log(results)
  res.status(200).send({ msg: 'deleted recurring reminder' })
})

/* ACCEPT a particular reminder */
router.put('/accept', async function (req, res, next) {
  let { PatientID, ReminderID } = req.query
  let sql =
    'UPDATE REMINDER SET Dismissed = 1 WHERE PatientID = ? AND ReminderID = ?'
  const results = await db.promise().query(sql, [PatientID, ReminderID])
  console.log(results[0])
  res.status(200).json(results[0])
})

/* UPDATE expo token */
router.put('/updateToken', async function (req, res, next) {
  let { token, uid } = req.query
  let sql = 'UPDATE APPUSER SET ExpoToken = ? WHERE UID = ?'
  const results = await db.promise().query(sql, [token, uid])
  console.log(results[0])
  res.status(200).json(results[0])
})

module.exports = router
