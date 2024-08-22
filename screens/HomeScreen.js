  import React,{useState, useEffect} from 'react';
  import { StyleSheet, View, Dimensions, Image, ScrollView, Text, TouchableOpacity, Button} from 'react-native';
  import { createStackNavigator } from '@react-navigation/stack';
  import { NavigationContainer, useNavigation } from '@react-navigation/native';
  import { SearchBar } from 'react-native-elements';
  import {LinearGradient} from 'expo-linear-gradient';
  import Swiper from 'react-native-swiper';
  import { AirbnbRating, Rating } from 'react-native-ratings';
  import CartScreen from './CartScreen';

  const { width: screenWidth } = Dimensions.get('window');
  const Stack = createStackNavigator();

  const HomeScreen = () => {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeContent}
            options={{ headerShown: true }} // Hide header for main screen
          />
          <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  const HomeContent = ({ navigation }) => {
    const [search, setSearch] = useState('');
  
    const updateSearch = (text) => {
      setSearch(text);
    };
  
    const addToCart = (item) => {
      // Navigation to CartScreen and passing selected item
      navigation.navigate('Cart', { item: item });
    };
  
    return (
      <ScrollView>
        <View style={styles.container}>
          <SearchBar
            placeholder="Search..."
            onChangeText={updateSearch}
            value={search}
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.inputContainer}
            inputStyle={[styles.input, { color: 'black' }]}
            showClearIcon={true}
          />
          <Text style={styles.topServicesText}>Top Services</Text>
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.imageWrapper}>
                <TouchableOpacity
                  activeOpacity={0.7} onPress={() => {}}>
                  <Image source={require('../assets/Oil-change.jpg')} style={styles.image} />
                </TouchableOpacity>
                <Text style={styles.imageTitle}>Oil Change</Text>
                <Text style={styles.priceText}>₹500 - 1,000/-</Text>
                <Button title="Add to Cart" onPress={() => addToCart({ name: 'Oil Change', price: '₹500 - 1,000' })} style={styles.button} color="#c05000" />
              </View>
              <View style={styles.imageWrapper}>
                <TouchableOpacity
          activeOpacity={0.7} onPress={() => {}}>
                  <Image source={require('../assets/tire-rotation.jpg')} style={styles.image} />
                  </TouchableOpacity>
                  <Text style={styles.imageTitle}>Tire Rotation</Text>
                  <Text style={styles.priceText}>₹1,500 - 4,000/-</Text>
                  <Button title="Add to Cart" onPress={() => {}} style={styles.button} color="#c05000"/>
              </View>
              <View style={styles.imageWrapper}>
                   <TouchableOpacity
          activeOpacity={0.7} onPress={() => {}}>
                  <Image source={require('../assets/toe-truck.jpg')} style={styles.image} />
                  </TouchableOpacity>
                  <Text style={styles.imageTitle}>Tow Truck</Text>
                  <Text style={styles.priceText}>₹1,999 - 3,099/-</Text>
                  <Button title="Add to Cart" onPress={() => {}} style={styles.button} color="#c05000"/>
                </View>
                <View style={styles.imageWrapper}>
                   <TouchableOpacity
          activeOpacity={0.7} onPress={() => {}}>
                  <Image source={require('../assets/break-inspection.jpg')} style={styles.image} />
                  </TouchableOpacity>
                  <Text style={styles.imageTitle}>Break Inspection</Text>
                  <Text style={styles.priceText}>₹2,000 - 7,000/-</Text>
                  <Button title="Add to Cart" onPress={() => {}} style={styles.button} color="#c05000"/>
                </View>
                <View style={styles.imageWrapper}>
                   <TouchableOpacity
          activeOpacity={0.7} onPress={() => {}}>
                  <Image source={require('../assets/engine-diagnostics.jpg')} style={styles.image} />
                  </TouchableOpacity>
                  <Text style={styles.imageTitle}>Engine Diagnostics</Text>
                  <Text style={styles.priceText}>₹3,000 - 10,000/-</Text>
                  <Button title="Add to Cart" onPress={() => {}} style={styles.button} color="#c05000"/>
                </View>
            </ScrollView>
          </View>
          <Text style={styles.topServicesText}>Top Mechanics</Text>
          <View style={styles.wrapper}>
          <Swiper showsButtons={false} loop={true} autoplay={true}>
          <View style={styles.slide1}>
          <Image source={require('../assets/mech1.png')} style={styles.imageSlider} />
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
          style={styles.rating}
        />
        </View>
          </View>
          </View>
          <View style={styles.slide2}>
          <Image source={require('../assets/mech2.jpg')} style={styles.imageSlider} />
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
          style={styles.rating}
        />
        </View>
          </View>
          </View>
          <View style={styles.slide3}>
          <Image source={require('../assets/mech3.jpeg')} style={styles.imageSlider} />
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
          style={styles.rating}
        />
        </View>
          </View>
          </View>
          <View style={styles.slide4}>
          <Image source={require('../assets/mech4.jpeg')} style={styles.imageSlider} />
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
          style={styles.rating}
        />
        </View>
          </View>
          </View>
          <View style={styles.slide5}>
          <Image source={require('../assets/mech5.jpg')} style={styles.imageSlider} />
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
              <Image source={require('../assets/p1.png')} style={styles.reviewImage} />
              <Text style={styles.reviewName}>Deepika</Text>
              <View style={styles.reviewImp}>
              <Text style={styles.reviewWords}>Fast</Text>
              <Text style={styles.reviewWords}>Reliable</Text>
              <Text style={styles.reviewWords}>Swiftly connected</Text>
              </View>
              <Text style={styles.reviewStyle}>"This incredible app swiftly connected me with a nearby mechanic when my car broke down. Fast, reliable, and highly recommended for any driver in need."</Text>
              </View>
              <View style={styles.review}>
              <Image source={require('../assets/p2.jpg')} style={styles.reviewImage} />
              <Text style={styles.reviewName}>Aisha</Text>
              <View style={styles.reviewImp}>
              <Text style={styles.reviewWords}>On call</Text>
              <Text style={styles.reviewWords}>Go-to</Text>
              <Text style={styles.reviewWords}>Personal mechanic</Text>
              </View>
              <Text style={styles.reviewStyle}>"With its user-friendly interface and quick response times, this app is my go-to for all car-related needs. It's like having a personal mechanic on call!"</Text>
              </View>
              <View style={styles.review}>
              <Image source={require('../assets/p3.jpg')} style={styles.reviewImage} />
              <Text style={styles.reviewName}>Chandrasekhar</Text>
              <View style={styles.reviewImp}>
              <Text style={styles.reviewWords}>Convenience</Text>
              <Text style={styles.reviewWords}>Lifesaver</Text>
              <Text style={styles.reviewWords}>Phone</Text>
              </View>
              <Text style={styles.reviewStyle}>"The convenience of booking service appointments from my phone is unmatched. This app's rapid roadside assistance has truly been a lifesaver."</Text>
              </View>
              <View style={styles.review}>
              <Image source={require('../assets/p4.jpg')} style={styles.reviewImage} />
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
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
    inputContainer: {
      backgroundColor: '#d2d2d2',
      borderRadius: 20,
      height: 40,
      borderColor: '#727272',
      borderWidth:1,
      borderBottomWidth: 1,
    },
    reviewContainer: {
      paddingHorizontal: 5,
      marginTop: 50,
      marginBottom: 50,
      height: 150,
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
      marginHorizontal: 3,
      height: 150,
      borderRadius: 3,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#727272',
      alignItems: 'center',
    },
    reviewImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      position: 'absolute', // Added to position the image
      top: 0, // Positioned at the top
      left: 0, // Positioned at the left
      marginLeft:5,
      marginTop:5,
    },
    reviewName:{
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
    reviewStyle:{
      marginTop: 10,
      marginLeft:5,
      marginRight:5,
      lineHeight:20,
      alignItems:'center',
    },
    reviewImp:{
      marginLeft:40,
      flexDirection: 'row',
    },
    input: {
      fontSize: 16,
    },
    topServicesText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
    },
    boldText: {
      fontSize: 16,
      fontWeight: 'bold',
      paddingLeft:15,
    },
    normalText: {
      fontSize: 12,
      fontWeight: 'normal',
      paddingLeft:20,
      paddingTop:2,
      paddingBottom:2,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: '400',
      paddingLeft:20,
      paddingTop:5,
      paddingBottom:5,
    },
    rating: {
      fontWeight: '400',
      backgroundColor: 'transparent',
      paddingTop:5,
      paddingBottom:5,
    },
    contText: {
      fontSize: 12,
      fontWeight: 'normal',
      paddingLeft:20,
    },
    imageContainer: {
      paddingHorizontal: 5,
      paddingTop: 7,
      height: 226,
      borderRadius: 8,
      width: '97%',
      backgroundColor:'#e7f5ff',
      borderColor: '#727272',
      borderWidth:1,
    },
    imageSlider:{
      alignItems:'center',
      justifyContent:'center',
      width: '40%',
      height: '95%',
      borderRadius:800,
    },
    wrapper:{
      height:250,
      flexDirection:"row",
      backgroundColor:"#fff",
      width:'97%',
      borderRadius:10,
      borderColor: '#727272',
      borderWidth:1,
    },
    wrapperContainer:{
      justifyContent:'center',
    },
    slide1:{
      flex:1,
      flexDirection:'row',
      alignItems:'flex-start',
      paddingTop:10,
    },
    slide2:{
      flex:1,
      flexDirection:'row',
      alignItems:'flex-start',
      paddingTop:10,
    },
    slide3:{
      flex:1,
      flexDirection:'row',
      alignItems:'flex-start',
      paddingTop:10,
    },
    slide4:{
      flex:1,
      flexDirection:'row',
      alignItems:'flex-start',
      paddingTop:10,
    },
    slide5:{
      flex:1,
      flexDirection:'row',
      alignItems:'flex-start',
      paddingTop:10,

    },
    imageWrapper: {
      paddingHorizontal: 5,
      paddingTop: 7,
      width: screenWidth * 0.5,
      marginHorizontal: 3,
      height: 210,
      borderRadius:3,
      backgroundColor:'#fff',
      borderWidth: 1,
      borderColor: '#727272',
      alignItems:'center',
    },
    image: {
      width: screenWidth * 0.45, // Adjust the width of the image
      height: screenWidth * 0.3, // Adjust the height of the image
      resizeMode: 'cover',
    },
    imageTitle: {
      marginTop: 5,
      fontSize: 16,
      fontStyle: 'normal',
    },
    gradient:{
      borderRadius:3,
      height: 200,
    },
    priceText: {
      marginTop: 5,
      marginBottom: 5,
      fontSize: 16,
      fontStyle: 'normal',
      color:'purple',
      fontWeight:'500',
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
      marginTop: 5,
      marginBottom: 5,
      alignItems:'center',
      width: screenWidth * 0.3,
      height:35,
      backgroundColor:'#c05000',
      borderRadius:3,
      justifyContent:'center',
    },
    descContainer:{
      flexDirection:'column',
    },
    ratingContainer: {
      backgroundColor: 'transparent', // Customize the background color here
    },
    button:{
      paddingTop:10,
    },
  });

  export default HomeScreen;