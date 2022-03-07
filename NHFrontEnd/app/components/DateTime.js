import React, { useState, useEffect } from 'react';
import { View, Platform, Text, StyleSheet } from 'react-native';
import { Button, List } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import colors from '../config/colors';
import moment from 'moment';

const DateTime = ({
  recurring,
  startDate,
  endDate,
  time,
  setStartDate,
  setEndDate,
  setTime,
  initialReminderDate,
}) => {
  const [showTimeAndroid, setShowTimeAndroid] = useState(false);
  const [showStartDateAndroid, setShowStartDateAndroid] = useState(false);
  const [showEndDateAndroid, setShowEndDateAndroid] = useState(false);
  const [chosenReminderDate, setChosenReminderDate] = useState(null);
  const [startDateTruth, setStartDateTruth] = useState(startDate);

  useEffect(() => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, [startDate, endDate, time]);

  useEffect(() => {
    setStartDate(startDateTruth);
    console.log(startDateTruth);
    let x = recurring
      ? startDate.toDateString()
      : initialReminderDate.toDateString();
    setChosenReminderDate(x);
  }, [recurring]);

  const saveStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setChosenReminderDate(currentDate.toDateString());
    console.log(selectedDate + 'IS THE SELECTED DATE');
    console.log(currentDate);
    console.log(endDate);
    console.log(currentDate > endDate);
    // TODO doesn't always work?
    if (currentDate > endDate) {
      setEndDate(currentDate);
    }
    setShowStartDateAndroid(false);
  };

  const saveEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    setShowEndDateAndroid(false);
  };

  const saveTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
    setShowTimeAndroid(false);
  };

  const showStartDatePicker = () => {
    setShowStartDateAndroid(true);
  };

  const showEndDatePicker = () => {
    setShowEndDateAndroid(true);
  };

  const showTimepicker = () => {
    setShowTimeAndroid(true);
  };

  const startDateTitle = () => {
    return recurring ? 'Set Start Date' : 'Set Date';
  };

  const startPickerList = () => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.iosContainer}>
          <List.Icon color={colors.primary} icon="calendar" />
          <Text
            style={{
              alignSelf: 'center',
            }}
          >
            {startDateTitle()}
          </Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={saveStartDate}
            minimumDate={new Date()}
          />
        </View>
      );
    } else {
      return (
        <View>
          <List.Item
            title={startDateTitle()}
            left={() => <List.Icon color={colors.primary} icon="calendar" />}
            onPress={showStartDatePicker}
            right={() => (
              <Text
                style={{
                  alignSelf: 'center',
                }}
              >
                {/*{recurring? startDate.toDateString() : initialReminderDate.toDateString()}*/}
                {chosenReminderDate}
              </Text>
            )}
          />
          {showStartDateAndroid && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={saveStartDate}
              minimumDate={new Date()}
            />
          )}
        </View>
      );
    }
  };

  const endPickerList = () => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.iosContainer}>
          <List.Icon color={colors.primary} icon="calendar" />
          <Text
            style={{
              alignSelf: 'center',
            }}
          >
            Set End Date
          </Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={endDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={saveEndDate}
            minimumDate={startDate}
          />
        </View>
      );
    } else {
      return (
        <View>
          <List.Item
            title="Set End Date"
            left={() => <List.Icon color={colors.primary} icon="calendar" />}
            onPress={showEndDatePicker}
            right={() => (
              <Text
                style={{
                  alignSelf: 'center',
                }}
              >
                {endDate.toDateString()}
              </Text>
            )}
          />
          {showEndDateAndroid && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={saveEndDate}
              minimumDate={startDate}
            />
          )}
        </View>
      );
    }
  };

  const timePickerList = () => {
    if (Platform.OS === 'ios') {
      return (
        <View style={styles.iosContainer}>
          <List.Icon color={colors.primary} icon="clock" />
          <Text
            style={{
              alignSelf: 'center',
            }}
          >
            Set Reminder Time
          </Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={saveTime}
          />
        </View>
      );
    } else {
      return (
        <View>
          <List.Item
            title="Set Reminder Time"
            left={() => <List.Icon color={colors.primary} icon="clock" />}
            onPress={showTimepicker}
            right={() => (
              <Text
                style={{
                  alignSelf: 'center',
                }}
              >
                {`${time.getHours()}:${
                  (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
                }`}
              </Text>
            )}
          />
          {showTimeAndroid && (
            <DateTimePicker
              testID="dateTimePicker"
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={saveTime}
            />
          )}
        </View>
      );
    }
  };

  //TODO format
  return (
    <View>
      {startPickerList()}
      {timePickerList()}
      {recurring ? endPickerList() : null}
    </View>
  );
};

export default DateTime;

const styles = StyleSheet.create({
  iosContainer: {
    marginVertical: 25,
    // flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
