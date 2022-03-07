import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';

import { Avatar } from 'react-native-paper';

import colors from '../config/colors';

const RecurringDates = ({
  mondays,
  tuesdays,
  wednesdays,
  thursdays,
  fridays,
  saturdays,
  sundays,
  setMondays,
  setTuesdays,
  setWednesdays,
  setThursdays,
  setFridays,
  setSaturdays,
  setSundays,
}) => {
  return (
    <View style={styles.datesContainer}>
      <Pressable onPress={() => setMondays(!mondays)}>
        <Avatar.Text
          size={40}
          label="M"
          backgroundColor={mondays ? colors.primary : 'grey'}
        />
      </Pressable>
      <Pressable onPress={() => setTuesdays(!tuesdays)}>
        <Avatar.Text
          size={40}
          label="Tu"
          backgroundColor={tuesdays ? colors.primary : 'grey'}
        />
      </Pressable>
      <Pressable onPress={() => setWednesdays(!wednesdays)}>
        <Avatar.Text
          size={40}
          label="W"
          backgroundColor={wednesdays ? colors.primary : 'grey'}
        />
      </Pressable>
      <Pressable onPress={() => setThursdays(!thursdays)}>
        <Avatar.Text
          size={40}
          label="Th"
          backgroundColor={thursdays ? colors.primary : 'grey'}
        />
      </Pressable>
      <Pressable onPress={() => setFridays(!fridays)}>
        <Avatar.Text
          size={40}
          label="F"
          backgroundColor={fridays ? colors.primary : 'grey'}
        />
      </Pressable>
      <Pressable onPress={() => setSaturdays(!saturdays)}>
        <Avatar.Text
          size={40}
          label="Sa"
          backgroundColor={saturdays ? colors.primary : 'grey'}
        />
      </Pressable>
      <Pressable onPress={() => setSundays(!sundays)}>
        <Avatar.Text
          size={40}
          label="Su"
          backgroundColor={sundays ? colors.primary : 'grey'}
        />
      </Pressable>
    </View>
  );
};

export default RecurringDates;

const styles = StyleSheet.create({
  datesContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
