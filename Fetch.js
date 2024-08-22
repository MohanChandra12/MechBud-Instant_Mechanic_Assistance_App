import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {firebase} from './config';

const Fetch = () => {
    const [users, setUsers] = useState([]);
    const todoRef = firebase.firestore().collection('todos');
    useEffect (async () => {
    todoRef.onSnapshot(querySnapshot => {
    const users = []
    querySnapshot.forEach((doc) => {
    const { heading, text}=doc.data()
    users.push({
      id: doc.id,
      id,
      username,
      email,
      phone_number,
      gender,
      password
    })
    })
    setUsers(users)
    }
    )
  },[Fetch()]);
  return(
    <View style={{flex:1, marginTop:100}}>
    <FlatList
    style={{height:'100%'}}
    data={{users}}
    numColumns={1}
    renderItem={({item})=>(
      <Pressable
      style={StyleSheet.container}>
        <View>
          <Text>{item.id}</Text>
          <Text>{item.username}</Text>
          <Text>{item.email}</Text>
          <Text>{item.phone_number}</Text>
          <Text>{item.gender}</Text>
          <Text>{item.password}</Text>
          </View></Pressable>
    )}></FlatList>
    </View>
  )
}

export default Fetch;