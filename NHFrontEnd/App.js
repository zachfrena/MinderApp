import React, { useState, useEffect, useRef } from 'react';
import HomeScreen from './app/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/screens/LoginScreen/LoginScreen';
import AcceptReminder from './app/screens/AcceptReminderScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setStatusBarHidden } from 'expo-status-bar';
import EditReminderContent from './app/screens/EditReminderScreen';
import SetReminderScreen from './app/screens/SetReminderScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  let login = () => {
    setAuthenticated(true);
  };

  let logout = () => {
    setAuthenticated(false);
  };

  let getUser = async () => {
    try {
      const response = await AsyncStorage.getItem('user');
      setUser(JSON.parse(response));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, [authenticated]);

  return user ? (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" logout={logout}>
          {(props) => <HomeScreen {...props} logout={logout} user={user} />}
        </Stack.Screen>

        <Stack.Screen name="AcceptReminderScreen" component={AcceptReminder} />
        <Stack.Screen
          name="EditReminderScreen"
          component={EditReminderContent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <LoginScreen login={login} />
  );
}

// async function registerForPushNotificationsAsync() {
//   let token;
//   // if (Constants.isDevice || Device.isDevice) {
//   if (true) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }
//
//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }
//
//   return token;
// }

// const [expoPushToken, setExpoPushToken] = useState('');
// const [notification, setNotification] = useState(false);
// const notificationListener = useRef();
// const responseListener = useRef();
// useEffect(() => {
//   registerForPushNotificationsAsync().then((token) =>
//     setExpoPushToken(token)
//   );
//
//   // This listener is fired whenever a notification is received while the app is foregrounded
//   notificationListener.current =
//     Notifications.addNotificationReceivedListener((notification) => {
//       setNotification(notification);
//       console.log(notification)
//     });
//
//   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
//   responseListener.current =
//     Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log(response);
//     });
//
//
//
//   return () => {
//     Notifications.removeNotificationSubscription(
//       notificationListener.current
//     );
//     Notifications.removeNotificationSubscription(responseListener.current);
//   };
// }, []);
