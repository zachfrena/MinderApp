import React, { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

import { StyleSheet, View, Text, ScrollView } from 'react-native';
import {
  TextInput,
  Switch,
  Button,
  Appbar,
  Dialog,
  Portal,
  Paragraph,
  Provider,
  Avatar,
} from 'react-native-paper';
import axios from 'axios';
import { IPV4 } from '@env';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';

import RecurringDates from '../components/RecurringDates';
import DateTime from '../components/DateTime';
import colors from '../config/colors';
import moment from 'moment';

const ReminderContent = ({ user }) => {
  // let now = moment(new Date()).local().subtract(7, 'hours').toDate();
  let now = new Date();
  const [startDate, setStartDate] = useState(now);
  const [endDate, setEndDate] = useState(now);
  const [time, setTime] = useState(now);

  const [mondays, setMondays] = useState(false);
  const [tuesdays, setTuesdays] = useState(false);
  const [wednesdays, setWednesdays] = useState(false);
  const [thursdays, setThursdays] = useState(false);
  const [fridays, setFridays] = useState(false);
  const [saturdays, setSaturdays] = useState(false);
  const [sundays, setSundays] = useState(false);

  const [reminderContent, setReminderContent] = useState('');
  const [title, setTitle] = useState('');
  const [reminderType, setReminderType] = useState('other');
  const [patientID, setPatientID] = useState(null);

  const [recurring, setRecurring] = React.useState(false);

  const [visibleDialog, setVisibleDialog] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState('');
  const [dialogTitle, setDialogTitle] = React.useState('');

  // get patient id from user id in db
  useEffect(() => {
    async function getPatientID() {
      try {
        let res = await axios({
          url: `http://${IPV4}/getPatientID?caregiverID=${user.UID}`,
          method: 'get',
          headers: {},
        });
        setPatientID(res.data.PatientID);
        console.log('patient id fetched:', res.data.PatientID);
      } catch (err) {
        console.error(err);
      }
    }
    getPatientID();
  }, []);

  // TODO un hardcode reminderType and patientID

  let reminderData = {
    title: reminderContent,
    recurring: recurring,
    description: reminderContent,
    recurringDates: {
      mondays: mondays,
      tuesdays: tuesdays,
      wednesdays: wednesdays,
      thursdays: thursdays,
      fridays: fridays,
      saturdays: saturdays,
      sundays: sundays,
    },
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    time: `${time.getHours()}:${
      (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
    }`,
    patientID: patientID,
    reminderType: reminderType,
  };

  let reminderTypeOptions = [
    {
      value: 'medication',
      label: 'Medication',
    },
    {
      value: 'appointment',
      label: 'Appointment',
    },
    {
      value: 'exercise',
      label: 'Exercise',
    },
    {
      value: 'diet',
      label: 'Diet',
    },
    {
      value: 'other',
      label: 'Other',
    },
  ];

  const clearSate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setTime(new Date());
    setMondays(false);
    setTuesdays(false);
    setWednesdays(false);
    setThursdays(false);
    setFridays(false);
    setSaturdays(false);
    setSundays(false);
    setReminderContent('');
    setTitle('');
    setRecurring(false);
  };

  const onToggleSwitch = () => setRecurring(!recurring);

  const showDialog = () => setVisibleDialog(true);
  const hideDialog = () => setVisibleDialog(false);

  const handleSubmit = () => {
    if (title === '' || reminderContent === '') {
      setDialogTitle('Error');
      setDialogContent('Please fill in message to patient');
      showDialog();
    } else if (
      recurring &&
      mondays === false &&
      tuesdays === false &&
      wednesdays === false &&
      thursdays === false &&
      fridays === false &&
      saturdays === false &&
      sundays === false
    ) {
      setDialogTitle('Error');
      setDialogContent('Please select at least one day for recurring events');
      showDialog();
    } else {
      let data = JSON.stringify(reminderData);
      let myIP = IPV4;
      let config = {
        method: 'post',
        url: `http://${myIP}/newReminder`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          clearSate();
          setDialogTitle('Success!');
          setDialogContent('Reminder created successfully');
          showDialog();
        })
        .catch(function (error) {
          console.log(error);
        });
      console.log(reminderData);
    }
  };

  return (
    <Provider>
      <ScrollView style={{ backgroundColor: colors.white, flex: 1 }}>
        <Appbar.Header>
          <Appbar.Content title="Create Reminder" />
        </Appbar.Header>
        <View style={styles.innerContainer}>
          <View style={styles.textBox}>
            <Text style={styles.textTitle}>Message To Patient:</Text>
            <TextInput
              label="Message"
              mode="outlined"
              multiline={false}
              value={reminderContent}
              onChangeText={(e) => {
                setReminderContent(e);
                setTitle(e);
              }}
            />
            <Dropdown
              label="Reminder Type"
              data={reminderTypeOptions}
              onChangeText={(e) => setReminderType(e)}
              value={reminderType}
            />
            <View style={styles.checkContainer}>
              <Text style={styles.textTitle}>Recurring Event:</Text>
              <Switch value={recurring} onValueChange={onToggleSwitch} />
            </View>
            <Text style={styles.textTitle}>Set Schedule:</Text>
            <DateTime
              recurring={recurring}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              time={time}
              setTime={setTime}
              initialReminderDate={new moment(new Date())
                .local()
                .subtract(7, 'hours')
                .toDate()}
            />
            {recurring ? (
              <Text style={styles.textTitle}>Days Scheduled:</Text>
            ) : null}
            {recurring ? (
              <RecurringDates
                mondays={mondays}
                tuesdays={tuesdays}
                wednesdays={wednesdays}
                thursdays={thursdays}
                fridays={fridays}
                saturdays={saturdays}
                sundays={sundays}
                setMondays={setMondays}
                setTuesdays={setTuesdays}
                setWednesdays={setWednesdays}
                setThursdays={setThursdays}
                setFridays={setFridays}
                setSaturdays={setSaturdays}
                setSundays={setSundays}
              />
            ) : null}
          </View>
          <Button mode="contained" onPress={handleSubmit}>
            <Text style={styles.textButton}>Create Reminder</Text>
          </Button>

          <Portal>
            <Dialog visible={visibleDialog} onDismiss={hideDialog}>
              <Dialog.Title>{dialogTitle}</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{dialogContent}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>Done</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </ScrollView>
    </Provider>
  );
};

export default ReminderContent;

const styles = StyleSheet.create({
  checkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  innerContainer: {
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  textBox: {
    marginHorizontal: 5,
  },
  textTitle: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 8,
  },
  textHeader: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 60,
  },
});
