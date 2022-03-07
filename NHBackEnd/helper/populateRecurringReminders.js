const db = require('../data/index')
let mysql = require('mysql')
let generateDates = require('../helper/generateDates')
let populateDaysArray = require('../helper/populateDaysArrays')

let ReminderArray = [
  {
    description: 'Eat Dinner',
    endDate: '2022-03-25',
    patientID: 3,
    recurring: false,
    recurringDates: {
      fridays: 1,
      mondays: 1,
      saturdays: 1,
      sundays: 1,
      thursdays: 1,
      tuesdays: 1,
      wednesdays: 1
    },
    reminderType: 'diet',
    startDate: '2022-03-02',
    time: '18:00',
    title: 'Eat Dinner'
  },
  {
    description: 'Eat Lunch',
    endDate: '2022-03-25',
    patientID: 3,
    recurring: true,
    recurringDates: {
      fridays: 1,
      mondays: 1,
      saturdays: 1,
      sundays: 1,
      thursdays: 1,
      tuesdays: 1,
      wednesdays: 1
    },
    reminderType: 'diet',
    startDate: '2022-03-02',
    time: '12:00',
    title: 'Eat Lunch'
  },
  {
    description: 'Eat Dinner',
    endDate: '2022-03-25',
    patientID: 4,
    recurring: true,
    recurringDates: {
      fridays: 1,
      mondays: 1,
      saturdays: 1,
      sundays: 1,
      thursdays: 1,
      tuesdays: 1,
      wednesdays: 1
    },
    reminderType: 'diet',
    startDate: '2022-03-02',
    time: '18:00',
    title: 'Eat Dinner'
  },
  {
    description: 'test PM Pills',
    endDate: null,
    patientID: 3,
    recurring: false,
    recurringDates: {
      fridays: 0,
      mondays: 0,
      saturdays: 0,
      sundays: 0,
      thursdays: 0,
      tuesdays: 0,
      wednesdays: 0
    },
    reminderType: 'medication',
    startDate: '2022-03-02',
    time: '16:00',
    title: 'Take PM Pills'
  },
  {
    description: 'test AM Pills',
    endDate: null,
    patientID: 3,
    recurring: false,
    recurringDates: {
      fridays: 0,
      mondays: 0,
      saturdays: 0,
      sundays: 0,
      thursdays: 0,
      tuesdays: 0,
      wednesdays: 0
    },
    reminderType: 'medication',
    startDate: '2022-03-02',
    time: '16:00',
    title: 'Take AM Pills'
  },
  {
    description: 'Go For A Walk',
    endDate: '2022-03-30',
    patientID: 3,
    recurring: true,
    recurringDates: {
      fridays: 1,
      mondays: 1,
      saturdays: 0,
      sundays: 0,
      thursdays: 0,
      tuesdays: 0,
      wednesdays: 1
    },
    reminderType: 'exercise',
    startDate: '2022-03-02',
    time: '12:00',
    title: 'Go For A Walk'
  },
  {
    description: 'Doctor Appointment',
    endDate: '2022-03-15',
    patientID: 3,
    recurring: true,
    recurringDates: {
      fridays: 0,
      mondays: 0,
      saturdays: 0,
      sundays: 0,
      thursdays: 0,
      tuesdays: 1,
      wednesdays: 0
    },
    reminderType: 'appointment',
    startDate: '2022-03-02',
    time: '14:00',
    title: 'Doctor Appointment'
  }
]

const runScript = async () => {
  await dropTables()
  await createReminderTables()
  for (reminder of ReminderArray) createReminder(reminder)
  await updateDismissed()
}

const updateDismissed = async () => {
  let sql = `UPDATE REMINDER SET Dismissed = 1 WHERE ReminderDate < 2022-03-04`
  const results = await db.promise().query(sql)
}

const dropTables = async () => {
  let sql = `DROP TABLES IF EXISTS RECURRINGREMINDER, REMINDER`
  const results = await db.promise().query(sql)
}

const createReminderTables = async () => {
  let sql = `CREATE TABLE RECURRINGREMINDER (
        RecurringID integer auto_increment not null,
        PatientID integer not null,
        StartDate date not null,
        EndDate date not null,
        Monday boolean,
        Tuesday boolean,
        Wednesday boolean,
        Thursday boolean,
        Friday boolean,
        Saturday boolean,
        Sunday boolean,
        primary key(RecurringID),
        foreign key(PatientID) references DEPENDENT(PatientID)
    );`
  const results = await db.promise().query(sql)
  let sql2 = `CREATE TABLE REMINDER (
	ReminderID integer auto_increment not null,
    PatientID integer not null,
    ReminderTitle varchar(50) not null,
    ReminderContent varchar(100),
    ReminderDate date,
    TimeOfDay time, 
    Dismissed boolean default false, 
    ReminderCount integer not null default 0,
    RecurringID integer,
    Deleted boolean default false,
    ReminderType varchar(50),
    primary key(ReminderID),
    foreign key(PatientID) references DEPENDENT(PatientID)
);`
  const results2 = await db.promise().query(sql2)
}

const createReminder = async reminder => {
  if (reminder.recurring === false) {
    await insertSingleReminder(reminder)
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
  }

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
}

runScript()
