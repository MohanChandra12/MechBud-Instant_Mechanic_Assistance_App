import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS } from "../constants";
import { MaterialIcons } from "@expo/vector-icons";
import { imagesDataURL } from "../constants/data";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(imagesDataURL[0]);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [country, setCountry] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const today = new Date();
  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY/MM/DD"
  );
  const [selectedStartDate, setSelectedStartDate] = useState("01/01/1990");
  const [startedDate, setStartedDate] = useState("12/12/2023");
  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name);
      setEmail(userDetails.email);
      // Set other user details accordingly
    }
  }, [userDetails]);
  const fetchUserDetails = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
  
      const response = await fetch(`http://192.168.0.101:3000/user`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Error fetching user details: Unauthorized");
        } else {
          const errorData = await response.json();
          if (errorData.message === "User not found") {
            console.error("Error fetching user details:", errorData.message);
            // Navigate to the login or error page
          } else {
            console.error("Error fetching user details:", errorData);
          }
        }
        return;
      }
  
      const jsonData = await response.json();
  
      const {
        name,
        email,
        password,
        dateOfBirth,
        phoneNumber,
        countryCode,
        country,
        image,
      } = jsonData.user;
  
      // Set user details in the state
      setUserDetails({
        name,
        email,
        password,
        dateOfBirth,
        phoneNumber,
        countryCode,
        country,
        image,
      });
  
      setName(name);
      setEmail(email);
      setPassword(password);
      setStartedDate(dateOfBirth);
      setPhoneNumber(phoneNumber);
      setCountryCode(countryCode);
      setCountry(country);
      setSelectedImage(image);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };

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
  const styles = StyleSheet.create({
    inputContainer: {
      height: 44,
      width: "100%",
      borderColor: COLORS.secondaryGray,
      borderWidth: 1,
      borderRadius: 4,
      marginVertical: 6,
      justifyContent: "center",
      paddingLeft: 8,
    },
  });
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
          <View style={{ flexDirection: "column", marginBottom: 6 }}>
          <Text style={{ ...FONTS.h4 }}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={phoneNumber}
              onChangeText={(value) => setPhoneNumber(value)}
              editable={true}
            />
          </View>
        </View>

        {/* Country Code */}
        <View style={{ flexDirection: "column", marginBottom: 6 }}>
          <Text style={{ ...FONTS.h4 }}>Country Code</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={countryCode}
              onChangeText={(value) => setCountryCode(value)}
              editable={true}
            />
          </View>
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

export default EditProfile;