DROP DATABASE IF EXISTS NursingHackathon;
CREATE DATABASE NursingHackathon;
USE NursingHackathon;

DROP TABLE IF EXISTS APPUSER;
CREATE TABLE APPUSER (
	UID		integer auto_increment not null,
    Username varchar(50) not null unique,
    PWord	varchar(50) not null,
    FName	varchar(50) not null,
    LName varchar(50) not null,
    ExpoToken varchar(50) not null,
    primary key(UID)
);

INSERT INTO APPUSER(UID, Username, PWord, FName, LName, ExpoToken)
VALUES
(1, "zfrena", "password", "Zach", "Frena", "ExponentPushToken[mgjDOXKcDE3hvd5cGhZMc7]"),
(2, "dyiao", "password", "Deylin", "Yiao", "ExponentPushToken[mgjDOXKcDE3hvd5cGhZMc7]"),
(3, "ghall", "password", "Grady", "Hall", "ExponentPushToken[mgjDOXKcDE3hvd5cGhZMc7]"),
(4, "aleakos", "password", "Jared", "Kraus", "ExponentPushToken[mgjDOXKcDE3hvd5cGhZMc7]");

DROP TABLE IF EXISTS DEPENDENT;
CREATE TABLE DEPENDENT (
	PatientID		integer not null,
    foreign key (PatientID) references APPUSER(UID)
);

INSERT INTO DEPENDENT(PatientID)
VALUES
(3),
(4);

DROP TABLE IF EXISTS CAREGIVER;
CREATE TABLE CAREGIVER (
	CaregiverID		integer not null,
    PatientID		integer not null,
    foreign key (CaregiverID) references APPUSER(UID),
    foreign key (PatientID) references DEPENDENT(PatientID)
);

INSERT INTO CAREGIVER(CaregiverID, PatientID)
VALUES
(1,3),
(2,4);

DROP TABLE IF EXISTS RECURRINGREMINDER;
CREATE TABLE RECURRINGREMINDER (
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
);

INSERT INTO RECURRINGREMINDER(RecurringID, PatientID, StartDate, EndDate, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) 
VALUES
(1, 3, "2022-02-20","2021-03-06",true,false,false,false,true,false,false),
(2, 3, "2022-02-20","2021-03-06",false,false,false,true,false,false,false);


DROP TABLE IF EXISTS REMINDER;
CREATE TABLE REMINDER (
	ReminderID integer auto_increment not null,
    PatientID integer not null,
    ReminderTitle varchar(50) not null,
    ReminderContent varchar(100),
    ReminderDate date,-- could combine CreationTime and TimeOfDay into a datetime object/type
    TimeOfDay time, 
    Dismissed boolean default false, 
    ReminderCount integer not null default 0,
    RecurringID integer,
    Deleted boolean default false,
    ReminderType varchar(50),
    primary key(ReminderID),
    foreign key(PatientID) references DEPENDENT(PatientID)
);

INSERT INTO REMINDER(PatientID, ReminderTitle,ReminderContent,ReminderDate,TimeOfDay,Dismissed,ReminderCount,RecurringID,Deleted,ReminderType) 
VALUES
(3,"Take AM Pills", "Take with food","2022-03-02","08:00:00",true, 0, 1, false,"medication"),  -- autopopulated from recurring reminder 1
(3,"Take AM Pills", "Take with food","2022-03-03","08:00:00",true, 0, 1, false,"medication"),  
(3,"Take AM Pills", "Take with food","2022-03-04","08:00:00",false, 0, 1, false,"medication"),  
(3,"Take AM Pills", "Take with food","2022-03-05","08:00:00",false, 0, 1, false,"medication"), 
(3,"Take AM Pills", "Take with food","2022-03-06","08:00:00",false, 0, 1, false,"medication"), 
(3,"Take AM Pills", "Take with food","2022-03-01","08:00:00",true, 0, 1, false,"medication"),
(3,"Take PM Pills", "Take with food","2022-03-02","18:00:00",true, 0, 1, false,"medication"),  -- autopopulated from recurring reminder 1
(3,"Take PM Pills", "Take with food","2022-03-03","18:00:00",true, 0, 1, false,"medication"),  
(3,"Take PM Pills", "Take with food","2022-03-04","18:00:00",false, 0, 1, false,"medication"),  
(3,"Take PM Pills", "Take with food","2022-03-05","18:00:00",false, 0, 1, false,"medication"), 
(3,"Take PM Pills", "Take with food","2022-03-01","18:00:00",true, 0, 1, false,"medication"),


(4,"Perform Exercise", "Go for walk","2021-02-23","10:00:00",false, 0, 2, false,"exercise"),  -- autopopulated from recurring reminder 2
(4,"Take AM Pills", "Take with food","2021-03-02","10:00:00",false, 0, 2, false,"exercise"),  

(3,"Appointment", "With Dr. Nelson, PLC center","2021-03-04","16:00:00",false, 0, null, false,"calendar"), -- one-off  
(4,"Eat Dinner", "Chicken Pasta, microwave","2021-03-05","17:00:00",false, 0, null, true,"diet"),  -- one-off, deleted
(3,"test", "test","2021-02-24","08:00:00",false, 0, null, false,"other");  