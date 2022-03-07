import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Paragraph, Title } from 'react-native-paper';
import moment from 'moment';

import colors from '../config/colors';
import icons from '../config/icons';

const ReminderBadge = ({
  reminderTime,
  reminderDate,
  reminderContent,
  reminderType,
  reminderStatus,
  navigation,
  dismissed,
  reminder,
  user,
}) => {
  const [icon, setIcon] = useState('');
  const [iconColor, setIconColor] = useState('');

  // pass dismissed instead of status
  // future ones are grey and not yellow

  useEffect(() => {
    let reminderDateTime = moment.utc(reminderDate + ' ' + reminderTime); // convert to usable dateTime
    let currentLocalTime = moment(new Date()).local().subtract(7, 'hours'); // hard coded for mountain time
    let pastReminder = reminderDateTime.isBefore(currentLocalTime); // true if reminder is from the past

    let reminderStatus;
    if (reminder.Dismissed === 1) {
      // reminder already completed
      reminderStatus = 'complete';
    } else if (pastReminder) {
      // reminder incompleted and in past, therefore missed
      reminderStatus = 'missed';
    }

    if (reminderStatus === 'complete') {
      setIconColor(colors.accept);
      setIcon(icons.complete);
    } else if (reminderStatus === 'missed') {
      setIconColor(colors.reject);
      setIcon(icons.missed);
    } else {
      setIconColor(colors.grey);

      if (reminderType in icons) {
        setIcon(icons[reminderType]);
      } else {
        setIcon(icons.other);
      }
    }
  }, [reminderStatus, reminderType]);

  const handleOnPress = () => {
    // do something like re route to the actual card - maybe pop a modal?
    // let time = moment(reminderTime).format('h:mm a');
    let time = tConvert(reminderTime);

    let id = reminder.ReminderID;
    if (user.role === 'patient') {
      navigation.navigate('AcceptReminderScreen', {
        time,
        reminderContent,
        icon,
        iconColor,
        id,
        user,
        reminderDate,
        reminderTime,
      });
    } else {
      navigation.navigate('EditReminderScreen', {
        user,
        id,
        reminderDate
      });
    }
  };

  return (
    <Card onPress={handleOnPress}>
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
          {tConvert(reminderTime)}
        </Title>
      </View>
      <View>
        <Paragraph style={styles.content}>{reminderContent}</Paragraph>
      </View>
    </Card>
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

export default ReminderBadge;

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time[0] + time[1] + time[2] + time[5];
  // return time.join (''); // return adjusted time or original string
}
