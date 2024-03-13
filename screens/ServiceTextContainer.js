import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';

const ServiceTextContainer = () => {
  return (
    <View style={styles.container}>
       <View style={styles.serviceItem}>
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
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/analytic.png')} style={styles.logo}/>
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Diagnostic Services</Text>
          </View>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/wheel.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Tire Services</Text>
          </View>
          </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/electrical-engineer.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Electrical and Electronics</Text>
          </View>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/brakes.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Brake Services</Text>
          </View>
        </View>
        </View>
        </View>
      <View style={styles.subItem}>
          <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/fuel-exhaust.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Power System</Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/more.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Others</Text>
          </View>
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
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/fuel.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Fuel Delivery</Text>
          </View>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/accumulator.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Dead Battery</Text>
          </View>
          </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/piston.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Engine Problem</Text>
          </View>
        </View>
        </View>
          <View style={styles.imageWholeContainer}>
          <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/tow.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Tow Truck</Text>
          </View>
        </View>
        </View>
        </View>
      <View style={styles.subItem}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/more.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Others</Text>
          </View>
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
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/engine-oil.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Fluid Top-Ups</Text>
          </View>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/air-filter.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Air Filter Replacement</Text>
          </View>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/spark-plug.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Spark Plug Replacement</Text>
          </View>
        </View>
        </View>
        <View style={styles.imageWholeContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/exhaust-pipe.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Exhaust System</Text>
          </View>
        </View>
        </View>
        </View>
        <View style={styles.subItem}>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/schedule.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Routine Maintenance</Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5} onPress={() => {}} style={styles.touchableContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/more.png')} style={styles.logo} />
          </View>
        </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.subText}>Others</Text>
          </View>
        </View>
        </View>
        </View>
    </View>
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
    backgroundColor: '#d3d3d3',
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
    borderRadius: 1000,
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
    borderColor:'#87ceeb',
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
    borderRadius: 1000,
  },
  emergencyText:{
    fontSize: 15,
    color: '#000000', // Adjust the color as needed
    textAlign: 'center',
  }
});

export default ServiceTextContainer;
