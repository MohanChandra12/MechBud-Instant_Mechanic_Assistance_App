import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated} from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import { ScrollView} from 'react-native';
import DiagnosticsScreen from '../services/DiagnosticsScreen';
import BatteryScreen from '../services/BatteryScreen';
import BrakeScreen from '../services/BrakeScreen';
import EEScreen from '../services/EEScreen';
import EngineScreen from '../services/EngineScreen';
import EOthersScreen from '../services/EOthersScreen';
import ExhaustScreen from '../services/ExhaustScreen';
import FilterScreen from '../services/FilterScreen';
import FluidScreen from '../services/FluidScreen';
import FuelScreen from '../services/FuelScreen';
import GOthersScreen from '../services/GOthersScreen';
import PowerScreen from '../services/PowerScreen';
import RoutineScreen from '../services/RoutineScreen';
import SparkScreen from '../services/SparkScreen';
import TireScreen from '../services/TireScreen';
import TowScreen from '../services/TowScreen';
import VOthersScreen from '../services/VOthersScreen';
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const ServiceScreen = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Service">
        <Stack.Screen
          name="Service"
          component={ServiceContent}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Diagnostic Services"
          component={DiagnosticsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Battery Services"
          component={BatteryScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Brake Services"
          component={BrakeScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Electrical & Electronics Services"
          component={EEScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Engine Services"
          component={EngineScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Emergency Other Services"
          component={EOthersScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Exhaust System Services"
          component={ExhaustScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Air Filter Services"
          component={FilterScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Fluid Top-Up Services"
          component={FluidScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Fuel Services"
          component={FuelScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="General Other Services"
          component={GOthersScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Power  System Services"
          component={PowerScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Rountine Maintenance"
          component={RoutineScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Spark Plug Services"
          component={SparkScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Tire Services"
          component={TireScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Towing Services"
          component={TowScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Vehicle Other Services"
          component={VOthersScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ServiceContent = () => {
  const navigation = useNavigation();
  return (
    <ScrollView>
    <View style={styles.container}>
       <View style={styles.serviceItem}>
       <Text style={{marginTop:10, color:'#888'}}>─────── Choose any of the service ───────</Text>
        <View style={styles.rowContainer}>
          <Image source={require('../assets/car-service.gif')} style={styles.logo} />
          <Text style={styles.text}>Vehicle Services</Text>
        </View>
      </View>
      <View style={styles.subContainer}>
      <View style={styles.subItem}>
      <View style={styles.imageWholeContainer}>
          <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Diagnostic Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/analytic.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Diagnostic Services</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Tire Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/wheel.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Tire Services</Text>
          </View>
        </TouchableOpacity>
          </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Electrical & Electronics Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/electrical-engineer.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Electrical and Electronics</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Brake Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/brakes.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Brake Services</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        </View>
      <View style={styles.subItem}>
          <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Power  System Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/fuel-exhaust.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Power System</Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Vehicle Other Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/more.png')} style={styles.logo} />
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
        <Image source={require('../assets/alert.gif')} style={styles.logo} />
          <Text style={styles.emergencyText}>Emergency services</Text>
        </View>
      </View>
      <View style={styles.subContainer}>
      <View style={styles.subItem}>
      <View style={styles.imageWholeContainer}>
          <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Fuel Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/fuel.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Fuel Delivery</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Battery Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/accumulator.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Dead Battery</Text>
          </View>
        </TouchableOpacity>
          </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Engine Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/piston.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Engine Problem</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
          <View style={styles.imageWholeContainer}>
          <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Towing Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/tow.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Tow Truck</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        </View>
      <View style={styles.subItem}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Emergency Other Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/more.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Others</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        </View>


      <View style={styles.serviceItem}>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>General repairs</Text>
        </View>
      </View>
      <View style={styles.subContainer}>
      <View style={styles.subItem}>
      <View style={styles.imageWholeContainer}>
          <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Fluid Top-Up Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/engine-oil.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Fluid Top-Ups</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Air Filter Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/air-filter.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Air Filter Replacement</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Spark Plug Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/spark-plug.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Spark Plug Replacement</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Exhaust System Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/exhaust-pipe.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Exhaust System</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>
        </View>
        <View style={styles.subItem}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('Rountine Maintenance')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/schedule.png')} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Routine Maintenance</Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => navigation.navigate('General Other Services')} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/more.png')} style={styles.logo} />
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
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
    borderWidth: 1,
    borderColor: '#888',
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#e7f5ff',
  },
  logoContainer: {
    alignItems: 'column',
    alignItems:'center',
  },
  textContainer: {
    alignItems: 'column',
    alignItems:'center',
    width:75,
  },
  subText: {
    fontSize: 13,
    marginTop: 5,
    color: '#000000',
    textAlign: 'center',
    
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    alignSelf:'center',
  },
  touchableContainer: {
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8, 
    marginLeft:5,
    width: 80,
    height: 80,
    backgroundColor: '#fff',
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
    width:'70%',
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
    width:'70%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 1000,
    borderColor:'#ff6347',
    borderWidth:2,
  },
  rowContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    width:'70%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 1000,
    borderColor:'#0070C0',
    borderWidth:2,
  },
  generalRepairsContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    width:'70%',
    height: 50,
    backgroundColor: '#87ceeb',
    borderRadius: 100,
  },
  emergencyText:{
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
});

export default ServiceScreen;
