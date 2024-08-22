import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CartScreen = () => {
  // State to manage cart items
  const [cartItems, setCartItems] = useState([]);

  // Function to add item to cart
  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  return (
    <View style={styles.container}>
      {/* Display cart items */}
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyCartText}>Your cartz is empty</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
  },
});

export default CartScreen;
