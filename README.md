# MinderApp

## Design Question: Can the use of a reminder app increase senior’s independence to allow them to age in place?

This application was developed during a hackathon in collaboration with the Faculty of Nursing at UofC. The app was developed to provide a solution to the challenges surrounding 'aging in place' for seniors and at-risk individuals (memory loss, lack of full-time caregivers, expensive alternatives, etc.). Technologies used were: SQL database hosted on Amazon RDS, Express (JavaScript), Node, Amazon EC2, React Native, and Expo.

## Quick look:

### There are 2 ways to log into the app: 
 1. as a nurse/caregiver (shown by the phone on the left) 
 2. as a patient (shown by the phone on the right)

<img src="https://github.com/zachfrena/MinderApp/blob/main/Images/logging_in.gif" width="800"/>

### When logged in as a caregiver:
You have the ability to view all previously set reminders as well as create new reminders for your designated patient. 
These reminders can be recurring or singular, and you can specify the reminder's message, frequency, start/end time, and category.

<img src="https://github.com/zachfrena/MinderApp/blob/main/Images/creating_reminder.gif" width="800"/>


### When logged in as a patient:
You can view all previous, current, and future reminders that your caregiver has set up. 
You can't "accept/complete" future reminders, but you can navigate to previous reminders that you have not completed to check them off. When an actual reminder gets triggered (i.e. at the correct date and time), the patient's phone will receive a notification and the patient can click on it to navigate to the app to mark it as "accepted".

<img src="https://github.com/zachfrena/MinderApp/blob/main/Images/patient_notification.gif" width="800"/>


## Technical Design:


