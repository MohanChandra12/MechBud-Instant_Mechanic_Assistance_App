  import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Modal, StyleSheet} from "react-native";
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { MaterialIcons } from "@expo/vector-icons";
  import { COLORS,FONTS } from '../constants/theme';
  import { useFonts } from 'expo-font';
  import {firebase} from '../config';
  import 'firebase/auth';
  import 'firebase/firestore';
  import { NavigationContainer, useNavigation } from '@react-navigation/native';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import 'firebase/database';
  import React, { useState, useEffect } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import * as ImagePicker from "expo-image-picker";
  import { imagesDataURL } from "../constants/data";
  import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
  import { createStackNavigator } from '@react-navigation/stack';
  import LoginScreen from './LoginScreen';
  import SignupScreen from './SignupScreen';
  
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const NavigationStack = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="Login3"
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

  const EditProfile = ({ navigation }) => {
    const [selectedImage, setSelectedImage] = useState(imagesDataURL[0]);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [country, setCountry] = useState(null);
  
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const today = new Date();
    const startDate = getFormatedDate(
      today.setDate(today.getDate() + 1),
      "YYYY/MM/DD"
    );
    const [selectedStartDate, setSelectedStartDate] = useState("01/01/1990");
    const [startedDate, setStartedDate] = useState("12/12/2023");
  
    // Fetch user details from Firestore on component mount
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const currentUser = firebase.auth().currentUser;
          if (currentUser) {
            const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
            const userData = userDoc.data();
            if (userData) {
              setName(userData.username);
              setEmail(userData.email);
              setPassword(userData.password);
              setCountry(userData.countryCode);
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
  
      fetchUserDetails();
    }, []);
  
    const handleChangeStartDate = (propDate) => {
      setStartedDate(propDate);
    };
  
    const handleOnPressStartDate = () => {
      setOpenStartDatePicker(!openStartDatePicker);
    };
  
    const handleImageSelection = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    };
  
    function renderDatePicker() {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openStartDatePicker}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                margin: 20,
                backgroundColor: COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                padding: 35,
                width: "90%",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <DatePicker
                mode="calendar"
                minimumDate={startDate}
                selected={startedDate}
                onDateChanged={handleChangeStartDate}
                onSelectedChange={(date) => setSelectedStartDate(date)}
                options={{
                  backgroundColor: COLORS.primary,
                  textHeaderColor: "#469ab6",
                  textDefaultColor: COLORS.white,
                  selectedTextColor: COLORS.white,
                  mainColor: "#469ab6",
                  textSecondaryColor: COLORS.white,
                  borderColor: "rgba(122,146,165,0.1)",
                }}
              />
  
              <TouchableOpacity onPress={handleOnPressStartDate}>
                <Text style={{ ...FONTS.body3, color: COLORS.white }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
  
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          paddingHorizontal: 22,
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
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={COLORS.black}
            />
          </TouchableOpacity>
  
          <Text style={{ ...FONTS.h3 }}>Edit Profile</Text>
        </View>
  
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              marginVertical: 22,
            }}
          >
            <TouchableOpacity onPress={handleImageSelection}>
              <Image
                source={{ uri: selectedImage }}
                style={{
                  height: 170,
                  width: 170,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
              />
  
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 10,
                  zIndex: 9999,
                }}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={32}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
  
          <View>
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Name</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={name}
                  onChangeText={(value) => setName(value)}
                  editable={true}
                />
              </View>
            </View>
  
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Email</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                  editable={true}
                />
              </View>
            </View>
  
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Password</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={password}
                  onChangeText={(value) => setPassword(value)}
                  editable={true}
                  secureTextEntry
                />
              </View>
            </View>
  
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Date or Birth</Text>
              <TouchableOpacity
                onPress={handleOnPressStartDate}
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <Text>{selectedStartDate}</Text>
              </TouchableOpacity>
            </View>
          </View>
  
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Country</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={country}
                onChangeText={(value) => setCountry(value)}
                editable={true}
              />
            </View>
          </View>
  
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              height: 44,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...FONTS.body3,
                color: COLORS.white,
              }}
            >
              Save Change
            </Text>
          </TouchableOpacity>
  
          {renderDatePicker()}
        </ScrollView>
      </SafeAreaView>
    );
  };

  const ProfileScreen = () => {
    return (
      <>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Profile">
          <Stack.Screen
            name="Profile"
            component={ProfileContent}
            options={{ headerShown: false }} // Hide header for main screen
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: false }} // Hide header for main screen
          />
          <Stack.Screen
            name="Login3"
            component={NavigationStack}
            options={{ headerShown: false }} // Hide header for main screen
          />
        </Stack.Navigator>
      </NavigationContainer>
      </>
    );
  };

const ProfileContent = ( ) => {
    const navigation = useNavigation();
    const [fontsLoaded] = useFonts({
      black: require('../assets/Fonts/Inter-Black.ttf'),
      bold: require('../assets/Fonts/Inter-Bold.ttf'),
      medium: require('../assets/Fonts/Inter-Medium.ttf'),
      regular: require('../assets/Fonts/Inter-Regular.ttf'),
      semiBold: require('../assets/Fonts/Inter-SemiBold.ttf'),
    });
    if (!fontsLoaded) {
      // Font loading is in progress or failed
      return null; // or render a loading indicator
    }
    const navigateToEditProfile = async () => {
            navigation.navigate('EditProfile');
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
        await firebase.auth().signOut();
        await AsyncStorage.removeItem('userToken'); // Remove user token from AsyncStorage
        navigation.reset({              // Use reset() instead of replace()
          index: 0,                     // Set index to 0 to navigate back to the first screen
          routes: [{ name: 'Login3' }]  // Define the route to navigate to
        });
        console.log("User signed out");
      } catch (error) {
        console.error("Error during logout:", error);
        // Handle any errors that occur during logout
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

  export default ProfileScreen;