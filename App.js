import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, Switch, TextInput, TouchableOpacity, Alert, ActivityIndicator, Button, ScrollView, Modal, Dimensions, Animated, Easing } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { firebase } from './config';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/compat/storage';
import { decode } from 'base-64';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { CountryPicker } from "react-native-country-codes-picker";
import { SearchBar } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import { AirbnbRating, Rating } from 'react-native-ratings';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import { PermissionsAndroid } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from './constants/theme';
import { useFonts } from 'expo-font';
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { imagesDataURL } from "./constants/data";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import Icon from 'react-native-vector-icons/FontAwesome';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './languages/en.json';
import es from './languages/es.json';
import hi from './languages/hi.json';
import kn from './languages/kn.json';
import te from './languages/te.json';
import 'intl-pluralrules';
import { TurboModuleRegistry } from "react-native";
import { Feather } from '@expo/vector-icons';
import RazorpayCheckout from 'react-native-razorpay';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const { width: screenWidth } = Dimensions.get('window');
let userId = 0;

const botConfig = {
  botId: "3c56a4e9-894c-4acb-a552-ddcd17ec9358",
  hostUrl: "https://cdn.botpress.cloud/webchat/v1",
  messagingUrl: "https://messaging.botpress.cloud",
  clientId: "3c56a4e9-894c-4acb-a552-ddcd17ec9358",
}

const calculateCartItemCount = (cartItems) => {
  let totalCount = 0;
  for (let i = 0; i < cartItems.length; i++) {
    totalCount += cartItems[i].quantity;
  }
  return totalCount;
};

