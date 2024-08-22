import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScrollView } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth } = Dimensions.get('window');
// Define components for 2 wheelers and 4 wheelers screens
const TwoWheelerScreen = () => {
  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.twoContainer}>
        <Text style={styles.heading}>Diagnostic Services</Text>
        <View style={styles.rowContainer}>
        <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
        <Text style={{ lineHeight:25, fontWeight:'600',}}>Engine Diagnostics</Text>
        </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Compression Test</Text>
            </View>
            </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Ignition Timing Check</Text>
            </View>
            </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Fuel System Inspection</Text>
            </View>
            </View>
        <View style={styles.rowContainer}>
        <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
        <Text style={{ lineHeight:25, fontWeight:'600',}}>Electrical Diagnostics</Text>
        </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Battery Voltage Test</Text>
            </View>
            </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Wiring Harness Check</Text>
            </View>
            </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Charging System Test</Text>
            </View>
            </View>
        <View style={styles.rowContainer}>
        <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
        <Text style={{ lineHeight:25, fontWeight:'600',}}>Brake Diagnostics</Text>
        </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Brake Pad Thickness Measurement</Text>
            </View>
            </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Brake Fluid Analysis</Text>
            </View>
            </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Brake System Bleeding</Text>
            </View>
            </View>
        <View style={styles.rowContainer}>
        <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
        <Text style={{ lineHeight:25, fontWeight:'600',}}>Fuel System Diagnostics</Text>
        </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Fuel Pressure Test</Text>
            </View>
            </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Injector Flow Test</Text>
            </View>
            </View>
            <View style={styles.rowContainer}>
        <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
        <Text style={{ lineHeight:25, fontWeight:'600',}}>Ignition System Diagnostics</Text>
        </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Spark Plug Inspection</Text>
            </View>
            </View>
            <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
            <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
            <Text style={{ fontWeight:'300',}}> Ignition Coil Testing</Text>
            </View>
            </View>
        <View style={styles.cartButton}>
        <View style={styles.cartContainer}>
            <Text style={styles.cartText}>Add to cart</Text>
        </View>
        </View>
    </View>
    </View>
    </ScrollView>
  );
};

const FourWheelerScreen = () => {
    return (
        <ScrollView>
        <View style={styles.container}>
          <View style={styles.twoContainer}>
            <Text style={styles.heading}>Diagnostic Services</Text>
            <View style={styles.rowContainer}>
            <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
            <Text style={{ lineHeight:25, fontWeight:'600',}}>Engine Diagnostics</Text>
            </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Cylinder Leakdown Test</Text>
                </View>
                </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Exhaust Gas Analysis</Text>
                </View>
                </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Timing Belt Inspection</Text>
                </View>
                </View>
            <View style={styles.rowContainer}>
            <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
            <Text style={{ lineHeight:25, fontWeight:'600',}}>Transmission Diagnostics</Text>
            </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Transmission Fluid Analysis</Text>
                </View>
                </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Shift Solenoid Testing</Text>
                </View>
                </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Torque Converter Lock-Up Test</Text>
                </View>
                </View>
            <View style={styles.rowContainer}>
            <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
            <Text style={{ lineHeight:25, fontWeight:'600',}}>Electrical System Diagnostics</Text>
            </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Voltage Drop Test</Text>
                </View>
                </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Component Resistance Testing</Text>
                </View>
                </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> CAN Bus Communication Check</Text>
                </View>
                </View>
            <View style={styles.rowContainer}>
            <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
            <Text style={{ lineHeight:25, fontWeight:'600',}}>Emission System Diagnostics</Text>
            </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> EVAP System Leak Test</Text>
                </View>
                </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Catalytic Converter Efficiency Test</Text>
                </View>
                </View>
                <View style={styles.rowContainer}>
            <Text style={{ color: '#c05000', paddingLeft:10, paddingRight:10, lineHeight:25,}}>&#10004;</Text>
            <Text style={{ lineHeight:25, fontWeight:'600',}}>ABS System Diagnostics</Text>
            </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Wheel Speed Sensor Testing</Text>
                </View>
                </View>
                <View style={styles.columnContainer}>
                <View style={styles.rowContainer}>
                <Text style={{paddingLeft:25, fontSize:12, lineHeight:25,}}>&#x25CF;</Text>
                <Text style={{ fontWeight:'300',}}> Hydraulic Pressure Test</Text>
                </View>
                </View>
            <View style={styles.cartButton}>
            <View style={styles.cartContainer}>
                <Text style={styles.cartText}>Add to cart</Text>
            </View>
            </View>
        </View>
        </View>
        </ScrollView>
      );
};

const DiagnosticsScreen = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="TwoWheelerScreen"
      component={TwoWheelerScreen}
      options={{
        tabBarLabel: '2 Wheeler',
        tabBarIcon: () => (
          <Image source={require('../assets/motorcycle.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
    <Tab.Screen
      name="FourWheelerScreen"
      component={FourWheelerScreen}
      options={{
        tabBarLabel: '4 Wheeler',
        tabBarIcon: () => (
          <Image source={require('../assets/car.gif')} style={{ width: 40, height: 40 }} />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft:10,
    marginRight:10,
    marginTop:10,
    marginBottom:10,
  },
  rowContainer:{
    flexDirection: 'row',
  },
  columnContainer:{
    flexDirection: 'column',
  },
  boldText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  twoContainer:{
    flex: 1,
    borderColor: '#888',
    borderWidth:1,
    backgroundColor:'#fff',
    borderRadius:5,
    height:520,
  },
  heading:{
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'center',
    paddingTop:10,
    paddingBottom:10,
  },
  cartText:{
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    fontStyle: 'normal',
    color:'white',
    fontWeight:'500',
    alignItems:'center',
    justifyContent:'center',
  },
  cartContainer:{
    marginTop: 10,
    marginBottom: 10,
    width: screenWidth * 0.5,
    height:35,
    backgroundColor:'#c05000',
    borderRadius:3,
    justifyContent:'center',
    alignItems:'center',
  },
  cartButton:{
    
    justifyContent:'center',
    alignItems:'center',
  },
});

export default DiagnosticsScreen;