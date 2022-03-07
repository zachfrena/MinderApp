import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { IPV4 } from '@env';
import { useIsFocused } from '@react-navigation/native';

import colors from '../config/colors';
import icons from '../config/icons';

import ReminderBadge from '../components/ReminderBadge';
import CalendarModal from '../components/CalendarModal';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function MainReminderScreen({ navigation, user }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [reminders, setReminders] = useState([]);
  const [reminderDate, setReminderDate] = useState(new Date());
  const isFocused = useIsFocused(); // true if this is the screen in focus for the app

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
  };

  const decrementDate = () => {
    setReminderDate(moment(reminderDate).subtract(1, 'days').toDate());
  };

  const incrementDate = () => {
    setReminderDate(moment(reminderDate).add(1, 'days').toDate());
  };

  useEffect(() => {
    getReminders();
  }, [reminderDate, isFocused]);

  async function getReminders() {
    setLoading(true);
    setReminders([]);
    let queryDate = moment(reminderDate).format('YYYY-MM-DD');
    let myIP = IPV4;
    let userID = user.UID;

    // switch endpoint based on if caregiver or patient
    let endpointName =
      user.role === 'caregiver' ? 'caregiverReminders' : 'getReminder';
    let IdName = user.role === 'caregiver' ? 'caregiverID' : 'id';
    try {
      let res = await axios({
        url: `http://${myIP}/${endpointName}?date=${queryDate}&${IdName}=${userID}`,
        method: 'get',
        headers: {},
      });

      setReminders(res.data);
    } catch (err) {
      console.error(err);
      setReminders([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    registerForPushNotificationsAsync(user.UID).then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);

        // UNCOMMENT FOR PRODUCTION
        let reminderContent = notification.request.content.title;
        let data = notification.request.content.data;

        let reminderID = data.reminderID;
        let reminderType = data.reminderType;
        let reminderTime = data.reminderTime;
        let reminderDate = data.reminderDate;
        let icon = icons[reminderType];

        let iconColor = colors.primary;

        let time = reminderTime;
        let id = reminderID;
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

        console.log(user + id);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        let reminderContent = response.notification.request.content.title;
        let data = response.notification.request.content.data;

        let reminderID = data.reminderID;
        let reminderType = data.reminderType;
        let reminderTime = data.reminderTime;
        let reminderDate = data.reminderDate;
        let icon = icons[reminderType];

        let iconColor = colors.primary;

        let time = reminderTime;
        let id = reminderID;
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
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pageTitleContainer}>
          <View style={styles.titleContent}>
            <Icon
              name="left"
              type={'antdesign'}
              color={'white'}
              onPress={decrementDate}
            />
            <Text style={styles.pageTitle}>
              {moment(reminderDate).format('ddd MMMM Do YYYY')}
            </Text>
            <Icon
              name="right"
              type={'antdesign'}
              color={'white'}
              onPress={incrementDate}
            />
            <CalendarModal
              style={styles.calendarModalButton}
              reminderDate={reminderDate}
              setReminderDate={setReminderDate}
            />
          </View>
        </View>

        {reminders.length === 0 && !loading && (
          <Text style={styles.fillerText}>No reminders today 😊</Text>
        )}

        {reminders.length > 0 && (
          // <Text>{reminders[0]["ReminderTitle"]}</Text>
          <FlatList
            data={reminders.sort((a,b) => (a.TimeOfDay > b.TimeOfDay) ? 1 : ((b.TimeOfDay > a.TimeOfDay) ? -1 : 0))}
            keyExtractor={(item) => item.ReminderID}
            renderItem={({ item }) => (
              <ReminderBadge
                reminderContent={item.ReminderTitle}
                reminderStatus={item.status}
                dismissed={item.Dismissed}
                reminderDate={item.ReminderDate}
                reminderTime={item.TimeOfDay}
                reminderType={item.ReminderType}
                navigation={navigation}
                reminder={item}
                loading={loading}
                user={user}
              />
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  pageTitleContainer: {
    backgroundColor: colors.primary,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 3 : 50,
  },
  titleContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  },

  pageTitle: {
    color: '#fff',
    fontSize: 20,
    paddingHorizontal: 15,
  },
  fillerText: {
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 20,
  },
});

async function registerForPushNotificationsAsync(userID) {
  let token;
  let myIP = IPV4;
  // if (Constants.isDevice || Device.isDevice) {
  if (true) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    try {
      let res = await axios({
        url: `http://${myIP}/updateToken?token=${token}&uid=${userID}`,
        method: 'put',
        headers: {},
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
