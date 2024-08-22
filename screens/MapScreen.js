import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity} from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {PermissionsAndroid } from 'react-native';
import MapView, {Marker} from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

const Stack = createStackNavigator();

const MapScreen = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen
          name="Map"
          component={MapContent}
          options={{ headerShown: true }} // Hide header for main screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MapContent = () => {
    const [pickup, setPickup] = React.useState({ latitude: 12.729759, longitude: 77.708760 });
    const [destination, setDestination] = React.useState({ latitude: 12.756762, longitude: 77.702968 });
    useEffect(() =>{
      requestCameraPermission();
    },[]);
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const [currentLocation, setCurrentLocation]=useState(null)
    const getLocation=()=>{
      Geolocation.getCurrentPosition(
        (position) => {
          const {latitude,longitude}=position.cords;
          setCurrentLocation({latitude,longitude})
          console.log(latitude, longitude);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    }
    return (
      <View style={styles.container}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: 12.729759,
            longitude: 77.708760,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
        </MapView>
        <TouchableOpacity style={{width:'90%',height:50,alignSelf:'center',position:'absolute',bottom:20, backgroundColor:'orange', justifyContent:'center', alignItems:'center'}}
         onPress={()=>{
          getLocation();
         }}>
          <Text style={{color:'#fff'}}>Get current location</Text>
        </TouchableOpacity>
      </View>
    );
  };

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


  export default MapScreen;