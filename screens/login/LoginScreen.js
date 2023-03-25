import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput,Image, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable'; 
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../Connector/Firebase';
import logo from '../../assets/logo.png';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logoAnimation, setLogoAnimation] = useState(new Animated.ValueXY({ x: 0, y: 80 }));
  const [buttonAnimation, setButtonAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  /**
   * Login user
   */
  const handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        handleLogoAnimation();
        console.log('User logged in!');
        navigation.navigate('Home')
      }
      )
      .catch(error => setErrorMessage('Invalid email or password'));

  };

  /**
   * Animate logo
   *  
  */
  const handleLogoAnimation = () => {
    Animated.timing(logoAnimation, {
      toValue: { x: 0, y: 0 },
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  /**
   * Register user
  */
  handleRegister = () => {
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User signed up!');
        handleLogoAnimation();
        navigation.navigate('Home')
      }
      )
      .catch(error => setErrorMessage('Invalid email or password'));
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animatable.View  animation="fadeInUpBig" style={styles.container}>
        <Animated.View style={[styles.logoContainer, logoAnimation.getLayout()]}>
        <Image source={logo} style={styles.logoImage} />
        </Animated.View>
        <Animatable.View animation="fadeInUpBig" style={styles.formWrap}>
            <Animatable.View animation={'slideInLeft'} style={styles.inputContainer}>
                <Ionicons name="md-mail" size={24} color="#FFF" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#FFF"
                    onChangeText={setEmail}
                />
            </Animatable.View>
               
            <Animatable.View animation={'slideInLeft'} style={styles.inputContainer}>
                <Ionicons name="md-lock-closed" size={24} color="#FFF" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#FFF"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                />
            </Animatable.View>
                <Text style={{ color: 'red' }}>{errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                 <Animatable.Text animation="fadeInUp" style={[styles.buttonText]}>LOGIN</Animatable.Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                 <Animatable.Text animation="fadeInUp" style={[styles.buttonText]}>REGISTER</Animatable.Text>
            </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0097A7',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  formWrap: {
    width: '100%',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  logoText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    width: 250,
    height: 50,
    padding: 10,   
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 25,
    color: '#FFF',
    fontSize: 16,
    },
button: {
    backgroundColor: '#012343',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
    color: '#FFF',
    },
buttonText: {
    color: '#0097A7',
    fontSize: 16,
    fontWeight: 'bold',
    },
});

export default LoginScreen;