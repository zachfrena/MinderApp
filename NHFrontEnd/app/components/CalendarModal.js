import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Icon } from 'react-native-elements';
import colors from '../config/colors';

const CalendarModal = (props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    props.setReminderDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.calendarModalButton}>
      <Icon
        name="calendar"
        type={'antdesign'}
        color={'white'}
        size={25}
        onPress={showDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={props.reminderDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarModalButton: {
    position: 'absolute',
    right: 25,
  },
});

export default CalendarModal;
