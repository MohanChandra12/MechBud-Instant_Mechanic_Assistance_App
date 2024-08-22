import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator  } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '../config';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import { decode } from 'base-64';

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const inspectUserToken = (userToken) => {
      try {
        // Split the token into header, payload, and signature
        const parts = userToken.split('.');
        const decodedPayload = JSON.parse(decode(parts[1]));
    
        // Access token payload
        console.log("Decoded Token:", decodedPayload);
    
        // Check expiration time (in seconds since Unix epoch)
        const expirationTime = decodedPayload.exp;
        console.log("Token Expiration Time (Unix Epoch):", expirationTime);
    
        // Convert expiration time to Date object
        const expirationDate = new Date(expirationTime * 1000);
        console.log("Token Expiration Date:", expirationDate);
    
        // Compare expiration time with current time
        const currentTime = new Date();
        if (expirationDate < currentTime) {
          console.log("Token has expired");
        } else {
          console.log("Token is still valid");
        }
      } catch (error) {
        console.error("Error decoding user token:", error);
      }
    };
  
    const handleLogin = async () => {
      try {
        console.log("Login details:", email, password);
  
        if (!email || !password) {
          Alert.alert("Please fill in all fields.");
          return;
        }
  
        setIsLoading(true);
  
        // Sign in with email and password
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
  
        // Once signed in successfully, store the user token in AsyncStorage
        const token = await userCredential.user.getIdToken();
        await AsyncStorage.setItem('userToken', token);
        console.log("User token:", token);
        inspectUserToken(token);
        navigation.replace('Main');
      } catch (error) {
        console.error("Error during login:", error);
        Alert.alert('Login failed', error.message);
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      const checkStoredCredentials = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          if (userToken) {
            // Automatically authenticate the user using the stored token
            await firebase.auth().signInWithCustomToken(userToken);
            // Navigate to the main screen
            navigation.replace('Main');
          }
        } catch (error) {
          console.error("Error checking stored credentials:", error.message);
        }
      };
    
      checkStoredCredentials();
    }, []);  
  
    if (isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Image source={require('../assets/AppLogo1.jpg')} style={styles.logo} />
          <Image source={require('../assets/Title.png')} style={styles.title} />
        </View>
  
        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputView}>
            <Image source={require('../assets/user.png')} style={{ width: 20, height: 20, marginRight: 5 }} />
            <TextInput
              style={styles.TextInput}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              onChangeText={(email) => setEmail(email)}
            />
          </View>
  
          <View style={styles.inputView}>
            <Image source={require('../assets/password.png')} style={{ width: 20, height: 20, marginRight: 5 }} />
            <TextInput
              style={styles.TextInput}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
  
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgot_button}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
  
        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
  
        {/* Signup Container */}
        <View style={styles.signupContainer}>
          <Text style={styles.dontHaveAccountText}>Don't have an account?</Text>
          <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 10,
    },
    circularBackground: {
      width: 80, // Adjust the size based on your preference
      height: 80, // Adjust the size based on your preference
      borderRadius: 50, // Make it half of the width/height to create a circle
      backgroundColor: '#ffffff', // Light grey background color
      justifyContent: 'center',
      alignItems: 'center',
    },
    topContainer: {
      alignItems: 'center',
      marginTop: 50,  // Add marginTop for spacing
    },
    logo: {
      width: 150,
      height: 100,
      resizeMode: "contain",  
      marginBottom: 10,
    },
    title: {
      width: 150,
      height: 50,
      resizeMode: "contain",
    },
    logoStart: {
      width: 200,
      height: 150,
      resizeMode: "contain",  
      marginBottom: 10,
    },
    titleStart: {
      width: 200,
      height: 100,
      resizeMode: "contain",
    },
    inputContainer: {
      paddingTop: 70,
      alignItems: "center",
    },
    signupinputContainer: {
      paddingTop: 30,
      alignItems: "center",
    },
    inputView: {
      borderColor: "black", // Replace with your desired color code
      borderWidth: 1, // Add this line to set the width of the border
      backgroundColor: "white",
      borderRadius: 5,
      width: "80%",
      height: 45,
      marginBottom: 20,
      alignItems: "center",
      flexDirection: 'row',
    },
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      marginLeft: 5,
    },
    forgotButton: {
      marginBottom: 15,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 10,
    },
    loginBtn: {
      width: "80%",
      borderRadius: 10,
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0070C0",
    },
    signupContainer: {
      flexDirection: 'row', // Add this line to make the children align in a row
      alignItems: "center",
      marginTop: 10,
    },
    signupBtn: {
    width: "14%",
    borderRadius: 10,
    height: 30,
    marginLeft: 10, // Change this line to marginHorizontal
    alignItems: "left",
    justifyContent: "center",
    },
    dontHaveAccountText: {
    marginRight: 0, // Change this line to marginBottom
    },

    loginText: {
      color: "white",
    },
    signupText: {
      color: "blue",
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    checkbox: {
      fontSize: 18,
      marginRight: 5,
    },
    checkboxLabel: {
      fontSize: 12,
      color: 'grey',
    },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  termsText: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
  },
  termsLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  profilecontainer: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  profiletitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  /** Profile */
  profile: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#090909',
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
  },
  profileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  /** Section */
  section: {
    paddingTop: 12,
  },
  sectionTitle: {
    marginVertical: 8,
    marginHorizontal: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#a7a7a7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionBody: {
    paddingLeft: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 24,
    height: 50,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
    color: '#8B8B8B',
    marginRight: 4,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  });

  export default LoginScreen;