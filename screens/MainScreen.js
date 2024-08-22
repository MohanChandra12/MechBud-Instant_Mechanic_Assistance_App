import React from "react";
import { StyleSheet, View, Image} from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS,SIZES,FONTS } from './constants/theme';
import {firebase} from './config';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import ServiceScreen from './ServiceScreen';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const MainScreen = () => (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('../assets/home-f.png') : require('../assets/home.png')} style={{ width: 24, height: 24 }} />
          ),
          headerShown:false,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('../assets/map-f.png') : require('../assets/map.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tab.Screen
  name="Service"
  component={ServiceScreen}
  options={({ route }) => ({
    tabBarLabel: ' ',
    tabBarIcon: ({ focused }) => {
      const mainBackgroundColor = route.state? route.state.routes[route.state.index].params?.backgroundColor : '#ffffff';
      return (
        <View style={[styles.circularBackground, { backgroundColor: mainBackgroundColor }]}>
          <Image
            source={focused? require('../assets/service-f.png') : require('../assets/service.png')}
            style={{ width: 53, height: 53 }}
          />
        </View>
      );
    },
    headerShown: false
  })}
/><Tab.Screen
  name="Service"
  component={ServiceScreen}
  options={({ route }) => ({
    tabBarLabel: ' ',
    tabBarIcon: ({ focused }) => {
      const mainBackgroundColor = route.state? route.state.routes[route.state.index].params?.backgroundColor : '#ffffff';
      return (
        <View style={[styles.circularBackground, { backgroundColor: mainBackgroundColor }]}>
          <Image
            source={focused? require('../assets/service-f.png') : require('../assets/service.png')}
            style={{ width: 53, height: 53 }}
          />
        </View>
      );
    },
    headerShown: false
  })}
/>
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('../assets/cart-f.png') : require('../assets/cart.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('../assets/profile-f.png') : require('../assets/profile.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );

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

  export default MainScreen;