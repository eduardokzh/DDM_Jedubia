import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Balloon = ({ message, currentUser }) => {
  const isCurrentUser = message.sentBy === currentUser;

  return (
    <View style={[styles.bubble, isCurrentUser ? styles.currentUser : styles.otherUser]}>
      <Text>{message.content}</Text>
      {message.image && <Image source={{ uri: message.image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  currentUser: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  otherUser: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 5,
  },
});

export default Balloon;