import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Modal,
  Avatar,
  Card,
  Title,
  Provider,
  Portal,
  RadioButton,
} from 'react-native-paper';

import colors from '../config/colors';

// const PreSetReminder = ({ reminderContent, reminderType }) => {
const PreSetReminder = () => {
  const [icon, setIcon] = useState('');
  const [iconColor, setIconColor] = useState('');

  let reminderContent = `Take medication every day at time`;
  let reminderTitle = 'Take Medication';
  let reminderType = 'medication';

  const containerStyle = { backgroundColor: 'white', padding: 20 };

  const iconDictionary = {
    medication: 'pill',
    appointment: 'calendar',
    exercise: 'walk',
    diet: 'food',
    alert: 'alert-circle-outline',
    complete: 'check-bold',
    missed: 'close-circle-outline',
    other: 'help-circle-outline',
  };

  useEffect(() => {
    setIconColor(colors.primary);

    if (reminderType in iconDictionary) {
      setIcon(iconDictionary[reminderType]);
    } else {
      setIcon(iconDictionary.other);
    }
  }, [reminderContent, reminderType]);

  const handlePressIn = () => {
    // do something like re route to the actual card
    console.log('Pressed');
  };

  return (
    <Provider>
      <Card onPress={handlePressIn}>
        <View style={styles.innerContainer}>
          <Avatar.Icon
            icon={icon}
            backgroundColor={iconColor}
            style={styles.iconCircle}
          />
          <Title
            style={{
              fontSize: 30,
            }}
          >
            {reminderTitle}
          </Title>
        </View>
      </Card>
    </Provider>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    marginVertical: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  datesContainer: {
    marginVertical: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    fontSize: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
});

export default PreSetReminder;
