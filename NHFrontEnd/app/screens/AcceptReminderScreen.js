import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import colors from '../config/colors';
import icons from '../config/icons';
import axios from 'axios';
import { IPV4 } from '@env';
import moment from 'moment';
import { Banner } from 'react-native-paper';

const AcceptReminder = ({ navigation, route }) => {
  const {
    time,
    reminderContent,
    icon,
    iconColor,
    id,
    user,
    reminderDate,
    reminderTime,
  } = route.params;

  const reminderDateTime = moment.utc(reminderDate + ' ' + reminderTime);
  // .subtract(7, 'hours'); // convert to usable dateTime

  const [visible, setVisible] = useState(
    moment(new Date()).local().subtract(7, 'hours').isBefore(reminderDateTime)
  );

  const handleAccept = () => {
    async function acceptReminder(reminderId) {
      let myIP = IPV4;
      let userID = user.UID;
      try {
        let res = await axios({
          url: `http://${myIP}/accept?PatientID=${userID}&ReminderID=${reminderId}`,
          method: 'put',
          headers: {},
        });
        console.log(res);
        navigation.navigate('Home');
      } catch (err) {
        console.error(err);
      }
    }
    acceptReminder(id);
  };

  //TODO lock the accept reminder if date + time in the future
  //TODO need to pass in date - getting undefined

  const renderButton = () => {
    // let now = moment();
    let now = moment(new Date()).local().subtract(7, 'hours');

    if (icon === icons.complete) {
      return (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.acceptText}>Back</Text>
        </TouchableOpacity>
      );
    } else if (now.isBefore(reminderDateTime)) {
      return (
        <TouchableOpacity
          style={styles.backButtonGrey}
          onPress={() => {
            navigation.navigate('Home');
            console.log(reminderDateTime);
          }}
        >
          <Text style={styles.acceptText}>Back</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.acceptText}>Done</Text>
        </TouchableOpacity>
      );
    }
  };

  // {
  //   label: 'OK',
  //   onPress: () => setVisible(false),
  // },
  // {
  //   label: 'Go Back',
  //   onPress: () => navigation.navigate('Home'),
  // },

  return (
    <>
      {moment(new Date())
        .local()
        .subtract(7, 'hours')
        .isBefore(reminderDateTime) ? (
        <Banner
          visible={visible}
          actions={[]}
          icon={() => (
            <Avatar.Icon icon={icons.alert} backgroundColor={colors.caution} />
          )}
          style={{
            paddingTop:
              Platform.OS === 'android' ? StatusBar.currentHeight + 3 : 50,
          }}
        >
          This reminder is in the future and cannot be accepted.
        </Banner>
      ) : null}
      <View style={styles.container}>
        <View>
          <Text style={styles.timeText}>{time}</Text>
        </View>
        <View>
          <Text style={styles.reminderText}>{reminderContent}</Text>
        </View>
        <Avatar.Icon
          icon={icon}
          backgroundColor={iconColor}
          style={styles.iconCircle}
          size={144}
        />
        {renderButton()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    top: 10,
  },
  reminderText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  acceptText: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  acceptButton: {
    height: 120,
    width: '75%',
    backgroundColor: colors.accept,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
  },
  acceptPressed: {
    height: 120,
    width: '75%',
    backgroundColor: colors.acceptPressed,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  backButton: {
    height: 120,
    width: '75%',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
  },
  backButtonGrey: {
    height: 120,
    width: '75%',
    backgroundColor: colors.grey,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
  },
});

export default AcceptReminder;
