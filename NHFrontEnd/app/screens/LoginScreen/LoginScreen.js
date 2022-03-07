import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { IPV4 } from '@env'
import styles from './LoginStyles'

function LoginScreen ({ navigation, login }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  let setUser = async user => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user))
    } catch (err) {
      console.log(err)
    }
  }

  let onLoginIn = async () => {
    if (username.length === 0) {
      setErrorMessage('Please enter an username adress')
      return
    }
    if (password.length === 0) {
      setErrorMessage('Please enter a password')
      return
    }

    await axios
      .post(`http://${IPV4}/users/login`, { username, password })
      .then(res => {
        if (res.data.status === 'APPROVED') {
          setUser(res.data.user)
          login()
        } else {
          setErrorMessage(res.data.message + ' Please try again.')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>MINDER</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder='Username'
          onChangeText={username => setUsername(username)}
        />
        <TextInput
          style={styles.textInput}
          placeholder='Password'
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => onLoginIn()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={{ color: '#FF0000', fontSize: 18 }}>{errorMessage}</Text>
      </View>

      <View style={styles.keyboardContainer} />
    </View>
  )
}

export default LoginScreen
