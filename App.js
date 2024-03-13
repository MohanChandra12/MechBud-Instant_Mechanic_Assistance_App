  import { StatusBar } from "expo-status-bar";
  import React, { useState, useEffect } from "react";
  import { StyleSheet, SafeAreaView, Text, View, Image, TextInput, TouchableOpacity, Animated, Modal, Switch } from "react-native";
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import { Picker } from '@react-native-picker/picker';
  import {CountryPicker} from "react-native-country-codes-picker";
  import { ScrollView, TouchableHighlight, PermissionsAndroid } from 'react-native';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import MapView, {Marker} from "react-native-maps";
  import MapViewDirections from 'react-native-maps-directions';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Easing } from 'react-native-reanimated';
  import FeatherIcon from 'react-native-vector-icons/Feather';
  import { MaterialIcons } from "@expo/vector-icons";
  import { Dimensions } from 'react-native';
  import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
  import { COLORS,SIZES,FONTS } from './constants/theme';
  import * as Font from 'expo-font';
  import { useFonts } from 'expo-font';
  import EditProfile from './screens/EditProfile';
  import ServiceTextContainer from './screens/ServiceTextContainer';
  import Geolocation from 'react-native-geolocation-service';
  import axios from 'axios';

  const appTheme = { COLORS, SIZES, FONTS }
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const { height, width } = Dimensions.get('window')
  const HomeScreen = () => {
    const [userName, setUserName] = useState('');
  
    useEffect(() => {
      // Function to fetch user details from the server
      const fetchUserDetails = async () => {
        try {
          // Make GET request to fetch user details
          const response = await axios.get('http://192.168.0.102:3000/user', {
            // Optionally, you can pass any request headers or parameters here
          });
  
          // Extract user's name from the response
          const { user } = response.data;
          const { username } = user;
          setUserName(username); // Update state with the user's name
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
  
      // Call the function to fetch user details when the component mounts
      fetchUserDetails();
    }, []); // Empty dependency array ensures the effect runs only once after the component mounts
  
    return (
      <View>
        <Text>Welcome, {userName}</Text>
      </View>
    );
  };

  const MapScreen = () => {
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
  
  const ServiceScreen = () => {
    return (
      <ScrollView>
      <View>
        <ServiceTextContainer />
      </View>
      </ScrollView>
    );
  };

  const CartScreen = ({ navigation }) => {
    const [showText, setShowText] = useState(true);

    const toggleText = () => {
      setShowText(!showText);
    };

    return (
      <View>
        {/* Your home screen content */}
        <TouchableOpacity onPress={() => toggleText()}>
          {showText ? (
            <Text>Hello, this is text!</Text>
          ) : (
            <Text>Click me to show text!</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const ProfileScreen = ({ navigation }) => {
    const [fontsLoaded] = useFonts({
      black: require('./assets/Fonts/Inter-Black.ttf'),
      bold: require('./assets/Fonts/Inter-Bold.ttf'),
      medium: require('./assets/Fonts/Inter-Medium.ttf'),
      regular: require('./assets/Fonts/Inter-Regular.ttf'),
      semiBold: require('./assets/Fonts/Inter-SemiBold.ttf'),
    });
    if (!fontsLoaded) {
      // Font loading is in progress or failed
      return null; // or render a loading indicator
    }
    const navigateToEditProfile = () => {
      navigation.navigate("EditProfile");
    };

    const navigateToSecurity = () => {
      console.log("Security function");
    };

    const navigateToNotifications = () => {
      console.log("Notifications function");
    };

    const navigateToPrivacy = () => {
      console.log("Privacy function");
    };

    const navigateToSubscription = () => {
      console.log("Subscription function");
    };

    const navigateToSupport = () => {
      console.log("Support function");
    };

    const navigateToTermsAndPolicies = () => {
      console.log("Terms and Policies function");
    };

    const navigateToFreeSpace = () => {
      console.log("Free Space function");
    };

    const navigateToDateSaver = () => {
      console.log("Date saver");
    };

    const navigateToReportProblem = () => {
      console.log("Report a problem");
    };

    const addAccount = () => {
      console.log("Aadd account ");
    };

    const vehicleDetails = () => {
      console.log("View Vehicle Details");
      // Implement your logic to navigate or perform actions related to Vehicle Details
    };

    const ratingAndReviews = () => {
      console.log("View Rating and Reviews");
      // Implement your logic to navigate or perform actions related to Rating and Reviews
    };

    const notificationPreferences = () => {
      console.log("View Notification Preferences");
      // Implement your logic to navigate or perform actions related to Notification Preferences
    };

    const paymentInformation = () => {
      console.log("View Payment Information");
      // Implement your logic to navigate or perform actions related to Payment Information
    };

    const languagePreferences = () => {
      console.log("View Language Preferences");
      // Implement your logic to navigate or perform actions related to Language Preferences
    };

    const history = () => {
      console.log("View History");
      // Implement your logic to navigate or perform actions related to History
    };

    const logout = async () => {
      try {
        // Clear stored credentials
        await AsyncStorage.removeItem('userToken');

        // Navigate back to the login screen
        navigation.navigate('Login');
      } catch (error) {
        console.error("Error during logout: " + error.message);
      }
    };

    const accountItems = [
      {
        icon: "person-outline",
        text: "Edit Profile",
        action: navigateToEditProfile,
      },
      { icon: "security", text: "Security", action: navigateToSecurity },
      {
        icon: "notifications-none",
        text: "Notifications",
        action: navigateToNotifications,
      },
      { icon: "lock-outline", text: "Privacy", action: navigateToPrivacy },
      { icon: "directions-car", text: "Vehicle Details", action: vehicleDetails },
      { icon: "star-outline", text: "Rating and Reviews", action: ratingAndReviews },
      { icon: "notifications", text: "Notification Preferences", action: notificationPreferences },
      { icon: "payment", text: "Payment Information", action: paymentInformation },
      { icon: "language", text: "Language Preferences", action: languagePreferences },
      { icon: "history", text: "History", action: history },
    ];

    const supportItems = [
      {
        icon: "credit-card",
        text: "My Subscription",
        action: navigateToSubscription,
      },
      { icon: "help-outline", text: "Help & Support", action: navigateToSupport },
      {
        icon: "info-outline",
        text: "Terms and Policies",
        action: navigateToTermsAndPolicies,
      },
    ];

    const cacheAndCellularItems = [
      {
        icon: "delete-outline",
        text: "Free up space",
        action: navigateToFreeSpace,
      },
      { icon: "save-alt", text: "Date Saver", action: navigateToDateSaver },
    ];

    const actionsItems = [
      {
        icon: "outlined-flag",
        text: "Report a problem",
        action: navigateToReportProblem,
      },
      { icon: "people-outline", text: "Add Account", action: addAccount },
      { icon: "logout", text: "Log out", action: logout },
    ];
    const VehicleDetailsScreen = () => {
    return (
      <View>
        <Text>Vehicle Details Screen</Text>
        {/* Add your vehicle details content here */}
      </View>
    );
  };
    const renderSettingsItem = ({ icon, text, action }) => (
      <TouchableOpacity
        onPress={action}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingLeft: 12,
          backgroundColor: COLORS.gray,
        }}
      >
        <MaterialIcons name={icon} size={24} color="black" />
        <Text
          style={{
            marginLeft: 36,
            ...FONTS.semiBold,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          {text}{" "}
        </Text>
      </TouchableOpacity>
    );

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}
      >
        <View
          style={{
            marginHorizontal: 12,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              left: 0,
            }}
          >
          </TouchableOpacity>

        </View>

        <ScrollView style={{ marginHorizontal: 12 }}>
          {/* Account Settings */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ ...FONTS.h4, marginVertical: 10 }}>Account</Text>
            <View
              style={{
                borderRadius: 12,
                backgrounColor: COLORS.gray,
              }}
            >
              {accountItems.map((item, index) => (
                <React.Fragment key={index}>
                  {renderSettingsItem(item)}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Support and About settings */}

          <View style={{ marginBottom: 12 }}>
            <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
              Support & About{" "}
            </Text>
            <View
              style={{
                borderRadius: 12,
                backgrounColor: COLORS.gray,
              }}
            >
              {supportItems.map((item, index) => (
                <React.Fragment key={index}>
                  {renderSettingsItem(item)}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Cache & Cellular */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
              Cache & Cellular{" "}
            </Text>
            <View
              style={{
                borderRadius: 12,
                backgrounColor: COLORS.gray,
              }}
            >
              {cacheAndCellularItems.map((item, index) => (
                <React.Fragment key={index}>
                  {renderSettingsItem(item)}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Actions Settings */}

          <View style={{ marginBottom: 12 }}>
            <Text style={{ ...FONTS.h4, marginVertical: 10 }}>Actions</Text>
            <View
              style={{
                borderRadius: 12,
                backgrounColor: COLORS.gray,
              }}
            >
              {actionsItems.map((item, index) => (
                <React.Fragment key={index}>
                  {renderSettingsItem(item)}
                </React.Fragment>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const TabNavigator = () => (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('./assets/home-f.png') : require('./assets/home.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('./assets/map-f.png') : require('./assets/map.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tab.Screen
    name="Service"
    component={ServiceScreen}
    options={({ route }) => ({
      tabBarLabel: ' ',
      tabBarIcon: ({ focused }) => {
        const mainBackgroundColor = route.state ? route.state.routes[route.state.index].params?.backgroundColor : '#ffffff';
        return (
          <View style={[styles.circularBackground, { backgroundColor: mainBackgroundColor }]}>
            <Image
              source={focused ? require('./assets/service-f.png') : require('./assets/service.png')}
              style={{ width: 53, height: 53 }}
            />
          </View>
        );
      },
    })}
  />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('./assets/cart-f.png') : require('./assets/cart.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('./assets/profile-f.png') : require('./assets/profile.png')} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );


  export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showInitialScreen, setShowInitialScreen] = useState(true);
    useEffect(() => {
      const checkStoredCredentials = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');

          if (userToken) {
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Error checking stored credentials: " + error.message);
        } finally {
          // Once the check is done, update showInitialScreen to false
          setShowInitialScreen(false);
        }
      };

      checkStoredCredentials();
    }, []);

    if (showInitialScreen) {
      // Render the initial screen with logo and title
      return (
        <View style={styles.container}>
          <Image source={require('./assets/AppLogo1.jpg')} style={styles.logoStart} />
          <Image source={require('./assets/Title.png')} style={styles.titleStart} />
        </View>
      );
    }

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? "Main" : "Home"}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerStyle: {
                backgroundColor: '#0070C0',
                borderBottomColor: '#0070C0',
              },
              headerTitleStyle: {
                color: 'white',
              },
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              headerStyle: {
                backgroundColor: '#0070C0',
                borderBottomColor: '#0070C0',
              },
              headerTitleStyle: {
                color: 'white',
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown: false,}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Ensure this line is present
  
    const handleLogin = async (email, password) => {
      try {
        const response = await fetch("http://192.168.0.101:3000/login",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const userToken = data.token;
          await saveTokenToStorage(userToken);
          setIsLoggedIn(true);
          navigation.replace("Main");
        } else {
          alert("Login failed: " + data.message);
        }
      } catch (error) {
        console.error("Error during login: " + error.message);
      }
    };
    
    const saveTokenToStorage = async (token) => {
      try {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('isLoggedIn', 'true'); // Set the isLoggedIn flag
      } catch (error) {
        console.error('Error saving token to storage:', error);
      }
    };
    
    const handleLogout = async () => {
      try {
        // Clear stored credentials
        await AsyncStorage.removeItem('userToken');
    
        // Navigate to the login screen or perform any other necessary actions
        navigation.navigate('Login');
      } catch (error) {
        console.error("Error during logout: " + error.message);
      }
    };
    
    useEffect(() => {
      const checkStoredCredentials = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
    
          if (userToken) {
            await AsyncStorage.setItem('userToken', userToken); // Replace with actual user token
            navigation.navigate('Main');
          }
          
        } catch (error) {
          console.error("Error checking stored credentials: " + error.message);
        }
      };
    
      checkStoredCredentials();
    }, []);

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
        <Image source={require('./assets/AppLogo1.jpg')} style={styles.logo} />
        <Image source={require('./assets/Title.png')} style={styles.title} />
        </View>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputView}>
            <Image source={require('./assets/user.png')} style={{ width: 20, height: 20, marginRight: 5 }} />
            <TextInput
              style={styles.TextInput}
              placeholder="Email or Phone Number"
              placeholderTextColor="#003f5c"
              onChangeText={(email) => setEmail(email)}
            />
          </View>

          <View style={styles.inputView}>
            <Image source={require('./assets/password.png')} style={{ width: 20, height: 20, marginRight: 5 }} />
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
          <TouchableOpacity style={styles.loginBtn} onPress={() => handleLogin(email, password, navigation)}>
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

  function SignupScreen({ navigation }) {
    const [signupUsername, setSignupUsername] = useState("");
    const [signupGender, setSignupGender] = useState(""); // Change to use a Picker for gender
    const [signupPhoneNumber, setSignupPhoneNumber] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('');
    const [isTermsPressed, setIsTermsPressed] = useState(false);

    const handleSignup = async () => {
      // Validate form data before sending the signup request
      try {
        if (!signupUsername || !signupGender || !signupPhoneNumber || !signupEmail || !signupPassword || !confirmPassword) {
          alert("Please fill in all fields.");
          return;
        }  
      if (/\s/.test(signupUsername)) {
        alert("Username should not contain spaces.");
        return;
      }
      if (signupPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if(!countryCode){
        alert("Please select a country code.");
        return;
      }
      if (!/^\d{10}$/.test(signupPhoneNumber)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
      }

    // Validate email to ensure it ends with "gmail.com"
    if (!signupEmail.toLowerCase().endsWith("gmail.com")) {
      alert("Email must end with 'gmail.com'.");
      return;
    }
    if (signupPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (!/(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}/.test(signupPassword)) {
      alert("Password must contain at least one number, one special character, and be 8-12 characters long.");
      return;
    }
      
    const phoneNumberWithCountryCode = `${countryCode}${signupPhoneNumber}`;

      const response = await fetch("http://192.168.0.101:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupUsername,
          gender: signupGender,
          phone_number: phoneNumberWithCountryCode,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try to get error details if available
        alert(`Signup failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
        return;
      }

      const data = await response.json();
      console.log("Response:", response);
      console.log("Data:", data);

      alert(data.message);
      // Optionally, you can navigate to the login page or perform other actions

    } catch (error) {
      console.error("Error during signup:", error.message);
      alert("Signup failed. Please try again.");
    }
  };
    
    const handleCheckboxPress = () => {
      setIsTermsPressed(!isTermsPressed);
    };

    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Signup Input Container */}
        <View style={styles.logoContainer}>
      <Image source={require('./assets/AppLogo1.jpg')} style={styles.logo} />
    </View>
    <View style={styles.titleContainer}>
      <Image source={require('./assets/Title.png')} style={styles.title} />
    </View>
        <View style={styles.signupinputContainer}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Username"
              placeholderTextColor="#003f5c"
              onChangeText={(username) => setSignupUsername(username)}
            />
          </View>

          <View style={styles.inputView}>
            {/* Replace TextInput with Picker for gender */}
            <Picker
              style={styles.TextInput}
              selectedValue={signupGender}
              onValueChange={(itemValue) => setSignupGender(itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
          <View style={styles.inputView}>
    <TouchableOpacity
      onPress={() => setShow(true)}
      style={styles.Textinput}
    >
      <Text style={styles.TextInput}>
          {countryCode}
      </Text>
    </TouchableOpacity>

    {/* For showing picker just put show state to show prop */}
    <CountryPicker
      show={show}
      // when picker button press you will get the country object with dial code
      pickerButtonOnPress={(item) => {
        setCountryCode(item.dial_code);
        setShow(false);
      }}
    />
    <TextInput
      style={styles.TextInput}
      placeholder="Phone Number"
      placeholderTextColor="#003f5c"
      keyboardType="numeric" // Set keyboardType to numeric
      onChangeText={(phoneNumber) => setSignupPhoneNumber(phoneNumber)}
    />
  </View>


          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              onChangeText={(email) => setSignupEmail(email)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Create Password"
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(password) => setSignupPassword(password)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Confirm Password"
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
            />
          </View>
          
          <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleCheckboxPress}
            >
              <Text style={styles.checkbox}>
                {isTermsPressed ? '✓' : '◻'}
              </Text>
              <Text style={styles.checkboxLabel}>I agree to the </Text>
              <Text
                style={[styles.termsLink,styles.termsText, isTermsPressed || { color: 'blue' }]}
                onPress={handleCheckboxPress}
              >
                Terms and Conditions
              </Text>
            </TouchableOpacity>

          {/* Signup Button */}
          <TouchableOpacity style={styles.loginBtn} onPress={handleSignup}>
            <Text style={styles.loginText}>                                         SIGN UP                                        </Text>
          </TouchableOpacity>

          {/* Already have an account? Login */}
          <View style={styles.signupContainer}>
            <Text style={styles.dontHaveAccountText}>Already have an account? </Text>
            <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signupText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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