function AddVehicleButton({ navigation }) {
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }
  return (
    <View style={{ borderWidth: 1.5, borderRadius: 10, marginRight: 15, borderColor: '#c05000', width: 95, height: 35, flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={{ flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('Add Vehicle')}>
        <Text style={{ fontSize: 18, color: '#c05000', paddingLeft: 15, }}>+ </Text>
        <Text style={{ marginRight: 15, fontSize: 12, color: '#c05000' }}>ADD VEHICLE</Text>
      </TouchableOpacity>
    </View>
  );
}

const Step1 = ({ navigation, setCurrentStep }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null;
  }

  const vehicles = [
    {
      id: 1,
      name: 'Car',
      image: require('./assets/car-icon.png'),
      brands: [
        { name: 'Toyota', image: require('./assets/Toyota.png'), },
        { name: 'Honda', image: require('./assets/Honda.png'), },
        { name: 'Ford', image: require('./assets/Ford.png'), },
        { name: 'Mercedes', image: require('./assets/Mercedes.png'), },
        { name: 'Chevrolet', image: require('./assets/Chevrolet.png'), },
        { name: 'Nissan', image: require('./assets/Nissan.png') },
        { name: 'Audi', image: require('./assets/Audi.png') },
        { name: 'Hyundai', image: require('./assets/Hyundai.png') },
        { name: 'BMW', image: require('./assets/Bmw.webp') },
        { name: 'Kia', image: require('./assets/Kia.png') },
        { name: 'Volkswagen', image: require('./assets/Volkswagen.png') },
        { name: 'Volvo', image: require('./assets/Volvo.png') },
        { name: 'Suzuki', image: require('./assets/Suzuki.png') },
        { name: 'Fiat', image: require('./assets/Fiat.png') },
        { name: 'Renault', image: require('./assets/Renault.png') },
        { name: 'Skoda', image: require('./assets/Skoda.png') },
        { name: 'Tata', image: require('./assets/Tata.png') },
        { name: 'MG', image: require('./assets/MG.png') },
        { name: 'Mahindra', image: require('./assets/Mahindra.png') },
        { name: 'BharatBenz', image: require('./assets/BharatBenz.png') }
      ]
    },
    {
      id: 2,
      name: 'Bike',
      image: require('./assets/bike-icon.png'),
      brands: [
        { name: 'Ather', image: require('./assets/Ather-Bike.jpg') },
        { name: 'KTM', image: require('./assets/Ktm-Bike.webp') },
        { name: 'Mahindra2', image: require('./assets/Mahindra-Bike.jpg') },
        { name: 'Vespa', image: require('./assets/Vespa-Bike.jpg') },
        { name: 'Kawasaki', image: require('./assets/Kawasaki-Bike.jpg') },
        { name: 'Triumph', image: require('./assets/Triumph-Bike.jpg') },
        { name: 'Harley', image: require('./assets/Harley-Bike.jpg') },
        { name: 'Ducati', image: require('./assets/Ducati-Bike.jpg') },
        { name: 'BMW2', image: require('./assets/Bmw-Bike.jpg') },
        { name: 'Yamaha', image: require('./assets/Yamaha-Bike.jpg') },
        { name: 'Suzuki2', image: require('./assets/Suzuki-Bike.jpg') },
        { name: 'RoyalEnfield', image: require('./assets/RoyalEnfield-Bike.jpg') },
        { name: 'TVS', image: require('./assets/Tvs-Bike.jpg') },
        { name: 'Honda2', image: require('./assets/Honda-Bike.jpg') },
        { name: 'Hero', image: require('./assets/Hero-Bike.jpg') },
        { name: 'Bajaj', image: require('./assets/Bajaj-Bike.jpg') }

      ]
    }
  ];
  const handleBrandSelection = (brand) => {
    setSelectedBrand(brand);
    setCurrentStep(2);
    navigation.navigate('Step2', { vehicle: selectedVehicle.name, brand });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10 }}>Choose a vehicle type</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
          {vehicles.map(vehicle => (
            <TouchableOpacity key={vehicle.id} onPress={() => setSelectedVehicle(vehicle)}>
              <View style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginHorizontal: 20, paddingVertical: 10, backgroundColor: 'white' }}>
                <Image source={vehicle.image} style={{ width: 50, height: 50 }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {selectedVehicle && (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 12, marginBottom: 10, fontWeight: '300', alignItems: 'center', justifyContent: 'center', color: '#888' }}>─────── Select {selectedVehicle.name} Brand ───────</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {selectedVehicle.brands.map(brand => (
                <TouchableOpacity key={brand.name} activeOpacity={0.9} onPress={() => handleBrandSelection(brand)}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, elevation: 10, paddingVertical: 10, borderRadius: 10, backgroundColor: 'white', margin: 5 }}>
                    <Image source={brand.image} style={{ width: 65, height: 50, resizeMode: 'contain', marginBottom: 5 }} />
                    <Text style={{ fontWeight: '300' }}>{brand.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const Step2 = ({ navigation, route, setCurrentStep }) => {
  const { vehicle, brand } = route.params;
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }

  // Sample data for models, replace with actual data
  const allModels = {
    Toyota: [
      { name: 'Corolla', image: require('./assets/Toyota-Corolla.jpeg') },
      { name: 'Camry', image: require('./assets/Toyota-Camry.jpg') },
      { name: 'Etios', image: require('./assets/Toyota-Etios.jpeg') },
      { name: 'Etios Liva', image: require('./assets/Toyota-Etios-Liva.jpg') },
      { name: 'Fortuner', image: require('./assets/Toyota-Fortuner.webp') },
      { name: 'Glanza', image: require('./assets/Toyota-Glanza.webp') },
      { name: 'Innova Crysta', image: require('./assets/Toyota-Innova-Crysta.webp') },
      { name: 'Innova Hycross', image: require('./assets/Toyota-Innova-Hycross.webp') },
      { name: 'Land Cruiser', image: require('./assets/Toyota-Land-Cruiser.webp') },
      { name: 'Land Cruiser Prado', image: require('./assets/Toyota-Land-Cruiser-Prado.jpg') },
      { name: 'Prius', image: require('./assets/Toyota-Prius.jpg') },
      { name: 'Qualis', image: require('./assets/Toyota-Qualis.webp') },
      { name: 'Yaris', image: require('./assets/Toyota-Yaris.jpeg') },
      // Add more Toyota models as needed
    ],
    Honda: [
      { name: 'Accord', image: require('./assets/Honda-Accord.jpg') },
      { name: 'Amaze', image: require('./assets/Honda-Amaze.jpg') },
      { name: 'Brio', image: require('./assets/Honda-Brio.jpg') },
      { name: 'BR-V', image: require('./assets/Honda-BR-V.jpg') },
      { name: 'City', image: require('./assets/Honda-City.png') },
      { name: 'Civic', image: require('./assets/Honda-Civic.jpg') },
      { name: 'CR-V', image: require('./assets/Honda-CR-V.jpg') },
      { name: 'Jazz', image: require('./assets/Honda-Jazz.jpg') },
      { name: 'Mobilio', image: require('./assets/Honda-Mobilio.jpg') },
      { name: 'WR-V', image: require('./assets/Honda-WR-V.jpg') }
      // Add more Honda models as needed
    ],
    Ford: [
      { name: 'Ford-Aspire', image: require('./assets/Ford-Aspire.jpg') },
  { name: 'Ford-Classic', image: require('./assets/Ford-Classic.jpg') },
  { name: 'Ford-EcoSport', image: require('./assets/Ford-Ecosport.jpg') },
  { name: 'Ford-Endeavour', image: require('./assets/Ford-Endeavour.jpg') },
  { name: 'Ford-Escort', image: require('./assets/Ford-Escort.jpg') },
  { name: 'Ford-Fiesta', image: require('./assets/Ford-Fiesta.jpg') },
  { name: 'Ford-Figgo', image: require('./assets/Ford-Figgo.jpg') },
  { name: 'Ford-Freestyle', image: require('./assets/Ford-Freestyle.jpg') },
  { name: 'Ford-Fusion', image: require('./assets/Ford-Fusion.jpg') },
  { name: 'Ford-Ikon', image: require('./assets/Ford-Ikon.jpg') },
  { name: 'Ford-Mondeo', image: require('./assets/Ford-Mondeo.jpg') },
  { name: 'Ford-Mustang', image: require('./assets/Ford-Mustang.jpg') },
  { name: 'Ford-Raptor', image: require('./assets/Ford-Raptor.jpg') },
    ],
    Mercedes: [
      { name: 'Mercedes-Benz A-Class Limousine', image: require('./assets/Mercedes-Benz A-Class Limousine.webp') },
  { name: 'Mercedes-Benz AMG E63', image: require('./assets/Mercedes-Benz AMG E63.webp') },
  { name: 'Mercedes-Benz GLB', image: require('./assets/Mercedes-Benz GLB.webp') },
  { name: 'Mercedes-Benz S-Class', image: require('./assets/Mercedes-Benz S-Class.webp') },
  { name: 'Mercedes-Benz GLE', image: require('./assets/Mercedes-Benz GLE.webp') },
  { name: 'Mercedes-Benz C-Class', image: require('./assets/Mercedes-Benz C-Class.webp') },
  { name: 'Mercedes-Benz G-Class', image: require('./assets/Mercedes-Benz G-Class.webp') },
  
    ],
    Chevrolet: [
      { name: 'Chevrolet Tavera', image: require('./assets/Chevrolet Tavera.webp') },
  { name: 'Chevrolet Beat', image: require('./assets/Chevrolet Beat.webp') },
  { name: 'Chevrolet Enjoy', image: require('./assets/Chevrolet Enjoy.webp') },
  { name: 'Chevrolet Cruze', image: require('./assets/Chevrolet Cruze.webp') },
  { name: 'Chevrolet Sail', image: require('./assets/Chevrolet Sail.webp') },
  { name: 'Chevrolet Spark', image: require('./assets/Chevrolet Spark.webp') },
  { name: 'Chevrolet Captiva', image: require('./assets/Chevrolet Captiva.webp') },
  { name: 'Chevrolet Trailblazer', image: require('./assets/Chevrolet Trailblazer.webp') },
  { name: 'Chevrolet Aveo', image: require('./assets/Chevrolet Aveo.webp') },
  { name: 'Chevrolet Sail Hatchback', image: require('./assets/Chevrolet Sail Hatchback.webp') },
  { name: 'Chevrolet Optra Magnum', image: require('./assets/Chevrolet Optra Magnum.webp') },
  { name: 'Chevrolet Aveo U-VA', image: require('./assets/Chevrolet Aveo U-VA.webp') },
  
    ],
    Nissan: [
      { name: 'Nissan Magnite', image: require('./assets/Nissan Magnite.webp') },
    ],
    Audi: [
      { name: 'Audi A4', image: require('./assets/Audi A4.webp') },
  { name: 'Audi Q3', image: require('./assets/Audi Q3.webp') },
  { name: 'Audi A6', image: require('./assets/Audi A6.webp') },
  { name: 'Audi S5 Sportback', image: require('./assets/Audi S5 Sportback.webp') },
  { name: 'Audi Q5', image: require('./assets/Audi Q5.webp') },
  { name: 'Audi Q8', image: require('./assets/Audi Q8.webp') },
  { name: 'Audi Q7', image: require('./assets/Audi Q7.webp') },
  { name: 'Audi RS5', image: require('./assets/Audi RS5.webp') },
  { name: 'Audi A8 L', image: require('./assets/Audi A8 L.webp') },
  { name: 'Audi Q8 e-tron', image: require('./assets/Audi Q8 e-tron.webp') },
  
    ],
    Hyundai: [
      { name: 'Hyundai Creta', image: require('./assets/Hyundai Creta.webp') },
  { name: 'Hyundai Exter', image: require('./assets/Hyundai Exter.webp') },
  { name: 'Hyundai Venue', image: require('./assets/Hyundai Venue.webp') },
  { name: 'Hyundai Verna', image: require('./assets/Hyundai Verna.webp') },
  { name: 'Hyundai i20', image: require('./assets/Hyundai i20.webp') },
  { name: 'Hyundai Grand i10 Nios', image: require('./assets/Hyundai Grand i10 Nios.webp') },
  { name: 'Hyundai Creta N Line', image: require('./assets/Hyundai Creta N Line.webp') },
  { name: 'Hyundai Ioniq 5', image: require('./assets/Hyundai Ioniq 5.webp') },
  { name: 'Hyundai Tucson', image: require('./assets/Hyundai Tucson.webp') },
  { name: 'Hyundai Venue N Line', image: require('./assets/Hyundai Venue N Line.webp') },
  { name: 'Hyundai Kona Electric', image: require('./assets/Hyundai Kona Electric.webp') },
  
    ],
    BMW: [
      { name: 'BMW 7 Series', image: require('./assets/BMW 7 Series.webp') },
  { name: 'BMW M340i', image: require('./assets/BMW M340i.webp') },
  { name: 'BMW X1', image: require('./assets/BMW X1.webp') },
  { name: 'BMW 2 Series Gran Coupe', image: require('./assets/BMW 2 Series Gran Coupe.webp') },
  { name: 'BMW M4 Competition', image: require('./assets/BMW M4 Competition.webp') },
  { name: 'BMW X7', image: require('./assets/BMW X7.webp') },
  { name: 'BMW Z4', image: require('./assets/BMW Z4.webp') },
  { name: 'BMW X5', image: require('./assets/BMW X5.webp') },
  { name: 'BMW M8', image: require('./assets/BMW M8.webp') },
  
    ],
    Kia: [
      { name: 'Kia Sonet', image: require('./assets/Kia Sonet.webp') },
  { name: 'Kia Seltos', image: require('./assets/Kia Seltos.webp') },
  { name: 'Kia Carens', image: require('./assets/Kia Carens.webp') },
  { name: 'Kia EV6', image: require('./assets/Kia EV6.webp') },
  
    ],
    Volkswagen: [
      { name: 'Volkswagen Virtus', image: require('./assets/Volkswagen Virtus.webp') },
  { name: 'Volkswagen Taigun', image: require('./assets/Volkswagen Taigun.webp') },
  { name: 'Volkswagen Tiguan', image: require('./assets/Volkswagen Tiguan.webp') },
  
    ],
    Volvo: [
      { name: 'Volvo S90', image: require('./assets/Volvo S90.webp') },
  { name: 'Volvo XC60', image: require('./assets/Volvo XC60.webp') },
  { name: 'Volvo XC90', image: require('./assets/Volvo XC90.webp') },
  { name: 'Volvo XC40 Recharge', image: require('./assets/Volvo XC40 Recharge.webp') },
  { name: 'Volvo C40 Recharge', image: require('./assets/Volvo C40 Recharge.webp') },
  
    ],
    Suzuki: [
      { name: 'Maruti Fronx', image: require('./assets/Maruti Fronx.webp') },
  { name: 'Maruti Grand Vitara', image: require('./assets/Maruti Grand Vitara.webp') },
  { name: 'Maruti Brezza', image: require('./assets/Maruti Brezza.webp') },
  { name: 'Maruti Baleno', image: require('./assets/Maruti Baleno.webp') },
  { name: 'Maruti Swift', image: require('./assets/Maruti Swift.webp') },
  { name: 'Maruti Ertiga', image: require('./assets/Maruti Ertiga.webp') },
  { name: 'Maruti Alto K10', image: require('./assets/Maruti Alto K10.webp') },
  { name: 'Maruti Wagon R', image: require('./assets/Maruti Wagon R.webp') },
  { name: 'Maruti Dzire', image: require('./assets/Maruti Dzire.webp') },
  { name: 'Maruti XL6', image: require('./assets/Maruti XL6.webp') },
  { name: 'Maruti Celerio', image: require('./assets/Maruti Celerio.webp') },
  { name: 'Maruti S-Presso', image: require('./assets/Maruti S-Presso.webp') },
  { name: 'Maruti Jimny', image: require('./assets/Maruti Jimny.webp') },
  { name: 'Maruti Eeco', image: require('./assets/Maruti Eeco.webp') },
    ],
    Fiat: [
      { name: 'Fiat Linea', image: require('./assets/Fiat Linea.webp') },
  { name: 'Fiat Punto Pure', image: require('./assets/Fiat Punto Pure.webp') },
  { name: 'Fiat Avventura', image: require('./assets/Fiat Avventura.webp') },
  { name: 'Fiat Abarth Punto', image: require('./assets/Fiat Abarth Punto.webp') },
  { name: 'Fiat Siena', image: require('./assets/Fiat Siena.webp') },
  { name: 'Fiat Palio Stile', image: require('./assets/Fiat Palio Stile.webp') },
  { name: 'Fiat Urban Cross', image: require('./assets/Fiat Urban Cross.webp') },
  { name: 'Fiat Abarth 595', image: require('./assets/Fiat Abarth 595.webp') },
  { name: 'Fiat Adventure', image: require('./assets/Fiat Adventure.jpg') },
  
    ],
    Renault: [
      { name: 'Renault Triber', image: require('./assets/Renault Triber.webp') },
  { name: 'Renault Kwid', image: require('./assets/Renault Kwid.webp') },
  { name: 'Renault Kiger', image: require('./assets/Renault Kiger.webp') },
  
    ],
    Skoda: [
      { name: 'Skoda Slavia', image: require('./assets/Skoda Slavia.webp') },
  { name: 'Skoda Kushaq', image: require('./assets/Skoda Kushaq.webp') },
  { name: 'Skoda Kodiaq', image: require('./assets/Skoda Kodiaq.webp') },
  
    ],
    Tata: [
      { name: 'Tata Nexon', image: require('./assets/Tata Nexon.webp') },
  { name: 'Tata Punch', image: require('./assets/Tata Punch.webp') },
  { name: 'Tata Punch EV', image: require('./assets/Tata Punch EV.webp') },
  { name: 'Tata Harrier', image: require('./assets/Tata Harrier.webp') },
  { name: 'Tata Safari', image: require('./assets/Tata Safari.webp') },
  { name: 'Tata Altroz', image: require('./assets/Tata Altroz.webp') },
  { name: 'Tata Tiago', image: require('./assets/Tata Tiago.webp') },
  { name: 'Tata Tigor', image: require('./assets/Tata Tigor.webp') },
  
    ],
    MG: [
      { name: 'MG Hector', image: require('./assets/MG Hector.webp') },
  { name: 'MG Astor', image: require('./assets/MG Astor.webp') },
  { name: 'MG Hector Plus', image: require('./assets/MG Hector Plus.webp') },
  { name: 'MG Comet EV', image: require('./assets/MG Comet EV.webp') },
  { name: 'MG Gloster', image: require('./assets/MG Gloster.webp') },
  { name: 'MG ZS EV', image: require('./assets/MG ZS EV.webp') },
  
    ],
    Mahindra: [
      { name: 'Mahindra Scorpio N', image: require('./assets/Mahindra Scorpio N.webp') },
  { name: 'Mahindra Scorpio', image: require('./assets/Mahindra Scorpio.webp') },
  { name: 'Mahindra Thar', image: require('./assets/Mahindra Thar.webp') },
  { name: 'Mahindra XUV700', image: require('./assets/Mahindra XUV700.webp') },
  { name: 'Mahindra XUV300', image: require('./assets/Mahindra XUV300.webp') },
  { name: 'Mahindra Bolero', image: require('./assets/Mahindra Bolero.webp') },
  { name: 'Mahindra Bolero Neo', image: require('./assets/Mahindra Bolero Neo.webp') },
  { name: 'Mahindra XUV300 TurboSport', image: require('./assets/Mahindra XUV300 TurboSport.webp') }

    ],
    Ather: [
      { name: 'Ather 450s', image: require('./assets/Ather 450s.jpg') },
  { name: 'Ather 450apex', image: require('./assets/Ather 450apex.jpg') },
  
    ],
    KTM: [
      { name: 'Ktm duke 200', image: require('./assets/Ktm duke 200.jpg') },
  { name: 'Ktm Duke 390', image: require('./assets/Ktm Duke 390.jpg') },
  { name: 'Ktm Rc 200', image: require('./assets/Ktm Rc 200.jpg') },
  { name: 'Ktm Rc 125', image: require('./assets/Ktm Rc 125.jpg') },
  
    ],
    Mahindra2: [
      { name: 'Mahindra Centuro', image: require('./assets/Mahindra Centuro.jpg') },
  { name: 'Mahindra Duro', image: require('./assets/Mahindra Duro.jpg') },
  { name: 'Mahindra Rodeo', image: require('./assets/Mahindra Rodeo.jpg') },
  { name: 'Mahindra Flyte', image: require('./assets/Mahindra Flyte.jpg') },
  { name: 'Mahindra Kine', image: require('./assets/Mahindra Kine.jpg') },
  { name: 'Mahindra Mojo XT300', image: require('./assets/Mahindra Mojo XT300.jpg') },
  { name: 'Mahindra Pantero', image: require('./assets/Mahindra Pantero.jpg') },

    ],
    Vespa: [
      { name: 'Vespa SXL 125', image: require('./assets/Vespa SXL 125.jpg') },
    ],
    Kawasaki: [
      { name: 'Kawasaki z900', image: require('./assets/Kawasaki z900.jpg') },
  { name: 'Kawasaki Ninja 300', image: require('./assets/Kawasaki Ninja 300.jpg') },
  { name: 'Kawasaki Ninja400', image: require('./assets/Kawasaki Ninja400.jpg') },
  { name: 'Kawasaki Ninja 500', image: require('./assets/Kawasaki Ninja 500.jpg') },
  { name: 'Kawasaki Ninjazx6r', image: require('./assets/Kawasaki Ninjazx6r.jpg') },
  { name: 'Kawasaki Ninja z650', image: require('./assets/Kawasaki Ninja z650.jpg') },
  { name: 'Kawasaki Ninja h2r', image: require('./assets/Kawasaki Ninja h2r.jpg') },
  { name: 'Kawasaki Ninja zx10r', image: require('./assets/Kawasaki Ninja zx10r.jpg') },
  
    ],
    Triumph: [
      { name: 'Triumph Speed 400', image: require('./assets/Triumph Speed 400.jpg') },
  { name: 'Triumph Scrambler 400 X', image: require('./assets/Triumph Scrambler 400 X.jpg') },
  { name: 'Triumph Trident 660', image: require('./assets/Triumph Trident 660.jpg') },
  { name: 'Triumph Speed Twin', image: require('./assets/Triumph Speed Twin.jpg') },
  { name: 'Triumph Street Triple RS', image: require('./assets/Triumph Street Triple RS.jpg') },
  { name: 'Triumph Tiger 850 Sport', image: require('./assets/Triumph Tiger 850 Sport.jpg') },
  { name: 'Triumph Scrambler 900', image: require('./assets/Triumph Scrambler 900.jpg') },
  { name: 'Triumph Bonneville Bobber', image: require('./assets/Triumph Bonneville Bobber.jpg') },
  
    ],
    Harley: [
      { name: 'Harley-Davidson X440', image: require('./assets/Harley-Davidson X440.jpg') },
  { name: 'Harley-Davidson Sportster S', image: require('./assets/Harley-Davidson Sportster S.jpg') },
  { name: 'Harley-Davidson Nightster', image: require('./assets/Harley-Davidson Nightster.jpg') },
  { name: 'Harley-Davidson Fat Bob', image: require('./assets/Harley-Davidson Fat Bob.jpg') },
  { name: 'Harley-Davidson Fat Boy', image: require('./assets/Harley-Davidson Fat Boy.jpg') },
  { name: 'Harley-Davidson PAN America 1250', image: require('./assets/Harley-Davidson PAN America 1250.jpg') },
  { name: 'Harley-Davidson Heritage Classic', image: require('./assets/Harley-Davidson Heritage Classic.jpg') },
 
    ],
    Ducati: [
      { name: 'Ducati Panigale V4', image: require('./assets/Ducati Panigale V4.jpg') },
  { name: 'Ducati Panigale V2', image: require('./assets/Ducati Panigale V2.jpg') },
  { name: 'Ducati Diavel V4', image: require('./assets/Ducati Diavel V4.jpg') },
  { name: 'Ducati Scrambler 1100', image: require('./assets/Ducati Scrambler 1100.jpg') },
  { name: 'Ducati Streetfighter V4', image: require('./assets/Ducati Streetfighter V4.jpg') },
  { name: 'Ducati Panigale V4 R', image: require('./assets/Ducati Panigale V4 R.jpg') },
  { name: 'Ducati Multistrada V2', image: require('./assets/Ducati Multistrada V2.jpg') },
  
    ],
    BMW2: [
      { name: 'BMW g310rr', image: require('./assets/BMW g310rr.jpg') },
  { name: 'BMW G310gs', image: require('./assets/BMW G310gs.jpg') },
  { name: 'BMW G310r', image: require('./assets/BMW G310r.jpg') },
  { name: 'BMW S1000rr', image: require('./assets/BMW S1000rr.jpg') },
  { name: 'BMW F830gs', image: require('./assets/BMW F830gs.jpg') },
  { name: 'BMW R 1250 GS Adventure', image: require('./assets/BMW R 1250 GS Adventure.jpg') },
  { name: 'BMW M1000rr', image: require('./assets/BMW M1000rr.jpg') },
  { name: 'BMW R Nine T Scrambler', image: require('./assets/BMW R Nine T Scrambler.jpg') },
  { name: 'BMW R 1250 GS', image: require('./assets/BMW R 1250 GS.jpg') },
  
    ],
    Yamaha: [
      { name: 'Yamaha R15 V4', image: require('./assets/Yamaha R15 V4.jpg') },
  { name: 'Yamaha FZS Fi V4', image: require('./assets/Yamaha FZS Fi V4.jpg') },
  { name: 'Yamaha FZ FI', image: require('./assets/Yamaha FZ FI.jpg') },
  { name: 'Yamaha R15S', image: require('./assets/Yamaha R15S.jpg') },
  { name: 'Yamaha FZ X', image: require('./assets/Yamaha FZ X.jpg') },
  { name: 'Yamaha Aerox 155', image: require('./assets/Yamaha Aerox 155.jpg') },
  { name: 'Yamaha Ray ZR 125', image: require('./assets/Yamaha Ray ZR 125.jpg') },
  { name: 'Yamaha Fascino 125', image: require('./assets/Yamaha Fascino 125.jpg') },
  
    ],
    Suzuki2: [
      { name: 'Suzuki V-Strom 800DE', image: require('./assets/Suzuki V-Strom 800DE.jpg') },
      { name: 'Suzuki Access 125', image: require('./assets/SuzukiAccess 125.jpg') },
      { name: 'Suzuki Burgman Street 125', image: require('./assets/Suzuki Burgman Street 125.jpg') },
      { name: 'Suzuki Gixxer SF', image: require('./assets/Suzuki Gixxer SF.jpg') },
      { name: 'Suzuki V-Strom SX', image: require('./assets/Suzuki V-Strom SX.jpg') },
      { name: 'Suzuki Avenis 125', image: require('./assets/Suzuki Avenis 125.jpg') },
      { name: 'Suzuki Hayabusa', image: require('./assets/Suzuki Hayabusa.jpg') },
      { name: 'Suzuki Gixxer 250', image: require('./assets/Suzuki Gixxer 250.jpg') },
      { name: 'Suzuki Katana', image: require('./assets/Suzuki Katana.jpg') }
    ],    
    RoyalEnfield: [
      { name: 'Royal Enfield Hunter 350', image: require('./assets/Royal Enfield Hunter 350.jpg') },
  { name: 'Royal Enfield Classic 350', image: require('./assets/Royal Enfield Classic 350.jpg') },
  { name: 'Royal Enfield Continental GT 650', image: require('./assets/Royal Enfield Continental GT 650.jpg') },
  { name: 'Royal Enfield Bullet 350', image: require('./assets/Royal Enfield Bullet 350.jpg') },
  { name: 'Royal Enfield Shotgun 650', image: require('./assets/Royal Enfield Shotgun 650.jpg') },
  { name: 'Royal Enfield Meteor 350', image: require('./assets/Royal Enfield Meteor 350.jpg') },
  { name: 'Royal Enfield Himalayan 450', image: require('./assets/Royal Enfield Himalayan 450.jpg') },
  { name: 'Royal Enfield Interceptor 650', image: require('./assets/Royal Enfield Interceptor 650.jpg') },
  { name: 'Royal Enfield Super Meteor 650', image: require('./assets/Royal Enfield Super Meteor 650.jpg') },
  { name: 'Royal Enfield Scram 411', image: require('./assets/Royal Enfield Scram 411.jpg') },
  
    ],
    TVS: [
      { name: 'TVS Raider 125', image: require('./assets/TVS Raider 125.jpg') },
  { name: 'TVS Apache RTR 160', image: require('./assets/TVS Apache RTR 160.jpg') },
  { name: 'TVS Ntorq 125', image: require('./assets/TVS Ntorq 125.jpg') },
  { name: 'TVS Ronin', image: require('./assets/TVS Ronin.jpg') },
  { name: 'TVS Sport', image: require('./assets/TVS Sport.jpg') },
  { name: 'TVS Jupiter 125', image: require('./assets/TVS Jupiter 125.jpg') },
  { name: 'TVS Radeon', image: require('./assets/TVS Radeon.jpg') },
  
    ],
    Honda2: [
      { name: 'Honda SP 125', image: require('./assets/Honda SP 125.jpg') },
  { name: 'Honda Activa 6G', image: require('./assets/Honda Activa 6G.jpg') },
  { name: 'Honda Shine', image: require('./assets/Honda Shine.jpg') },
  { name: 'Honda Shine 100', image: require('./assets/Honda Shine 100.jpg') },
  { name: 'Honda Unicorn', image: require('./assets/Honda Unicorn.jpg') },
  { name: 'Honda Activa 125', image: require('./assets/Honda Activa 125.jpg') },
  { name: 'Honda Hornet 2.0', image: require('./assets/Honda Hornet 2.0.jpg') },
  { name: 'Honda SP160', image: require('./assets/Honda SP160.jpg') },
  { name: 'Honda Dio', image: require('./assets/Honda Dio.jpg') },
  { name: 'Honda CB350RS', image: require('./assets/Honda CB350RS.jpg') },
  
    ],
    Hero: [
      { name: 'Hero Xtreme 125R', image: require('./assets/Hero Xtreme 125R.jpg') },
  { name: 'Hero Splendor Plus', image: require('./assets/Hero Splendor Plus.jpg') },
  { name: 'Hero HF Deluxe', image: require('./assets/Hero HF Deluxe.jpg') },
  { name: 'Hero Splendor Plus Xtec', image: require('./assets/Hero Splendor Plus Xtec.jpg') },
  { name: 'Hero Xpulse 200 4V', image: require('./assets/Hero Xpulse 200 4V.jpg') },
  { name: 'Hero Mavrick 440', image: require('./assets/Hero Mavrick 440.jpg') },
  { name: 'Hero Karizma XMR', image: require('./assets/Hero Karizma XMR.jpg') },
  { name: 'Hero Glamour', image: require('./assets/Hero Glamour.jpg') },
    ],
    Bajaj: [
      { name: 'Bajaj Pulsar NS200', image: require('./assets/Bajaj Pulsar NS200.jpg') },
  { name: 'Bajaj Pulsar N160', image: require('./assets/Bajaj Pulsar N160.jpg') },
  { name: 'Bajaj Pulsar RS 200', image: require('./assets/Bajaj Pulsar RS 200.jpg') },
  { name: 'Bajaj Pulsar NS125', image: require('./assets/Bajaj Pulsar NS125.jpg') },
  
    ],
  };

  const models = allModels[brand.name] || [];

  // Inside Step2 component, after selecting the model
  const handleModelSelection = (modelName) => {
    setCurrentStep(3);
    navigation.navigate('Step3', { vehicle, brand, model: modelName, allModels, imageUrl: models.find(model => model.name === modelName).image });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Step 2</Text>
      <Text>Selected Vehicle: {vehicle}</Text>
      <Text>Selected Brand: {brand.name}</Text>
      <Text>Models:</Text>
      <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {models.map(model => (
            <TouchableOpacity key={model.name} activeOpacity={0.9} onPress={() => handleModelSelection(model.name)}>
              <View style={{ width: 170, height: 130, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, elevation: 10, paddingVertical: 10, borderRadius: 10, backgroundColor: 'white', margin: 5 }}>
                <Image source={model.image} style={{ width: 150, height: 100, resizeMode: 'contain' }} />
                <Text style={{ fontWeight: '300' }}>{model.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => {
        setCurrentStep(1); // Update current step when going back
        navigation.goBack();
      }}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const Step3 = ({ navigation, setCurrentStep, route }) => {
  const [plateSections, setPlateSections] = useState(['', '', '', '']);
  const refs = useRef([]);
  const { vehicle, brand, model, allModels } = route.params;
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }

  const handleChange = (input, index) => {
    let filteredInput;

    // Handle backspace functionality
    if (input === '' && index > 0) {
      // If the input is empty and not in the first section, move to the previous section
      refs.current[index - 1].focus();
    }

    // Limit the first section to accept only two alphabets
    if (index === 0) {
      filteredInput = input.replace(/[^a-zA-Z]/g, '').toUpperCase();
      if (filteredInput.length > 2) {
        filteredInput = filteredInput.substring(0, 2);
      }
    } else if (index === 1) {
      // Limit the second section to accept only two numbers
      filteredInput = input.replace(/[^0-9]/g, '');
      if (filteredInput.length > 2) {
        filteredInput = filteredInput.substring(0, 2);
      }
    } else if (index === 2) {
      // Limit the third section to accept only two alphabets
      filteredInput = input.replace(/[^a-zA-Z]/g, '').toUpperCase();
      if (filteredInput.length > 2) {
        filteredInput = filteredInput.substring(0, 2);
      }
    } else {
      // Allow alphabets and numbers for the rest of the sections
      filteredInput = input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }

    const updatedSections = [...plateSections];
    updatedSections[index] = filteredInput;
    setPlateSections(updatedSections);

    if (index < plateSections.length - 1 && filteredInput.length === 2) {
      // When an input is filled, focus on the next input
      refs.current[index + 1].focus();
    }
  };

  const handleSubmit = async () => {
    // Combine plate sections into a single string
    const plateNumber = plateSections.join('');
    const imageUrl = allModels[brand.name].find(item => item.name === model).image;

    console.log(imageUrl);

    try {
      // Assuming you have access to the current user's UID
      const userId = firebase.auth().currentUser.uid;

      // Get reference to the 'users' collection and the specific user document
      const userRef = firebase.firestore().collection('users').doc(userId);
      // Add the vehicle details to a subcollection under the user document
      await userRef.collection('vehicles').add({
        vehicle,
        brand: brand.name,
        model,
        plateNumber,
        imageUrl: imageUrl,
      });

      navigation.navigate('Home', { refresh: true });
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error: Could not add details. Please try again later.');
    }
  };

  return (
    <View style={styles.plateContainer}>
      <Text>Registration plate number</Text>
      <View style={styles.plateInputContainer}>
            <Image source={require('./assets/IND.jpg')} style={{ width: 50, height: 60,}} />
        {plateSections.map((section, index) => (
          <View key={index} style={[styles.plateSectionContainer, index !== 0 && styles.inputWithBorder]}>
            <TextInput
              ref={(input) => (refs.current[index] = input)}
              style={styles.plateInput}
              onChangeText={(text) => handleChange(text, index)}
              value={section}
              maxLength={index === 0 || index === 2 ? 2 : (index === 1 ? 2 : 4)}
              placeholder={index === 0 ? 'AP' : (index === 1 ? '21' : (index === 2 ? 'AB' : '1234'))}
              keyboardType={index === 0 || index === 2 ? 'default' : 'number-pad'}
            />
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        setCurrentStep(2);
        navigation.goBack();
      }}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const VehicleDetailsScreen = ({ route }) => {
  const { vehicle, brand, model, plateNumber, imageUrl } = route.params;
  console.log(imageUrl);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Vehicle: {vehicle}</Text>
      <Text>Brand: {brand}</Text>
      <Text>Model: {model}</Text>
      <Text>Plate Number: {plateNumber}</Text>
      <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
    </View>
  );
};

const VehicleScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }

  // Update current step when navigating back
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'GO_BACK') {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
      }
    });

    return unsubscribe;
  },);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
          <View style={{ width: 100, height: 6, borderRadius: 10, backgroundColor: currentStep >= 1 ? '#0070C0' : 'grey' }} />
          <View style={{ width: 100, height: 6, borderRadius: 10, backgroundColor: currentStep >= 2 ? '#0070C0' : 'grey' }} />
          <View style={{ width: 100, height: 6, borderRadius: 10, backgroundColor: currentStep >= 3 ? '#0070C0' : 'grey' }} />
        </View>
      </View>
      <Stack.Navigator initialRouteName="Step1" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Step1">
          {props => <Step1 {...props} setCurrentStep={setCurrentStep} />}
        </Stack.Screen>
        <Stack.Screen name="Step2">
          {props => <Step2 {...props} setCurrentStep={setCurrentStep} />}
        </Stack.Screen>
        <Stack.Screen name="Step3">
          {props => <Step3 {...props} setCurrentStep={setCurrentStep} />}
        </Stack.Screen>
      </Stack.Navigator>
    </View>
  );
};

const TabNavigator = ({ navigation }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
  
        const storedVehicleData = await AsyncStorage.getItem('vehicleData');
        if (storedVehicleData) {
          setVehicleDetails(JSON.parse(storedVehicleData));
        }
  
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
          const userData = userDoc.data();
          setUserData(userData);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
  
          const userVehicleRef = await firebase.firestore().collection('users').doc(currentUser.uid).collection('vehicles').get();
          if (!userVehicleRef.empty) {
            const vehicleDoc = userVehicleRef.docs[0];
            const vehicleData = vehicleDoc.data();
            console.log('Vehicle Data:', vehicleData);
            setVehicleDetails(vehicleData);
            await AsyncStorage.setItem('vehicleData', JSON.stringify(vehicleData));
          } else {
            // Clear AsyncStorage item for vehicleData when there  vehicles
            await AsyncStorage.removeItem('vehicleData');
            setVehicleDetails(null);
          }
        } else {
          console.log('No user logged in.');
          setUserData(null);
          setVehicleDetails(null);
          await AsyncStorage.removeItem('userData');
          await AsyncStorage.removeItem('vehicleData');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }
  

  const updateCartItemCount = (cartItems) => {
    const count = calculateCartItemCount(cartItems);
    setCartItemCount(count);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: (userData ? `👋Welcome ${userData.username}` : 'Home'),
        headerTitleStyle: { fontSize: 16 },
        headerRight: () => (
          <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
            {vehicleDetails ? ( // If vehicle details exist, display the vehicle details
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 10 }}>{vehicleDetails.brand} {vehicleDetails.model} </Text>
                <TouchableOpacity>
                  <Image source={require('./assets/notification.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
              </View>
            ) : (
              <><AddVehicleButton navigation={navigation} />
                <TouchableOpacity>
                  <Image source={require('./assets/notification.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity></>
            )}
          </View>
        ),
        tabBarStyle: {
          height: 60,
          shadowColor: '#171717',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ route }) => ({
          tabBarLabel: 'Home',
          tabBarLabelStyle: {
            marginBottom: 5,
          },
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('./assets/home-f.png') : require('./assets/home.png')} style={{ width: 24, height: 24 }} />
          ),
          // Show header only for the Home 
          headerShown: true,
          headerStyle: {
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
              },
              android: {
                shadowColor: '#171717',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              },
            }),
          },
        })}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={({ route }) => ({
          tabBarLabel: 'Map',
          tabBarLabelStyle: {
            marginBottom: 5,
          },
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('./assets/map-f.png') : require('./assets/map.png')} style={{ width: 24, height: 24 }} />
          ),
          headerShown: true,
          headerStyle: {
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
              },
              android: {
                shadowColor: '#171717',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              },
            }),
          },
        })}
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
                  style={{ width: 40, height: 40, }}
                />
              </View>
            );
          },
          headerShown: true,
          headerStyle: {
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
              },
              android: {
                shadowColor: '#171717',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              },
            }),
          },
        })}
      />

      <Tab.Screen
        name="Cart"
        options={({ route }) => ({
          tabBarLabel: 'Cart',
          tabBarLabelStyle: {
            marginBottom: 5,
          },
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./assets/cart-f.png') : require('./assets/cart.png')}
              style={{ width: 24, height: 24 }}
            />
          ),
          headerShown: true,
          headerStyle: {
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
              },
              android: {
                shadowColor: '#171717',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              },
            }),
          },
          tabBarBadge: cartItemCount > 0 ? cartItemCount : null,
        })}
      >
        {(props) => <CartScreen {...props} updateCartItemCount={updateCartItemCount} />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({
          tabBarLabel: 'Settings',
          tabBarLabelStyle: {
            marginBottom: 5,
          },
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('./assets/profile-f.png') : require('./assets/profile.png')} style={{ width: 24, height: 24, }} />
          ),
          // Show header only for the Profile Screen
          headerShown: false,
          headerStyle: {
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
              },
              android: {
                shadowColor: '#171717',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              },
            }),
          },
        })}
      />
    </Tab.Navigator>
  );
};
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if the user token exists in Asynorage
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          // User is authenticated, set isLoggedIn to true
          setIsLoggedIn(true);
        } else {
          // User token doesn't exist, set isLoggedIn to false
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error.message);
      } finally {
        setShowInitialScreen(false);
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    // Show loading indicator while checking authentication status
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0070C0" />
      </View>
    );
  }

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
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Main" : "Login"} screenOptions={{
        ...TransitionPresets.ScaleFromCenterAndroid // Apply smooth slide animation
      }}>
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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Help and Support"
          component={HelpScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="SearchResult"
          component={SearchResultScreen}
          options={{ headerShown: false }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="SecurityScreen"
          component={SecurityScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Terms and Policies"
          component={TermsScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Add Vehicle"
          component={VehicleScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="VehicleDetailsScreen"
          component={VehicleDetails}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Language"
          component={LanguageScreen}
          options={{ headerShown: false }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Chatbot"
          component={Chatbot}
          options={{ headerShown: false }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Diagnostic Services"
          component={DiagnosticsScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Tire Services"
          component={TireScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Electrical & Electronics Services"
          component={EEScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Brake Services"
          component={BrakeScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Power System Services"
          component={PowerScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Vehicle Other Services"
          component={VOthersScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Fuel Delivery Services"
          component={FuelScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Dead Battery Services"
          component={BatteryScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Engine Problem Services"
          component={EngineScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Tow Truck Services"
          component={TowScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Emergency Other Services"
          component={EOthersScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Fluid Top-Ups Services"
          component={FluidScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Air Filter Replacement Services"
          component={FilterScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Spark Plug Replacement Services"
          component={SparkScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Exhaust System Services"
          component={ExhaustScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Routine Maintenance Services"
          component={RoutineScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="General Other Services"
          component={GOthersScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ headerShown: true }} // Hide header for main tab navigator
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);

  const [loaded, error] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

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

      // Check if the email is verified
      const user = userCredential.user;
      if (!user.emailVerified) {
        await user.sendEmailVerification(); // Send verification email
        Alert.alert("Email Verification", "A verification email has been sent to your email address. Please verify your email to continue.");
        setIsLoading(false);
        return;
      }

      // Once signed in successfully, store the user token in AsyncStorage
      const token = await user.getIdToken();
      await AsyncStorage.setItem('userToken', token);
      console.log("User token:", token);
      navigation.replace('Main');
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert('Login failed', error.message);
      setIsLoading(false);
    }
  };

  if (!loaded || isLoading) {
    return (
      <View style={styles.preloader}>
        {!loaded && <Text>Loading Fonts...</Text>}
        {isLoading && <ActivityIndicator size="large" color="#9E9E9E" />}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image source={require('./assets/AppLogo1.jpg')} style={styles.logo} />
        <Image source={require('./assets/Title.png')} style={styles.title} />
      </View>

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <View style={styles.inputView}>
          <Image source={require('./assets/user.png')} style={{ width: 20, height: 20, marginRight: 5, marginLeft: 5 }} />
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={(email) => setEmail(email)}
            onSubmitEditing={() => passwordInputRef.current.focus()} // Move focus to password field on submit
          />
        </View>

        <View style={styles.inputView}>
          <Image source={require('./assets/password.png')} style={{ width: 20, height: 20, marginRight: 5, marginLeft: 5 }} />
          <TextInput
            ref={passwordInputRef}
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={!showPassword}
            onChangeText={(password) => setPassword(password)}
            onSubmitEditing={() => console.log('Submit')} // You can perform your submission logic here
          />
          {password.length > 0 && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image source={showPassword ? require('./assets/eye-off.png') : require('./assets/eye.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
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

function SignupScreen({ navigation }) {
  const [signupUsername, setUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupGender, setSignupGender] = useState('');
  const [signupPhoneNumber, setSignupPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [isTermsPressed, setIsTermsPressed] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const phoneNumberInputRef = useRef(null);
  const genderInputRef = useRef(null);
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }

  const updateInputVal = (val, prop) => {
    switch (prop) {
      case 'signupUsername':
        setUsername(val);
        break;
      case 'signupEmail':
        setSignupEmail(val);
        break;
      case 'signupPassword':
        setSignupPassword(val);
        break;
      default:
        break;
    }
  };

  const TermsNavigationScreen = async () => {
    navigation.navigate('Terms and Policies');
  }

  const generateUniqueUserId = (() => {
    return () => {
      userId++; // Increment the last used user ID
      return userId;
    };
  })();
  const handleSignup = async () => {
    try {
      console.log("Signup details:", signupUsername, signupEmail, signupPassword);
      if (!signupUsername || !signupGender || !signupPhoneNumber || !signupEmail || !signupPassword || !confirmPassword) {
        Alert.alert("Please fill in all fields.");
        return;
      }

      if (/\s/.test(signupUsername)) {
        Alert.alert("Username should not contain spaces.");
        return;
      }

      if (signupPassword !== confirmPassword) {
        Alert.alert("Passwords do not match.");
        return;
      }

      if (!countryCode) {
        Alert.alert("Please select a country code.");
        return;
      }

      if (!/^\d{10}$/.test(signupPhoneNumber)) {
        Alert.alert("Please enter a valid 10-digit phone number.");
        return;
      }

      if (!signupEmail.toLowerCase().endsWith("gmail.com") && !signupEmail.toLowerCase().endsWith(".alliance.edu.in")) {
        Alert.alert("Email must end with 'gmail.com' or '.alliance.edu.in'");
        return;
      }

      if (signupPassword.length < 8) {
        Alert.alert("Password must be at least 8 characters long.");
        return;
      }

      if (!/(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}/.test(signupPassword)) {
        Alert.alert("Password must contain at least one number, one special character, and be 8-12 characters long.");
        return;
      }

      if (!isTermsPressed) {
        Alert.alert("Please agree to the terms and conditions to sign up.");
        return;
      }

      const phoneNumberWithCountryCode = `${countryCode}${signupPhoneNumber}`;

      setIsLoading(true);

      const usernameSnapshot = await firebase.firestore().collection('users').where('username', '==', signupUsername).get();
      if (!usernameSnapshot.empty) {
        Alert.alert("Username already exists. Please choose a different one.");
        setIsLoading(false);
        return;
      }

      // Check if phone number exists
      const phoneNumberSnapshot = await firebase.firestore().collection('users').where('phoneNumber', '==', signupPhoneNumber).get();
      if (!phoneNumberSnapshot.empty) {
        Alert.alert("Phone number already exists. Please choose a different one.");
        setIsLoading(false);
        return;
      }
      const numericUserId = generateUniqueUserId();
      // Proceed with signup
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(signupEmail, signupPassword);
      const userId = userCredential.user.uid; // Get the unique user ID
      await firebase.firestore().collection('users').doc(userId).set({
        userId: numericUserId,
        username: signupUsername,
        email: signupEmail,
        gender: signupGender,
        phoneNumber: signupPhoneNumber,
        countryCode: countryCode,
        password: signupPassword,
      });

      console.log('User signed up:', userCredential.user);

      setIsLoading(false);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('Signup failed', error.message);
      setIsLoading(false);
    }
  };

  const handleCheckboxPress = () => {
    setIsTermsPressed(!isTermsPressed);
  };

  if (isLoading) {
    return (
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

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
            placeholder="Name"
            value={signupUsername}
            onChangeText={(val) => updateInputVal(val, 'signupUsername')}
            placeholderTextColor="#003f5c"
            onSubmitEditing={() => { genderInputRef.current.focus(); }} // Move focus to gender input on Enter press
          />
        </View>

        <View style={styles.inputView}>
          {/* Replace TextInput with Picker for gender */}
          <Picker
            style={styles.TextInput}
            selectedValue={signupGender}
            onValueChange={(itemValue) => setSignupGender(itemValue)}
            ref={genderInputRef} // Reference to gender input
          >
            <Picker.Item label="Select Gender" value="" color='#003f5c' />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <View style={styles.phoneView}>
          <View style={{ borderWidth: 1, height: 45, width: 50, borderRadius: 5, marginRight: 5, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={{ height: 45, width: 45, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{}}>{countryCode}</Text>
              {!countryCode && <Feather name="chevron-down" size={20} color="#003f5c" style={{ position: 'absolute', right: 5 }} />}
            </TouchableOpacity>
            <CountryPicker
              show={show}
              // when picker button press you will get the country object with dial code
              pickerButtonOnPress={(item) => {
                setCountryCode(item.dial_code);
                setShow(false);
              }}
            />
          </View>
          <View style={{ borderWidth: 1, borderRadius: 5, width: 233, height: 45 }}>
            <TextInput
              style={styles.TextInput}
              placeholder="Phone Number"
              placeholderTextColor="#003f5c"
              keyboardType="numeric" // Set keyboardType to numeric
              onChangeText={(signupPhoneNumber) => setSignupPhoneNumber(signupPhoneNumber)}
              onSubmitEditing={() => { emailInputRef.current.focus(); }} // Move focus to email input on Enter press
            />
          </View>
        </View>

        <View style={styles.inputView}>
          <TextInput
            ref={emailInputRef}
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={(signupEmail) => updateInputVal(signupEmail, 'signupEmail')}
            onSubmitEditing={() => passwordInputRef.current.focus()} // Move focus to password field on submit
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            ref={passwordInputRef}
            style={styles.TextInput}
            placeholder="Create Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={!showCreatePassword}
            onChangeText={(signupPassword) => updateInputVal(signupPassword, 'signupPassword')}
            onSubmitEditing={() => confirmPasswordInputRef.current.focus()} // Move focus to confirm password field on submit
          />
          {signupPassword.length > 0 && (
            <TouchableOpacity onPress={() => setShowCreatePassword(!showCreatePassword)}>
              <Image source={showCreatePassword ? require('./assets/eye-off.png') : require('./assets/eye.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Confirm Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={!showConfirmPassword}
            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
            ref={confirmPasswordInputRef} // Reference to confirm password input
          />
          {confirmPassword.length > 0 && (
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Image source={showConfirmPassword ? require('./assets/eye-off.png') : require('./assets/eye.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={handleCheckboxPress}
        >
          <Text style={styles.checkbox}>
            {isTermsPressed ? '✓' : '◻'}
          </Text>
          <Text style={{ fontSize: 14, color: 'black', fontWeight: '400', }}>I agree to the </Text>
          <Text
            style={[styles.termsLink, styles.termsText, isTermsPressed || { color: 'blue' }]}
            onPress={handleCheckboxPress}
          >
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={TermsNavigationScreen}
            >
              <Text style={{ fontSize: 14, color: 'black', fontWeight: '500', color: 'blue', textDecorationLine: 'underline' }}>
                Terms and Conditions
              </Text>
            </TouchableOpacity>
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

const SearchResultScreen = ({ route, navigation }) => {
  const { search } = route.params;
  const [searchText, setSearchText] = useState(search);
  const [filteredServices, setFilteredServices] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus on the search input when the component mounts
    inputRef.current.focus();
    // Filter services on initial load
    filterServices(searchText);
  }, []);
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }

  // Dummy data for demonstration
  const topServices = [
    { id: 1, name: 'Oil Change', price: '₹500 - 1,000/-', image: require('./assets/Oil-change.jpg') },
    { id: 2, name: 'Tire Rotation', price: '₹1,500 - 4,000/-', image: require('./assets/tire-rotation.jpg') },
    { id: 3, name: 'Tow Truck', price: '₹1,999 - 3,099', image: require('./assets/toe-truck.jpg') },
    { id: 4, name: 'Break Inspection', price: '₹2,000 - 7,000', image: require('./assets/break-inspection.jpg') },
    { id: 5, name: 'Engine Diagnostics', price: '₹3,000 - 10,000', image: require('./assets/engine-diagnostics.jpg') },
  ];

  const allServices = [
    { name: 'Diagnostic Services', image: require('./assets/analytic.png') },
    { name: 'Tire Services', image: require('./assets/wheel.png') },
    { name: 'Electrical & Electronics Services', image: require('./assets/electrical-engineer.png') },
    { name: 'Brake Services', image: require('./assets/brakes.png') },
    { name: 'Power System Services', image: require('./assets/fuel-exhaust.png') },
    { name: 'Vehicle Other Services', image: require('./assets/more.png') },
    { name: 'Fuel Delivery Services', image: require('./assets/fuel.png') },
    { name: 'Dead Battery Services', image: require('./assets/accumulator.png') },
    { name: 'Engine Problem Services', image: require('./assets/piston.png') },
    { name: 'Tow Truck Services', image: require('./assets/tow.png') },
    { name: 'Emergency Other Services', image: require('./assets/more.png') },
    { name: 'Fluid Top-Ups Services', image: require('./assets/engine-oil.png') },
    { name: 'Air Filter Replacement Services', image: require('./assets/air-filter.png') },
    { name: 'Spark Plug Replacement Services', image: require('./assets/spark-plug.png') },
    { name: 'Exhaust System Services', image: require('./assets/exhaust-pipe.png') },
    { name: 'Routine Maintenance Services', image: require('./assets/schedule.png') },
    { name: 'General Other Services', image: require('./assets/more.png') },
    // Add other services as needed
  ];

  const filterServices = (query) => {
    const keywords = query.toLowerCase().split(' ');

    const filteredTopServices = topServices.filter(service =>
      keywords.every(keyword =>
        service.name.toLowerCase().includes(keyword)
      )
    );

    const filteredAllServices = allServices.filter(service =>
      keywords.every(keyword =>
        service.name.toLowerCase().includes(keyword)
      )
    );

    setFilteredServices([...filteredTopServices, ...filteredAllServices]);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    filterServices(text);
  };

  // Handler for clearing search input
  const clearSearch = () => {
    setSearchText('');
    filterServices('');
  };

  const addToCart = (item) => {
    navigation.navigate('Cart', { item, addToCart: true });
  };

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <SearchBar
        placeholder="Search for services..."
        value={searchText}
        onChangeText={handleSearchChange}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={[styles.input, { color: 'black' }]}
        showClearIcon={true}
        ref={inputRef}
      />
      <ScrollView>
        {searchText !== '' && (
          filteredServices.length > 0 ? (
            <View>
              {filteredServices.map(service => (
                <TouchableOpacity
                  key={service.name}
                  style={{
                    height: 60,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgray',
                    paddingVertical: 10,
                    paddingHorizontal: 20
                  }}
                  onPress={() => {
                    // Check if the service exists in allServices
                    const selectedService = allServices.find(s => s.name === service.name);
                    if (selectedService) {
                      navigation.navigate(selectedService.name);
                    }
                  }}
                >
                  <Image source={service.image} style={{ width: 50, height: 50, resizeMode: 'cover', borderRadius: 10, marginRight: 15 }} />
                  <View style={{ flex: 1 }}>
                    <Text>{service.name}</Text>
                    <Text>{service.price}</Text>
                    { /* Render a small text for allServices */}
                    {!topServices.some(topService => topService.name === service.name) && ( // Check if service is not in topServices
                      <Text style={{ fontSize: 10, color: 'gray' }}>Tap for more details</Text>
                    )}

                  </View>
                  {topServices.some(topService => topService.name === service.name) && ( // Check if service is in topServices
                    <Button title="Add to Cart" onPress={() => addToCart(service)} style={styles.button} color="#c05000" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Image source={require('./assets/no-result.png')} style={{ width: 200, height: 200 }} />
              <Text style={{ textAlign: 'center', fontWeight: '300', fontSize: 13, color: 'gray' }}>Oops! Couldn't find any results.</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const { t } = useTranslation();
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }

  const updateSearch = (text) => {
    setSearch(text);
  };

  const addToCart = (item) => {
    navigation.navigate('Cart', { item, addToCart: true });
  };

  const goToSearchResults = () => {
    navigation.navigate('SearchResult', { search });
  };

  return (
    <ScrollView>
      <View style={styles.greyContainer}>
        <SearchBar
          placeholder={t("Search for services...")}
          onChangeText={updateSearch}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={[styles.input, { color: 'black' }]}
          showClearIcon={true}
          onFocus={goToSearchResults}
        />
        <Text style={styles.topServicesText}>────────── Top Services ──────────</Text>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                activeOpacity={0.7} onPress={() => { }}>
                <Image source={require('./assets/Oil-change.jpg')} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.imageTitle}>Oil Change</Text>
              <Text style={styles.priceText}>₹500 - 1,000/-</Text>
              <Button title="Add to Cart" onPress={() => addToCart({ id: 1, name: 'Oil Change', price: '500', image: require('./assets/Oil-change.jpg') })} style={styles.button} color="#c05000" />
            </View>
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                activeOpacity={0.7} onPress={() => { }}>
                <Image source={require('./assets/tire-rotation.jpg')} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.imageTitle}>Tire Rotation</Text>
              <Text style={styles.priceText}>₹1,500 - 4,000/-</Text>
              <Button title="Add to Cart" onPress={() => addToCart({ id: 2, name: 'Tire Rotation', price: '1500', image: require('./assets/tire-rotation.jpg') })} style={styles.button} color="#c05000" />
            </View>
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                activeOpacity={0.7} onPress={() => { }}>
                <Image source={require('./assets/toe-truck.jpg')} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.imageTitle}>Tow Truck</Text>
              <Text style={styles.priceText}>₹1,999 - 3,099/-</Text>
              <Button title="Add to Cart" onPress={() => addToCart({ id: 3, name: 'Tow Truck', price: '₹1,999 - 3,099', image: require('./assets/toe-truck.jpg') })} style={styles.button} color="#c05000" />
            </View>
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                activeOpacity={0.7} onPress={() => { }}>
                <Image source={require('./assets/break-inspection.jpg')} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.imageTitle}>Break Inspection</Text>
              <Text style={styles.priceText}>₹2,000 - 7,000/-</Text>
              <Button title="Add to Cart" onPress={() => addToCart({ id: 4, name: 'Break Inspection', price: '₹2,000 - 7,000', image: require('./assets/break-inspection.jpg') })} style={styles.button} color="#c05000" />
            </View>
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                activeOpacity={0.7} onPress={() => { }}>
                <Image source={require('./assets/engine-diagnostics.jpg')} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.imageTitle}>Engine Diagnostics</Text>
              <Text style={styles.priceText}>₹3,000 - 10,000/-</Text>
              <Button title="Add to Cart" onPress={() => addToCart({ id: 5, name: 'Engine Diagnostics', price: '₹3,000 - 10,000', image: require('./assets/engine-diagnostics.jpg') })} style={styles.button} color="#c05000" />
            </View>
          </ScrollView>
        </View>
        <Text style={styles.topServicesText}>────────── Top Mechanics ──────────</Text>
        <View style={styles.wrapper}>
          <Swiper showsButtons={false} loop={true} autoplay={true}>
            <View style={styles.slide1}>
              <Image source={require('./assets/mech1.png')} style={styles.imageSlider} />
              <View style={styles.descContainer}>
                <Text style={styles.boldText}>Emily</Text>
                <Text style={styles.normalText}>18 years of experience.</Text>
                <Text style={styles.normalText}>4500+ services</Text>
                <Text style={styles.boldText}>Skills</Text>
                <Text style={styles.normalText}>Mechanical Aptitude, Welding,</Text>
                <Text style={styles.normalText}>Prioritizing.</Text>
                <Text style={styles.boldText}>Ratings</Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.ratingText}>4.8  </Text>
                  <Rating
                    type='star'
                    ratingCount={5} // Set the total number of stars
                    startingValue={4.8} // Set the rating value
                    imageSize={20}
                    readonly={true}
                    style={styles.rating}
                  />
                </View>
              </View>
            </View>
            <View style={styles.slide2}>
              <Image source={require('./assets/mech2.jpg')} style={styles.imageSlider} />
              <View style={styles.descContainer}>
                <Text style={styles.boldText}>Michael</Text>
                <Text style={styles.normalText}>15 years of experience.</Text>
                <Text style={styles.normalText}>4200+ services</Text>
                <Text style={styles.boldText}>Skills</Text>
                <Text style={styles.normalText}> Transmission Repair, Clutch</Text>
                <Text style={styles.normalText}>Replacements.</Text>
                <Text style={styles.boldText}>Ratings</Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.ratingText}>4.6  </Text>
                  <Rating
                    type='star'
                    ratingCount={5} // Set the total number of stars
                    startingValue={4.6} // Set the rating value
                    imageSize={20}
                    readonly={true}
                    style={styles.rating}
                  />
                </View>
              </View>
            </View>
            <View style={styles.slide3}>
              <Image source={require('./assets/mech3.jpeg')} style={styles.imageSlider} />
              <View style={styles.descContainer}>
                <Text style={styles.boldText}>James</Text>
                <Text style={styles.normalText}>12 years of experience.</Text>
                <Text style={styles.normalText}>3000+ services</Text>
                <Text style={styles.boldText}>Skills</Text>
                <Text style={styles.normalText}>Clutch Replacement, Gear Adjustment, </Text>
                <Text style={styles.normalText}>Torque Converter Servicing.</Text>
                <Text style={styles.boldText}>Ratings</Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.ratingText}>4.3  </Text>
                  <Rating
                    type='star'
                    ratingCount={5} // Set the total number of stars
                    startingValue={4.3} // Set the rating value
                    imageSize={20}
                    readonly={true}
                    style={styles.rating}
                  />
                </View>
              </View>
            </View>
            <View style={styles.slide4}>
              <Image source={require('./assets/mech4.jpeg')} style={styles.imageSlider} />
              <View style={styles.descContainer}>
                <Text style={styles.boldText}>William</Text>
                <Text style={styles.normalText}>8 years of experience.</Text>
                <Text style={styles.normalText}>2400+ services</Text>
                <Text style={styles.boldText}>Skills</Text>
                <Text style={styles.normalText}>Automotive Systems, Fluid Flushes,</Text>
                <Text style={styles.normalText}>Metalworking, Automated Diagnostics.</Text>
                <Text style={styles.boldText}>Ratings</Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.ratingText}>4.2  </Text>
                  <Rating
                    type='star'
                    ratingCount={5} // Set the total number of stars
                    startingValue={4.2} // Set the rating value
                    imageSize={20}
                    readonly={true}
                    style={styles.rating}
                  />
                </View>
              </View>
            </View>
            <View style={styles.slide5}>
              <Image source={require('./assets/mech5.jpg')} style={styles.imageSlider} />
              <View style={styles.descContainer}>
                <Text style={styles.boldText}>Benjamin</Text>
                <Text style={styles.normalText}>6 years of experience.</Text>
                <Text style={styles.normalText}>1500+ services</Text>
                <Text style={styles.boldText}>Skills</Text>
                <Text style={styles.normalText}>Recommendations, Timely Repairs,</Text>
                <Text style={styles.normalText}>Client Relationships.</Text>
                <Text style={styles.boldText}>Ratings</Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.ratingText}>4.1  </Text>
                  <Rating
                    type='star'
                    ratingCount={5} // Set the total number of stars
                    startingValue={4.1} // Set the rating value
                    imageSize={20}
                    readonly={true}
                    style={styles.rating}
                  />
                </View>
              </View>
            </View>
          </Swiper>
        </View>
        <View style={styles.reviewContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}>
            <View style={styles.review}>
              <Image source={require('./assets/p1.png')} style={styles.reviewImage} />
              <Text style={styles.reviewName}>Deepika</Text>
              <View style={styles.reviewImp}>
                <Text style={styles.reviewWords}>Fast</Text>
                <Text style={styles.reviewWords}>Reliable</Text>
                <Text style={styles.reviewWords}>Swiftly connected</Text>
              </View>
              <Text style={styles.reviewStyle}>"This incredible app swiftly connected me with a nearby mechanic when my car broke down. Fast, reliable, and highly recommended for any driver in need."</Text>
            </View>
            <View style={styles.review}>
              <Image source={require('./assets/p2.jpg')} style={styles.reviewImage} />
              <Text style={styles.reviewName}>Aisha</Text>
              <View style={styles.reviewImp}>
                <Text style={styles.reviewWords}>On call</Text>
                <Text style={styles.reviewWords}>Go-to</Text>
                <Text style={styles.reviewWords}>Personal mechanic</Text>
              </View>
              <Text style={styles.reviewStyle}>"With its user-friendly interface and quick response times, this app is my go-to for all car-related needs. It's like having a personal mechanic on call!"</Text>
            </View>
            <View style={styles.review}>
              <Image source={require('./assets/p3.jpg')} style={styles.reviewImage} />
              <Text style={styles.reviewName}>Chandrasekhar</Text>
              <View style={styles.reviewImp}>
                <Text style={styles.reviewWords}>Convenience</Text>
                <Text style={styles.reviewWords}>Lifesaver</Text>
                <Text style={styles.reviewWords}>Phone</Text>
              </View>
              <Text style={styles.reviewStyle}>"The convenience of booking service appointments from my phone is unmatched. This app's rapid roadside assistance has truly been a lifesaver."</Text>
            </View>
            <View style={styles.review}>
              <Image source={require('./assets/p4.jpg')} style={styles.reviewImage} />
              <Text style={styles.reviewName}>Anushka</Text>
              <View style={styles.reviewImp}>
                <Text style={styles.reviewWords}>Must-have</Text>
                <Text style={styles.reviewWords}>Drivers</Text>
                <Text style={styles.reviewWords}>Five-star</Text>
              </View>
              <Text style={styles.reviewStyle}>"Five-star service every time! From flat tires to engine trouble, this app consistently connects me with skilled mechanics who get the job done."</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const MapScreen = ({navigation}) => {
  const [marker, setMarker] = useState(null);
  const [markerAddress, setMarkerAddress] = useState('');

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    try {
      const address = await reverseGeocode(coordinate);
      setMarker({ coordinate });
      setMarkerAddress(address);
    } catch (error) {
      console.error('Error fetching address:', error);
      Alert.alert('Error', 'Failed to fetch address for the selected location.');
    }
  };

  const reverseGeocode = async (coordinate) => {
    const { latitude, longitude } = coordinate;
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
    const data = await response.json();
    if (response.ok && data && data.display_name) {
      return data.display_name;
    } else {
      throw new Error('Failed to fetch address');
    }
  };

  const handleSaveAddress = () => {
    // You can save the markerAddress in a variable or pass it to another component or function
    console.log('Marker Address:', markerAddress);
    navigation.navigate('Cart', { address: markerAddress });
    // You can also perform other actions with the address as needed
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        onPress={handleMapPress}
      >
        {marker && (
          <Marker
            coordinate={marker.coordinate}
            title="Marker"
            description={markerAddress}
          />
        )}
      </MapView>
      <TouchableOpacity
        style={{position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,}}
        onPress={() => setMarker(null)}
      >
        <Text style={{color: 'white',
    fontWeight: 'bold',}}>Clear Marker</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,left: 'auto', right: 20 }}
        onPress={handleSaveAddress}
      >
        <Text style={{color: 'white',
    fontWeight: 'bold',}}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const ServiceCheckbox = ({ label, isChecked, onPress }) => {
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loa
  }
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={styles.checkboxContainer}>
      <Text style={styles.checkbox}>{isChecked ? '☑' : '☐'}</Text>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const DiagnosticTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const DiagnosticFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const DiagnosticsScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="DiagnosticTwoWheelerScreen"
      component={DiagnosticTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="DiagnosticFourWheelerScreen"
      component={DiagnosticFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const TireTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Tire Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Tire Inspection"
              isChecked={selectedServices.some(service => service.name === "Tire Inspection")}
              onPress={() => toggleService({ id: 1, name: "Tire Inspection", price: "₹500", image: require('./assets/wheel.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Tire Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Repair"
              isChecked={selectedServices.some(service => service.name === "Tire Repair")}
              onPress={() => toggleService({ id: 2, name: "Tire Repair", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Replacement"
              isChecked={selectedServices.some(service => service.name === "Tire Replacement")}
              onPress={() => toggleService({ id: 3, name: "Tire Replacement", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Rotation"
              isChecked={selectedServices.some(service => service.name === "Tire Rotation")}
              onPress={() => toggleService({ id: 4, name: "Tire Rotation", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Mounting and Demounting"
              isChecked={selectedServices.some(service => service.name === "Tire Mounting and Demounting")}
              onPress={() => toggleService({ id: 5, name: "Tire Mounting and Demounting", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Alignment"
              isChecked={selectedServices.some(service => service.name === "Tire Alignment")}
              onPress={() => toggleService({ id: 5, name: "Tire Alignment", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Balancing"
              isChecked={selectedServices.some(service => service.name === "Tire Balancing")}
              onPress={() => toggleService({ id: 5, name: "Tire Balancing", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const TireFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Tire Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Tire Inspection"
              isChecked={selectedServices.some(service => service.name === "Tire Inspection")}
              onPress={() => toggleService({ id: 1, name: "Tire Inspection", price: "₹500", image: require('./assets/wheel.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Tire Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Repair"
              isChecked={selectedServices.some(service => service.name === "Tire Repair")}
              onPress={() => toggleService({ id: 2, name: "Tire Repair", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Replacement"
              isChecked={selectedServices.some(service => service.name === "Tire Replacement")}
              onPress={() => toggleService({ id: 3, name: "Tire Replacement", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Rotation"
              isChecked={selectedServices.some(service => service.name === "Tire Rotation")}
              onPress={() => toggleService({ id: 4, name: "Tire Rotation", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Tire Mounting and Demounting"
              isChecked={selectedServices.some(service => service.name === "Tire Mounting and Demounting")}
              onPress={() => toggleService({ id: 5, name: "Tire Mounting and Demounting", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Wheel Alignment"
              isChecked={selectedServices.some(service => service.name === "Wheel Alignment")}
              onPress={() => toggleService({ id: 5, name: "Wheel Alignment", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Wheel Balancing"
              isChecked={selectedServices.some(service => service.name === "Wheel Balancing")}
              onPress={() => toggleService({ id: 5, name: "Wheel Balancing", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const TireScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="TireTwoWheelerScreen"
      component={TireTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="TireFourWheelerScreen"
      component={TireFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const EETwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const EEFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const EEScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="EETwoWheelerScreen"
      component={EETwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="EEFourWheelerScreen"
      component={EEFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const BrakeTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const BrakeFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const BrakeScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="BrakeTwoWheelerScreen"
      component={BrakeTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="BrakeFourWheelerScreen"
      component={BrakeFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const PowerTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const PowerFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const PowerScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="PowerTwoWheelerScreen"
      component={PowerTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="PowerFourWheelerScreen"
      component={PowerFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const VOthersTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const VOthersFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const VOthersScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="VOthersTwoWheelerScreen"
      component={VOthersTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="VOthersFourWheelerScreen"
      component={VOthersFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const FuelTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const FuelFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const FuelScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="FuelTwoWheelerScreen"
      component={FuelTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="FuelFourWheelerScreen"
      component={FuelFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const BatteryTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const BatteryFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const BatteryScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="BatteryTwoWheelerScreen"
      component={BatteryTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="BatteryFourWheelerScreen"
      component={BatteryFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const EngineTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const EngineFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const EngineScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="EngineTwoWheelerScreen"
      component={EngineTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="EngineFourWheelerScreen"
      component={EngineFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const TowTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const TowFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const TowScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="TowTwoWheelerScreen"
      component={TowTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="TowFourWheelerScreen"
      component={TowFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const EOthersTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const EOthersFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const EOthersScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="EOthersTwoWheelerScreen"
      component={EOthersTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="EOthersFourWheelerScreen"
      component={EOthersFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const FluidTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const FluidFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const FluidScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="FluidTwoWheelerScreen"
      component={FluidTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="FluidFourWheelerScreen"
      component={FluidFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const FilterTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const FilterFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const FilterScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="FilterTwoWheelerScreen"
      component={FilterTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="FilterFourWheelerScreen"
      component={FilterFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const SparkTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const SparkFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const SparkScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="SparkTwoWheelerScreen"
      component={SparkTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="SparkFourWheelerScreen"
      component={SparkFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const ExhaustTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const ExhaustFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const ExhaustScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="ExhaustTwoWheelerScreen"
      component={ExhaustTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="ExhaustFourWheelerScreen"
      component={ExhaustFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const RoutineTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const RoutineFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const RoutineScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="RoutineTwoWheelerScreen"
      component={RoutineTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="RoutineFourWheelerScreen"
      component={RoutineFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const GOthersTwoWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Compression Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Timing Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel System Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Electrical Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Battery Voltage Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wiring Harness Check</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Charging System Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Brake Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Brake Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Brake Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Pad Thickness Measurement</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Brake System Bleeding</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Fuel System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Fuel System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Fuel System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Fuel Pressure Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Injector Flow Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Ignition System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Ignition System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "Ignition System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Spark Plug Inspection</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Ignition Coil Testing</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const GOthersFourWheelerScreen = ({ navigation }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const addToCart = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service");
    } else {
      const itemsToAdd = selectedServices.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image
      }));
      navigation.navigate('Cart', { itemsToAdd });
    }
  };

  return (
    <ScrollView>
      <View style={styles.twoWheelerContainer}>
        <View style={styles.twoContainer}>
          <Text style={styles.heading}>Diagnostic Services</Text>
          <View style={styles.serviceContainer}>
            <ServiceCheckbox
              label="Engine Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Engine Diagnostics")}
              onPress={() => toggleService({ id: 1, name: "Engine Diagnostics", price: "₹500", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Cylinder Leakdown Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Exhaust Gas Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Timing Belt Inspection</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Transmission Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Transmission Diagnostics")}
              onPress={() => toggleService({ id: 2, name: "Transmission Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}>Transmission Fluid Analysis</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Shift Solenoid Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Torque Converter Lock-Up Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Electrical System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Electrical System Diagnostics")}
              onPress={() => toggleService({ id: 3, name: "Electrical System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Voltage Drop Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Component Resistance Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> CAN Bus Communication Check</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="Emission System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "Emission System Diagnostics")}
              onPress={() => toggleService({ id: 4, name: "Emission System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> EVAP System Leak Test</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Catalytic Converter Efficiency Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
            <ServiceCheckbox
              label="ABS System Diagnostics"
              isChecked={selectedServices.some(service => service.name === "ABS System Diagnostics")}
              onPress={() => toggleService({ id: 5, name: "ABS System Diagnostics", price: "₹2000", image: require('./assets/analytic.png') })}
            />
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Wheel Speed Sensor Testing</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={{ paddingLeft: 25, fontSize: 12, lineHeight: 25, }}>&#x25CF;</Text>
              <Text style={{ fontWeight: '300', }}> Hydraulic Pressure Test</Text>
            </View>
            <Text style={{ fontWeight: '500', color: 'purple' }}>Price: ₹500</Text>
          </View>
          <View stle={styles.cartButton}>
            <Button title="Add to Cart" onPress={addToCart} color="#c05000" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const GOthersScreen = () => (
  <TopTab.Navigator>
    <TopTab.Screen
      name="GOthersTwoWheelerScreen"
      component={GOthersTwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <TopTab.Screen
      name="GOthersFourWheelerScreen"
      component={GOthersFourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('./assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </TopTab.Navigator>
);

const ServiceScreen = () => {
  const navigation = useNavigation();
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }
  return (
    <ScrollView>
      <View style={styles.serviceContainer}>
        <View style={styles.serviceItem}>
          <Text style={{ marginTop: 10, color: '#888' }}>─────── Choose any of the service ───────</Text>
          <View style={styles.serviceRowContainer}>
            <Image source={require('./assets/car-service.gif')} style={styles.serviceLogo} />
            <Text style={styles.text}>Vehicle Services</Text>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View style={styles.subItem}>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Diagnostic Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/analytic.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={{fontSize: 13,
    marginTop: 5,
    color: '#000000',
    textAlign: 'center',
    fontWeight:'300',fontFamily: 'GillSansNova-Regular'}}>Diagnostic Services</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Tire Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/wheel.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Tire Services</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Electrical & Electronics Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/electrical-engineer.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Electrical and Electronics</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Brake Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/brakes.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Brake Services</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.subItem}>
            <View style={styles.serviceImageContainer}>
              <TouchableOpacity
                activeOpacity={0.5} onPress={() => navigation.navigate('Power System Services')} style={styles.touchableContainer}>
                <View style={styles.serviceLogoContainer}>
                  <Image source={require('./assets/fuel-exhaust.png')} style={styles.serviceLogo} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.subText}>Power System</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.serviceImageContainer}>
              <TouchableOpacity
                activeOpacity={0.5} onPress={() => navigation.navigate('Vehicle Other Services')} style={styles.touchableContainer}>
                <View style={styles.serviceLogoContainer}>
                  <Image source={require('./assets/more.png')} style={styles.serviceLogo} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.subText}>Others</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>


        <View style={styles.serviceItem}>
          <View style={styles.emergencyContainer}>
            <Image source={require('./assets/alert.gif')} style={styles.serviceLogo} />
            <Text style={styles.emergencyText}>Emergency services</Text>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View style={styles.subItem}>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Fuel Delivery Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/fuel.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Fuel Delivery</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Dead Battery Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/accumulator.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Dead Battery</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Engine Problem Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/piston.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Engine Problem</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Tow Truck Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/tow.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Tow Truck</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.subItem}>
            <View style={styles.serviceImageContainer}>
              <TouchableOpacity
                activeOpacity={0.5} onPress={() => navigation.navigate('Emergency Other Services')} style={styles.touchableContainer}>
                <View style={styles.serviceLogoContainer}>
                  <Image source={require('./assets/more.png')} style={styles.serviceLogo} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.subText}>Others</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>


        <View style={styles.serviceItem}>
          <View style={styles.serviceRowContainer}>
            <Text style={styles.text}>General repairs</Text>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View style={styles.subItem}>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Fluid Top-Ups Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/engine-oil.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Fluid Top-Ups</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Air Filter Replacement Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/air-filter.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Air Filter Replacement</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Spark Plug Replacement Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/spark-plug.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Spark Plug Replacement</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.imageWholeContainer}>
              <View style={styles.serviceImageContainer}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => navigation.navigate('Exhaust System Services')} style={styles.touchableContainer}>
                  <View style={styles.serviceLogoContainer}>
                    <Image source={require('./assets/exhaust-pipe.png')} style={styles.serviceLogo} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.subText}>Exhaust System</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.subItem}>
            <View style={styles.serviceImageContainer}>
              <TouchableOpacity
                activeOpacity={0.5} onPress={() => navigation.navigate('Routine Maintenance Services')} style={styles.touchableContainer}>
                <View style={styles.serviceLogoContainer}>
                  <Image source={require('./assets/schedule.png')} style={styles.serviceLogo} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.subText}>Routine Maintenance</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.serviceImageContainer}>
              <TouchableOpacity
                activeOpacity={0.5} onPress={() => navigation.navigate('General Other Services')} style={styles.touchableContainer}>
                <View style={styles.serviceLogoContainer}>
                  <Image source={require('./assets/more.png')} style={styles.serviceLogo} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.subText}>Others</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const CartScreen = ({ route, navigation, updateCartItemCount }) => {
  const { item } = route.params || {};
  const { itemsToAdd } = route.params || [];
  const { addToCart } = route.params || false;
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState(''); // New state for address
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [houseNumber, setHouseNumber] = useState('');

  useEffect(() => {
    if (itemsToAdd && itemsToAdd.length > 0) {
      updateCartItems(itemsToAdd);
    }
  }, [itemsToAdd]);

  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }

  const updateCartItems = (itemsToAdd) => {
    const updatedCartItems = [...cartItems];
    itemsToAdd.forEach(newItem => {
      const existingItemIndex = updatedCartItems.findIndex(cartItem => cartItem.id === newItem.id);
      if (existingItemIndex !== -1) {
        updatedCartItems[existingItemIndex].quantity += 1;
      } else {
        updatedCartItems.push({ ...newItem, quantity: 1 });
      }
    });
    setCartItems(updatedCartItems);
  };

  useEffect(() => {
    if (addToCart && item && !isItemInCart(item)) {
      // Add item to cart only if addToCart flag is present and the item is not already in the cart
      setCartItems(prevCartItems => [...prevCartItems, { ...item, quantity: 1 }]);
    }
  }, [addToCart, item]);

  useEffect(() => {
    updateCartItemCount(cartItems);
  }, [cartItems, updateCartItemCount]);

  const isItemInCart = (newItem) => {
    return cartItems.some(cartItem => cartItem.id === newItem.id);
  };

  useEffect(() => {
    // Check if address is passed from MapScreen
    if (route.params && route.params.address) {
      setAddress(route.params.address);
    }
  }, [route.params]);

  const handleAddAddress = () => {
    setShowAddressInput(true); // Show the address input field when "Add Address" button is pressed
    navigation.navigate('Map', { setAddress }); // Navigate to the MapScreen and pass setAddress function
  };

  const handleAddToCart = (newItem) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === newItem.id);
    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      setCartItems(prevCartItems => [...prevCartItems, { ...newItem, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== itemId);
    setCartItems(updatedCartItems);
  };

  const handleIncrementQuantity = (itemId) => {
    const updatedCartItems = cartItems.map(cartItem => {
      if (cartItem.id === itemId) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });
    setCartItems(updatedCartItems);
  };

  const handleDecrementQuantity = (itemId) => {
    const updatedCartItems = cartItems.map(cartItem => {
      if (cartItem.id === itemId && cartItem.quantity > 1) {
        return { ...cartItem, quantity: cartItem.quantity - 1 };
      }
      return cartItem;
    });
    setCartItems(updatedCartItems);
  };

  const handleProceedToCheckout = () => {
    navigation.navigate('Checkout', { cartItems, address }); // Passing address to Checkout screen
  };

  return (
    <ScrollView>
      <View style={styles.cartScreenContainer}>
        {cartItems.length === 0 && (
          <View style={styles.emptyCartContainer}>
            <Image source={require('./assets/empty-cart.png')} style={styles.emptyCart} />
            <Text style={{ fontWeight: '500', fontSize: 16 }}>Oops!</Text>
            <Text style={styles.emptyCartText}>Your cart is feeling lighter than a feather on a windy day.</Text>
          </View>
        )}
        {cartItems.map((cartItem, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image source={cartItem.image} style={styles.cartImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{cartItem.name}</Text>
              <Text style={styles.itemPrice}>{cartItem.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => handleDecrementQuantity(cartItem.id)}>
                  <Text style={styles.operationButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                <TouchableOpacity onPress={() => handleIncrementQuantity(cartItem.id)}>
                  <Text style={styles.operationPlusButton}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveItem(cartItem.id)}>
                  <Icon name="trash" size={20} color="#c05000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        {/* Render address input field only if "Add Address" button is pressed and there are items in the cart */}
        {showAddressInput && (
  <View style={styles.addressWholeContainer}>
    <View style={{ flexDirection:'row', width:'97%',}}>
      <View style={{flexDirection:'column', width:'97%'}}>
    <TextInput
      style={styles.addressTextContainer} // Apply styles similar to checkout button
      placeholder="Enter your address"
      value={address}
      onChangeText={setAddress}
    />
    <TextInput
      style={styles.addressTextContainer} // Apply styles similar to checkout button
      placeholder="House number*"
      value={houseNumber}
      onChangeText={setHouseNumber}
    />
    <TextInput
      style={styles.addressTextContainer} // Apply styles similar to checkout button
      placeholder="Floor"
    />
    <TextInput
      style={styles.addressTextContainer} // Apply styles similar to checkout button
      placeholder="Tower / Block (optional)"
    />
    <TextInput
      style={styles.addressTextContainer} // Apply styles similar to checkout button
      placeholder="Nearby landmark (optional)"
    />
    </View>
    <TouchableOpacity
      style={styles.cancelButton}
      onPress={() => setShowAddressInput(false)}
    >
      <View style={{paddingLeft:10}}>
      <Ionicons name="close-circle-outline" size={24} color="black" />
      </View>
    </TouchableOpacity>
    </View>
  </View>
)}
{/* Render "Add Address" button only if there are items in the cart */}
{cartItems.length > 0 && !showAddressInput && (
  <View style={styles.addressContainer}>
    <TouchableOpacity
      style={styles.addressButton}
      onPress={handleAddAddress}
    >
      <Text style={[styles.addressText]}>Add Address</Text>
    </TouchableOpacity>
  </View>
)}

        {/* Render checkout button only if there are items in the cart */}
        {cartItems.length > 0 && address && houseNumber && (
          <View style={styles.checkoutContainer}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleProceedToCheckout}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const CheckoutScreen = ({ route }) => {
  const { cartItems } = route.params;
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });
  const [orderID, setOrderID] = useState(null);

  useEffect(() => {
    // Create an order in Firestore under the current user's document
    const createOrder = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }
        const orderRef = await firebase.firestore().collection('users').doc(user.uid).collection('orders').add({
          amount: totalPrice,
          currency: 'INR',
          receipt: 'receipt#1',
          // Add any other necessary fields
        });
        setOrderID(orderRef.id);
      } catch (error) {
        console.error('Error creating order:', error);
        // Handle error
      }
    };

    createOrder();
  }, [totalPrice]);

  const handleRazorpayPayment = async () => {
    if (!orderID) {
      Alert.alert('Error', 'Order ID not available');
      return;
    }

    const options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: 'rzp_test_mVJtypiNfGQw9o',
      amount: totalPrice * 100, // Convert to paise
      name: 'Acme Corp',
      order_id: orderID, // Pass the order ID received from Fires
      prefill: {
        email: 'gaurav.kumar@example.com',
        contact: '9191919191',
        name: 'Gaurav Kumar',
      },
      theme: { color: '#53a20e' },
    };

    try {
      const data = await RazorpayCheckout.open(options);
      // Handle success
      Alert.alert(`Success: ${data.razorpay_payment_id}`);
    } catch (error) {
      // Handle failure
      console.error('Razorpay Payment Error:', error);
      Alert.alert(`Error: ${error.code} | ${error.description}`);
    }
  };

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }

  return (
    <View>
      <Text>Total Price: ₹{totalPrice.toFixed(2)}</Text>
      <Text>Payment Methods:</Text>
      {/* Add UI elements for payment methods */}
      <Button title="Pay with Razorpay" onPress={handleRazorpayPayment} />
      {/* Add any other checkout details */}
    </View>
  );
};


const ProfileScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(imagesDataURL[0]);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [country, setCountry] = useState(null);
  useEffect(() => {

    const retrieveProfilePicture = async () => {
      try {
        const profilePictureUrl = await AsyncStorage.getItem('profile_pictures');
        if (profilePictureUrl) {
          setSelectedImage(profilePictureUrl);
        }
      } catch (error) {
        console.error("Error retrieving profile picture URL from AsyncStorage:", error);
      }
    };
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

    const retrieveUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setName(userData.username);
          setEmail(userData.email);
          setPassword(userData.password);
          setCountry(userData.countryCode);
        }
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };

    retrieveProfilePicture();
    fetchUserDetails();
    retrieveUserData();
  }, []);
  const handleEditProfile = () => {
    navigation.navigate('EditProfile'); // Navigate to EditProfile screen
  };
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }
  const { t } = useTranslation();
  const navigateToEditProfile = async () => {
    navigation.navigate('EditProfile');
  };

  const navigateToSecurity = () => {
    navigation.navigate('SecurityScreen');
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
    navigation.navigate('Help and Support');
  };

  const navigateToTermsAndPolicies = async () => {
    navigation.navigate('Terms and Policies');
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
    console.log("Add account ");
  };

  const naviagtetovehicleDetails = () => {
    navigation.navigate('VehicleDetailsScreen')
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
    navigation.navigate('Language');
    // Implement your logic to navigate or perform actions related to Language Preferences
  };

  const navigatetochatbot = () => {
    navigation.navigate('Chatbot');
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
        routes: [{ name: 'Login' }]  // Define the route to navigate to
      });
      console.log("User signed out");
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle any errors that occur during logout
    }
  };

  const handleImageSelection = async () => {
    const currentUser = firebase.auth().currentUser; // Fetch the current user

    if (!currentUser) {
      console.error('No user is currently signed in');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      try {
        // 1. Create a reference to the Firebase storage location where you want to store the image
        const storageRef = firebase.storage().ref().child(`profile_pictures/${currentUser.uid}`);
        console.log('Storage reference:', storageRef);
        // 2. Upload the selected image to Firebase storage
        const response = await fetch(result.assets[0].uri);

        console.log('Fetch response:', response);
        const blob = await response.blob();
        console.log('Blob:', blob);
        await storageRef.put(blob, { contentType: 'image.jpg' });
        console.log('Image uploaded successfully!');

        // 3. Retrieve the download URL of the uploaded image
        const downloadURL = await storageRef.getDownloadURL();
        console.log('Download URL:', downloadURL);
        // 4. Update the user's profile with the new picture URL
        await firebase.auth().currentUser.updateProfile({
          photoURL: downloadURL,
        });

        // Optionally, you can update the UI to reflect the new profile picture
        setSelectedImage(downloadURL);
      } catch (error) {
        console.error('Error uploading image to Firebase:', error);
      }
    }
  };

  const accountItems = [
    { icon: "security", text: t("Security"), action: navigateToSecurity },
    { icon: "directions-car", text: t("Vehicle Details"), action: naviagtetovehicleDetails },
    { icon: "payment", text: t("Payment Information"), action: paymentInformation },
    { icon: "language", text: t("Language Preferences"), action: languagePreferences },
    { icon: "history", text: t("History"), action: history },
  ];

  const supportItems = [
    { icon: "help-outline", text: t("Help and Support"), action: navigateToSupport },
    {
      icon: "info-outline",
      text: t("Terms and Policies"),
      action: navigateToTermsAndPolicies,
    },
  ];

  const cacheAndCellularItems = [
    {
      icon: "delete-outline",
      text: t("Free up space"),
      action: navigateToFreeSpace,
    },
    { icon: "save-alt", text: t("Date Saver"), action: navigateToDateSaver },
  ];

  const actionsItems = [
    { icon: "logout", text: t("Log out"), action: logout },
    { icon: "logout", text: t("ChatBot"), action: navigatetochatbot }
  ];

  const renderSettingsItem = ({ icon, text, action }) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
      }}
    >
      <MaterialIcons name={icon} size={24} color="black" />
      <Text
        style={{
          marginLeft: 20,
          fontWeight: 400,
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
  <View style={styles.columnContainer}>
    <View
      style={{
        marginHorizontal: 12,
        flexDirection: "column", // Change to column layout
        alignItems: "center", // Align items to center
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
      <TouchableOpacity onPress={handleImageSelection}>
        <Image
          source={{ uri: selectedImage }}
          style={{
            height: 170,
            width: 170,
            borderRadius: 85,
            borderWidth: 2,
            borderColor: '#c05000',
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
            color='black'
          />
        </View>
      </TouchableOpacity>
        <TouchableOpacity onPress={handleEditProfile} style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
          <Text style={{ marginTop: 10, marginBottom:10, fontSize:18, fontWeight:'300', color:'black'}}>     {name}</Text>
          <MaterialIcons name="edit" size={24} color="black" style={{ marginLeft: 5 }} />
        </TouchableOpacity>
    </View>
  </View>

      <ScrollView style={{ marginHorizontal: 12 }}>
        {/* Account Settings */}
        <View style={{ marginBottom: 12, borderBottomWidth:0.5, borderBottomColor:'gray'}}>
          <Text style={{fontWeight:'600',fontSize:16, marginVertical: 10 }}>Account</Text>
          <View
            style={{
              borderRadius: 12,
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

        <View style={{ marginBottom: 12, borderBottomWidth:0.5, borderBottomColor:'gray' }}>
          <Text style={{fontWeight:'600',fontSize:16, marginVertical: 10 }}>
            Support & About{" "}
          </Text>
          <View
            style={{
              borderRadius: 12,
            }}
          >
            {supportItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 12, borderBottomWidth:0.5, borderBottomColor:'gray' }}>
          <Text style={{fontWeight:'600',fontSize:16, marginVertical: 10 }}>Actions</Text>
          <View
            style={{
              borderRadius: 12,
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
const Chatbot = () => {
  useEffect(() => {
    // Load the Botpress Web Chat script
    const script = `
      const script = document.createElement('script');
      script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.botpressWebChat.init({
          botId: '3c56a4e9-894c-4acb-a552-ddcd17ec9358',
          hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
          messagingUrl: 'https://messaging.botpress.cloud',
          clientId: '3c56a4e9-894c-4acb-a552-ddcd17ec9358',
        });
      };
    `;

    // Inject the script into the WebView
    webViewRef.injectJavaScript(script);
  }, []);

  return (
    <WebView
      ref={ref => (webViewRef = ref)}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      source={{ html: '<div id="webchat"></div>' }}
    />
  );
};

const SecurityScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  const setUpRecaptcha = () => {
    setRecaptchaVerifier(new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
    }));
  };

  const sendOTP = async () => {
    try {
      setUpRecaptcha();
      const confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
      setVerificationId(confirmation.verificationId);
      Alert.alert('OTP Sent Successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP');
    }
  };

  const verifyOTP = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
      await firebase.auth().signInWithCredential(credential);
      Alert.alert('OTP Verified Successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Failed to verify OTP');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <View id="recaptcha-container"></View>
      <Button title="Send OTP" onPress={sendOTP} />

      <TextInput
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />
      <Button title="Verify OTP" onPress={verifyOTP} />
    </View>
  );
};

const HelpScreen = () => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = (questionId) => {
    setExpanded(prevState => ({
      ...prevState,
      [questionId]: !prevState[questionId] // Toggle the expanded state for the ques
    }));
  };
  
  return (
    <View style={{flex: 1, justifyContent: 'flex-start', paddingTop: 15, marginLeft: 5, marginRight: 5, marginBottom: 15}}>
      <ScrollView>
        <Text style={{fontSize: 18, fontWeight: '600'}}>Welcome to MechBud Help and Support Center</Text>
        <Text style={{fontWeight: '300', paddingTop: 10, lineHeight: 25}}>At MechBud, we are dedicated to providing you with exceptional support to ensure your experience with our platform is smooth and hassle-free. Whether you have questions about using the app, need assistance with a service request, or want to provide feedback, our Help and Support Center is here to assist you every step of the way.</Text>
        <Text style={{fontWeight: '500', paddingTop: 10, lineHeight: 25, fontSize: 14, paddingTop: 10}}>How Can We Help You?</Text>
        <Text style={{fontWeight: '500', paddingTop: 10, lineHeight: 25, fontSize: 14, paddingTop: 10}}>1. Frequently Asked Questions (FAQs):</Text>
        <Text style={{fontWeight: '300', paddingTop: 10, lineHeight: 25}}>Browse through our comprehensive list of FAQs to find answers to common queries about our app, services, and policies.</Text>
        <TouchableOpacity onPress={() => toggleExpanded(1)} activeOpacity={1}>
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', marginTop: 10, borderRadius: 5, borderWidth: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
            <Text style={{ flex: 1, marginTop:15, marginBottom:15 }}>1. How does MechBud work?</Text>
            <Ionicons name={expanded[1] ? 'arrow-up-outline' : 'arrow-down-outline'} size={24} color="black" />
          </View>
          {expanded[1] && (
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: '300', paddingTop: 5, lineHeight:20 }}>MechBud connects users with nearby mechanic shops to provide mechanical services for their vehicles. Simply download the app, enter your location, and request assistance whenever you encounter vehicle troubles.</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => toggleExpanded(2)} activeOpacity={1}>
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', marginTop: 10, borderRadius: 5, borderWidth: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
            <Text style={{ flex: 1, marginTop:15, marginBottom:15 }}>2. What types of services does MechBud offer?</Text>
            <Ionicons name={expanded[2] ? 'arrow-up-outline' : 'arrow-down-outline'} size={24} color="black" />
          </View>
          {expanded[2] && (
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: '300', paddingTop: 5, lineHeight:20 }}>MechBud offers a wide range of mechanical services, including maintenance, repair, and functioning of vehicles such as cars, motorcycles, and more.</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => toggleExpanded(3)} activeOpacity={1}>
  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', marginTop: 10, borderRadius: 5, borderWidth: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
      <Text style={{ flex: 1, marginTop:15, marginBottom:15 }}>3. How long does it take for a mechanic to arrive after I request assistance?</Text>
      <Ionicons name={expanded[3] ? 'arrow-up-outline' : 'arrow-down-outline'} size={24} color="black" />
    </View>
    {expanded[3] && (
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '300', paddingTop: 5, lineHeight:20 }}>The arrival time of a mechanic may vary depending on factors such as your location and the availability of nearby mechanics. Rest assured, we strive to connect you with assistance as quickly as possible.</Text>
      </View>
    )}
  </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => toggleExpanded(4)} activeOpacity={1}>
  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', marginTop: 10, borderRadius: 5, borderWidth: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
      <Text style={{ flex: 1, marginTop:15, marginBottom:15 }}>4. Are the mechanics on MechBud trustworthy?</Text>
      <Ionicons name={expanded[4] ? 'arrow-up-outline' : 'arrow-down-outline'} size={24} color="black" />
    </View>
    {expanded[4] && (
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '300', paddingTop: 5, lineHeight:20 }}>Yes, we partner with reputable mechanic shops in your area to ensure that you receive reliable and high-quality services. Additionally, our platform includes user ratings and reviews to help you make informed decisions.</Text>
      </View>
    )}
  </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => toggleExpanded(5)} activeOpacity={1}>
  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', marginTop: 10, borderRadius: 5, borderWidth: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
      <Text style={{ flex: 1, marginTop:15, marginBottom:15 }}>5. What if I'm not satisfied with the service provided?</Text>
      <Ionicons name={expanded[5] ? 'arrow-up-outline' : 'arrow-down-outline'} size={24} color="black" />
    </View>
    {expanded[5] && (
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '300', paddingTop: 5, lineHeight:20 }}>If you're not satisfied with the service provided, please contact our support team through the app. We will work with you to address any concerns and ensure that you receive the assistance you need.</Text>
      </View>
    )}
  </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => toggleExpanded(6)} activeOpacity={1}>
  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', marginTop: 10, borderRadius: 5, borderWidth: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
      <Text style={{ flex: 1, marginTop:15, marginBottom:15 }}>6. How can I provide feedback or suggestions for improvement?</Text>
      <Ionicons name={expanded[6] ? 'arrow-up-outline' : 'arrow-down-outline'} size={24} color="black" />
    </View>
    {expanded[6] && (
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '300', paddingTop: 5, lineHeight:20 }}>We welcome your feedback and suggestions! You can provide feedback directly through the app or contact our support team. Your input helps us improve our services and enhance your experience.</Text>
      </View>
    )}
  </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => toggleExpanded(7)} activeOpacity={1}>
  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', marginTop: 10, borderRadius: 5, borderWidth: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
      <Text style={{ flex: 1, marginTop:15, marginBottom:15 }}>7. Is my personal information secure with MechBud?</Text>
      <Ionicons name={expanded[7] ? 'arrow-up-outline' : 'arrow-down-outline'} size={24} color="black" />
    </View>
    {expanded[7] && (
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '300', paddingTop: 5, lineHeight:20 }}>Yes, we take the privacy and security of your personal information seriously. We adhere to strict data protection protocols to ensure that your information is safe and secure.</Text>
      </View>
    )}
  </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => toggleExpanded(8)} activeOpacity={1}>
  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', marginTop: 10, borderRadius: 5, borderWidth: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
      <Text style={{ flex: 1, marginTop:15, marginBottom:15 }}>8. What payment methods are accepted on MechBud?</Text>
      <Ionicons name={expanded[8] ? 'arrow-up-outline' : 'arrow-down-outline'} size={24} color="black" />
    </View>
    {expanded[8] && (
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '300', paddingTop: 5, lineHeight:20 }}>MechBud accepts various payment methods, including credit/debit cards, digital wallets, and other convenient options. Payment details will be provided at the time of service request.</Text>
      </View>
    )}
  </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => toggleExpanded(9)} activeOpacity={1}>
  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%', marginTop: 10, borderRadius: 5, borderWidth: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
      <Text style={{ flex: 1, marginTop:15, marginBottom:15 }}>9. Is there a cancellation policy for service requests?</Text>
      <Ionicons name={expanded[9] ? 'arrow-up-outline' : 'arrow-down-outline'} size={24} color="black" />
    </View>
    {expanded[9] && (
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '300', paddingTop: 5, lineHeight:20 }}>Yes, we have a cancellation policy in place. You can cancel your service request within a certain timeframe without incurring any charges. Please refer to our Terms of Service for more information.</Text>
      </View>
    )}
  </View>
</TouchableOpacity>

        <Text style={{fontWeight: '500', paddingTop: 10, lineHeight: 25, fontSize: 14, paddingTop: 10}}>2. Service Requests:</Text>
        <Text style={{fontWeight: '300', paddingTop: 10, lineHeight: 25}}>If you encounter any issues with our services or need assistance with a specific request, please don't hesitate to reach out to us directly through the app. Our dedicated support team will promptly address your concerns and provide assistance tailored to your needs.</Text>
        <Text style={{fontWeight: '500', paddingTop: 10, lineHeight: 25, fontSize: 14, paddingTop: 10}}>3. Feedback and Suggestions:</Text>
        <Text style={{fontWeight: '300', paddingTop: 10, lineHeight: 25}}>We value your feedback and strive to continuously improve our app and services. If you have any suggestions for enhancements or feedback on your experience, please share it with us. Your input helps us enhance our platform and better serve our users.</Text>
        <Text style={{fontWeight: '500', paddingTop: 10, lineHeight: 25, fontSize: 14, paddingTop: 10}}>4. Contact Us:</Text>
        <Text style={{fontWeight: '300', paddingTop: 10, lineHeight: 25}}>For any other inquiries or assistance, you can contact our support team directly through the app. We're here to help you seven days a week, and we aim to respond to all inquiries promptly.</Text>
        <Text style={{fontWeight: '500', paddingTop: 10, lineHeight: 25, fontSize: 14, paddingTop: 10}}>Need Assistance?</Text>
        <Text style={{fontWeight: '300', paddingTop: 10, lineHeight: 25}}>If you require immediate assistance or encounter an emergency situation, please don't hesitate to contact our support team directly through the app or call our emergency hotline at +18083808380.</Text>
        <Text style={{fontWeight: '300', paddingTop: 10, lineHeight: 25}}>Thank you for choosing MechBud for your vehicle maintenance and repair needs. We appreciate your trust in us and are committed to delivering the highest level of service and support to ensure your satisfaction.</Text>
        <Text style={{fontWeight: '300', paddingTop: 10, lineHeight: 25}}>Sincerely,</Text>
        <Text style={{fontWeight: '300', paddingTop: 5, lineHeight: 25}}>MechBud Team</Text>
      </ScrollView>
    </View>
  );
};

const VehicleDetails = () => {
  const [vehicleDetails, setVehicleDetails] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const userVehicleRef = await firebase.firestore().collection('users').doc(currentUser.uid).collection('vehicles').get();
          if (!userVehicleRef.empty) {
            const vehicleDoc = userVehicleRef.docs[0];
            const vehicleData = vehicleDoc.data();
            console.log('Vehicle Data:', vehicleData);
            setVehicleDetails(vehicleData); // Set vehicle data

            // Store vehicle details in AsyncStorage
            await AsyncStorage.setItem('vehicleData', JSON.stringify(vehicleData));
          } else {
            // Clear vehicle details state if user has no vehicles
            setVehicleDetails(null);
          }
        } else {
          console.log('No user logged in.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchVehicleDetails();
  }, []);
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }

  return (
    <View>
      <Text>Vehicle Details Screen</Text>
      {vehicleDetails ? (
        <View>
          <Text>Vehicle: {vehicleDetails.vehicle}</Text>
          <Text>Brand: {vehicleDetails.brand}</Text>
          <Text>Model: {vehicleDetails.model}</Text>
          <Text>Plate Number: {vehicleDetails.plateNumber}</Text>
          {/* Render other vehicle details here */}
        </View>
      ) : (
        <Text>No vehicle details found.</Text>
      )}
    </View>
  );
};

const TermsScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    'GillSansNova-Regular': require('./assets/fonts/GillSansNova-Book.ttf'),
    'GillSansNova-Bold': require('./assets/fonts/GillSansNova-Bold.ttf'),
    // Load other weights or styles if needed
  });

  if (!loaded) {
    return null; // Render a loading indicator while the font is loading
  }
  return (
    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
      <ScrollView contentContainerStyle={styles.termspoliciesContainer}>
        <Text style={{ paddingBottom: 15 }}>Last Updated: [30 Mar-2024]</Text>

        <Text style={styles.termspoliciesText}>Welcome to MechBud! These Terms and Policies govern your use of our mobile application and related services. By accessing or using our app, you agree to be bound by these Terms and Policies. Please read them carefully.
        </Text>
        <Text style={styles.termsTitle}>1. Introduction</Text>
        <Text style={styles.termspoliciesText}>
          MechBud ("App," "we," "us," or "our") provides a platform connecting users ("Users") with local mechanic shops and related services. Our goal is to offer a convenient and reliable solution for individuals in need of vehicle maintenance, repair, and functioning assistance.

          These Terms and Policies constitute a legally binding agreement between you and MechBud. By accessing or using our App, you agree to be bound by these Terms and Policies, which govern your use of our services and interactions with mechanic shops within our network.

          If you do not agree to these Terms and Policies, you may not access or use our App.
        </Text>
        <Text style={styles.termsTitle}>2. User Registration</Text>
        <Text style={styles.termspoliciesText}>
          In order to use our App, you may be required to register for an account. During the registration process, you agree to provide accurate, current, and complete information. It's essential to maintain the confidentiality of your account credentials and notify us immediately of any unauthorized use or security breaches.

          By registering for an account, you agree to receive communications from us, including but not limited to emails, push notifications, and in-app messages. These communications may include service updates, promotional offers, and important account-related information.
        </Text>
        <Text style={styles.termsTitle}>3. Use of Services</Text>
        <Text style={styles.termspoliciesText}>
          Our App serves as a platform for Users to connect with local mechanic shops and request vehicle services, including maintenance, repair, and functioning assistance. Upon receiving a service request, we endeavor to connect Users with suitable mechanic shops based on availability and proximity.

          Users are solely responsible for their interactions with mechanic shops, including scheduling appointments, discussing service requirements, and making payments. While we strive to facilitate a seamless experience, Users acknowledge that we are not responsible for the quality of services provided by mechanic shops.

          By using our App, Users agree to comply with all applicable laws, regulations, and third-party agreements. Any misuse of our services or violation of these Terms and Policies may result in the suspension or termination of your account.
        </Text>
        <Text style={styles.termsTitle}>4. Payment Terms</Text>
        <Text style={styles.termspoliciesText}>
          Some services provided through our App may require payment. Payment terms, including fees and accepted payment methods, will be provided to Users prior to confirming a service request. Users are responsible for paying all fees associated with requested services.

          To facilitate payments, we may use third-party payment processors. By using our App, you agree to abide by the terms and conditions of these payment processors. We do not store or have access to your payment information, as it is securely handled by the payment processor.
        </Text>
        <Text style={styles.termsTitle}>5. User Content</Text>
        <Text style={styles.termspoliciesText}>
          Users may have the opportunity to submit content, such as reviews, ratings, and feedback, through the App. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content.

          You represent and warrant that any content you submit does not infringe upon the rights of third parties, including intellectual property rights. We reserve the right to remove any user-generated content that violates these Terms and Policies or is otherwise objectionable.
        </Text>
        <Text style={styles.termsTitle}>6. Privacy Policy</Text>
        <Text style={styles.termspoliciesText}>
          Our Privacy Policy governs the collection, use, and disclosure of personal information collected from Users. By using our App, you consent to the collection, use, and disclosure of your personal information as described in our Privacy Policy.

          We may collect certain information about Users, including but not limited to: name, contact information, vehicle details, and usage data. This information is used to provide and improve our services, personalize the user experience, and communicate with Users.

          We take the privacy and security of User information seriously and implement appropriate measures to safeguard it. We do not sell or share User information with third parties for marketing purposes without your explicit consent.

          Users have the right to access, update, or delete their personal information as described in our Privacy Policy. If you have any questions or concerns about our data practices, please contact us using the information provided in Section 12.
        </Text>
        <Text style={styles.termsTitle}>7. Intellectual Property</Text>
        <Text style={styles.termspoliciesText}>
          All content, trademarks, logos, and other intellectual property displayed on or made available through the App are the property of MechBud or its licensors. Users may not use, reproduce, modify, or distribute any such content without our prior written consent.

          Users retain ownership of any content they submit through the App. By submitting content, Users grant us a license to use such content as described in Section 5. We respect the intellectual property rights of others and expect Users to do the same.

          If you believe that any content on our App infringes your intellectual property rights, please contact us using the information provided in Section 12.
        </Text>
        <Text style={styles.termsTitle}>8. Disclaimers</Text>
        <Text style={styles.termspoliciesText}>
          Our App is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. We do not warrant that our App will be uninterrupted or error-free, or that defects will be corrected.

          While we strive to connect Users with reliable and qualified mechanic shops, we do not endorse, guarantee, or assume responsibility for any services provided by mechanic shops or third parties accessed through the App. Users assume all risks associated with using such services.

          We do not warrant the accuracy, reliability, or completeness of any content provided through the App. Users are solely responsible for verifying the accuracy and reliability of any information obtained through the App.
        </Text>
        <Text style={styles.termsTitle}>9. Limitation of Liability</Text>
        <Text style={styles.termspoliciesText}>
          In no event shall MechBud, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to lost profits, lost revenue, or loss of data, arising out of or in connection with your use of our App.

          Our total liability to you for any claim arising out of or relating to these Terms and Policies or your use of our App shall not exceed the amount paid by you to us, if any, during the twelve (12) month period immediately preceding the event giving rise to such claim.

          The limitations and exclusions of liability set forth in these Terms and Policies apply to the fullest extent permitted by applicable law.
        </Text>
        <Text style={styles.termsTitle}>10. Governing Law and Dispute Resolution</Text>
        <Text style={styles.termspoliciesText}>
          These Terms and Policies shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising out of or relating to these Terms and Policies or your use of our App shall be resolved exclusively by binding arbitration in accordance with the rules of the Indian Council of Arbitration (ICA), except that either party may seek injunctive or other equitable relief in any court of competent jurisdiction. The arbitration shall be conducted in Bangalore, Karnataka, unless otherwise agreed by the parties. The language of the arbitration shall be English.</Text>
        <Text style={styles.termsTitle}>11. Changes to Terms and Policies</Text>
        <Text style={styles.termspoliciesText}>
          We reserve the right to modify or update these Terms and Policies at any time without prior notice. By continuing to use our App after any changes, you agree to be bound by the revised Terms and Policies.

          We will notify Users of any material changes to these Terms and Policies by posting a notice on our App or by sending an email to the email address associated with their account.
        </Text>
        <Text style={styles.termsTitle}>12. Contact Us</Text>
        <Text style={styles.termspoliciesText}>
          If you have any questions or concerns about these Terms and Policies, please contact us at <Text style={{ color: 'blue', fontWeight: '400' }}>mechbudofficial@gmail.com.</Text> We are committed to addressing User inquiries promptly and ensuring a positive experience for all Users.
        </Text>
      </ScrollView>
    </View>
  );
};

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [country, setCountry] = useState(null);

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

    const retrieveUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setName(userData.username);
          setEmail(userData.email);
          setPassword(userData.password);
          setCountry(userData.countryCode);
        }
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };
    fetchUserDetails();
    retrieveUserData();
  }, []);

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
                errorStyle={{ color: 'red' }}
                errorMessage='ENTER A VALID ERROR HERE'
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
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


// Initialize i18next
i18next
  .use(initReactI18next)
  .init({
    lng: 'en', // Set default language to English
    fallbackLng: 'en', // Fallback language
    resources: {
      en: { translation: {} }, // English translations (empty for now)
      hi: { translation: hi }, // Hindi translations
      kn: { translation: kn }, // Kannada translations
      te: { translation: te }, // Telugu translations
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

const LanguageScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    navigation.goBack(); // Go back to the previous screen after changing language
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t('select_language')}</Text>
      <Button title="English" onPress={() => changeLanguage('en')} />
      <Button title="हिन्दी" onPress={() => changeLanguage('hi')} />
      <Button title="ಕನ್ನಡ" onPress={() => changeLanguage('kn')} />
      <Button title="తెలుగు" onPress={() => changeLanguage('te')} />
      {/* Add more buttons for other languages */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  greyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cartScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  serviceContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  circularBackground: {
    height: 75,
    width: 75,
    borderRadius: 50, // Make it half of the width/height to create a circle
    backgroundColor: '#ffffff', // Light grey background color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    marginTop: 10,
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
  phoneView: {
    marginBottom: 20,
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
    color: '#c05000',
  },
  checkboxLabel: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
  },
  LogoContainer: {
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
  rowContainer: {
    flexDirection: 'row',
  },
  searchContainer: {
    marginTop: 5,
    width: '100%',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  searchInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 40,
    elevation: 10,
  },
  reviewContainer: {
    paddingHorizontal: 5,
    marginTop: 50,
    marginBottom: 50,
    height: 170,
    borderRadius: 8,
    width: '97%',
  },
  review: {
    flexDirection: 'column', // Change to row to align image at the top
    justifyContent: 'flex-start', // Adjusted to start
    alignItems: 'center', // Adjusted to start
    paddingHorizontal: 5,
    paddingTop: 7,
    width: screenWidth * 0.7,
    marginHorizontal: 8,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#727272',
    alignItems: 'center',
    elevation: 10,
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute', // Added to position the image
    top: 0, // Positioned at the top
    left: 0, // Positioned at the left
    marginLeft: 5,
    marginTop: 5,
  },
  reviewName: {
    marginLeft: 10, // Adjust as needed
    fontSize: 16, // Adjust as needed
    fontWeight: 'bold',
  },
  reviewWords: {
    backgroundColor: '#CCCCCC',
    padding: 5,
    borderRadius: 5,
    margin: 5,
    fontSize: 10,
    alignSelf: 'flex-start', // Allow container to adjust its width based on the size of the text
  },
  reviewStyle: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    lineHeight: 20,
    alignItems: 'center',
  },
  reviewImp: {
    marginLeft: 40,
    flexDirection: 'row',
  },
  input: {
    fontSize: 16,
  },
  topServicesText: {
    fontSize: 14,
    fontWeight: '300',
    marginTop: 10,
    marginBottom: 10,
    color: 'gray',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 15,
  },
  normalText: {
    fontSize: 12,
    fontWeight: 'normal',
    paddingLeft: 20,
    paddingTop: 2,
    paddingBottom: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '400',
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
  },
  rating: {
    fontWeight: '400',
    backgroundColor: 'transparent',
    paddingTop: 5,
    paddingBottom: 5,
  },
  contText: {
    fontSize: 12,
    fontWeight: 'normal',
    paddingLeft: 20,
  },
  imageContainer: {
    paddingHorizontal: 5,
    paddingTop: 7,
    height: 160,
    borderRadius: 8,
    width: '97%',
    marginBottom: 20
  },
  imageSlider: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: '95%',
    borderRadius: 800,
  },
  wrapper: {
    height: 250,
    flexDirection: "row",
    backgroundColor: "#fff",
    width: '97%',
    borderRadius: 10,
    borderColor: '#727272',
    borderWidth: 0,
    elevation: 10,
    marginTop: 10
  },
  wrapperContainer: {
    justifyContent: 'center',
  },
  slide1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  slide2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  slide3: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  slide4: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  slide5: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,

  },
  imageWrapper: {
    paddingHorizontal: 5,
    paddingTop: 7,
    width: screenWidth * 0.3,
    marginHorizontal: 5,
    height: 140,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#727272',
    alignItems: 'center',
    elevation: 10,
  },
  image: {
    width: screenWidth * 0.25, // Adjust the width of the image
    height: screenWidth * 0.13, // Adjust the height of the image
    resizeMode: 'cover',
  },
  imageTitle: {
    marginTop: 5,
    fontSize: 11,
    fontStyle: 'normal',
  },
  gradient: {
    borderRadius: 3,
    height: 200,
  },
  priceText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 13,
    fontStyle: 'normal',
    color: 'purple',
    fontWeight: '500',
  },
  cartText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    fontStyle: 'normal',
    color: 'white',
    fontWeight: '500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartContainer: {
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
    width: screenWidth * 0.3,
    height: 35,
    backgroundColor: '#c05000',
    borderRadius: 3,
    justifyContent: 'center',
  },
  descContainer: {
    flexDirection: 'column',
  },
  ratingContainer: {
    backgroundColor: 'transparent', // Customize the background color here
  },
  button: {
    width: 50,
    height: 50,
    position: "absolute",
  },
  cartButton: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  emergencyServiceItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    alignItems: 'flex-start',
    padding: 5,
    borderRadius: 8,
    backgroundColor:'white',
    height:200,
    justifyContent:'center'
  },
  serviceLogoContainer: {
    alignItems: 'column',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'column',
    alignItems: 'center',
    width: 75,
  },
  subText: {
    fontSize: 13,
    marginTop: 5,
    color: '#000000',
    textAlign: 'center',
    fontWeight:'300'
  },
  serviceLogo: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  touchableContainer: {
  },
  serviceImageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: '#888',
    borderRadius: 8,
    marginLeft: 5,
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    elevation:10,
  },
  imageWholeContainer: {
    paddingBottom: 5,
  },
  imageTopContainer: {
    paddingTop: 5,
  },
  containerWithHorizontalLine: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    width: '70%',
    backgroundColor: '#87ceeb',
    borderRadius: 100,
  },
  emergencyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    width: '70%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 1000,
    borderColor: '#ff6347',
    borderWidth: 2,
  },
  serviceRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    width: '70%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 1000,
    borderColor: '#0070C0',
    borderWidth: 2,
  },
  generalRepairsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    width: '70%',
    height: 50,
    backgroundColor: '#87ceeb',
    borderRadius: 100,
  },
  emergencyText: {
    fontSize: 15,
    color: '#000000', // Adjust the color as needed
    textAlign: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  option: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  optionText: {
    fontSize: 18,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeTab: {
    borderBottomColor: 'blue', // Change the color to indicate active tab
  },
  cartScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 643,
    width: '100%',
  },
  emptyCartText: {
    fontSize: 12,
    fontWeight: '300',
    color: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: 200,
    lineHeight: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  cartImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
  },
  checkoutContainer: {
    flexGrow: 1,
    marginBottom: 30, // Adjust this value as needed
    paddingTop: 60,
    position: 'relative',
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#c05000',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius:10
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressTextContainer: {
    flexGrow: 1,
    marginBottom: 20,
    position: 'relative',
    paddingLeft:5,borderColor:'#c05000', borderWidth:1, borderRadius:10,
    height:50
  },
  addressWholeContainer: {
    flexGrow: 1,
    flexDirection:'row',
    position: 'relative',
  },
  addressContainer: {
    flexGrow: 1,
    marginBottom: 20,
    paddingTop: 50,
    position: 'relative',
    alignItems: 'center',
    justifyContent:'center'
  },
  addressButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 15,
    alignItems: 'center',
    borderColor:'#c05000',
    borderWidth:1.5,
    borderRadius:10,
    alignItems: 'center',
    justifyContent:'center'
  },
  addressText: {
    color: '#c05000',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent:'center'
  },
  addedContainer: {
    width: screenWidth * 0.528, // Adjusted width for added state
  },
  operationButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c05000',
  },
  operationPlusButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c05000',
    paddingRight: 20,
  },
  quantityContainer: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#c05000',
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    width: screenWidth * 0.265,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: screenWidth * 0.077,
    borderRadius: 3,
    color: '#c05000',
  },
  cartText: {
    fontSize: 16,
    fontStyle: 'normal',
    color: 'white',
    fontWeight: '500',
  },
  twoWheelerContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  columnContainer: {
    flexDirection: 'column',
  },
  twoContainer: {
    flex: 1,
    borderColor: '#888',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  termspoliciesContainer: {
    padding: 20,
    justifyContent: 'space-around',
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  termspoliciesText: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '300',
    lineHeight: 25,
  },
  plateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'flex-start'
  },
  plateHeading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  plateInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    borderColor:'black',
    borderWidth:1,
  },
  plateSectionContainer: {
    marginHorizontal: 5,
    paddingTop:15
  },
  plateInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: 40,
    textAlign: 'center',
  },
  plateUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: 40,
    marginTop: 5,
  },
  botWidgetContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
    // Other styles...
  },
});