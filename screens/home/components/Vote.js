import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const Vote = ({ voteCount, onUpvote, onDownvote }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onUpvote}>
        <Text style={styles.buttonText}>Upvote</Text>
      </TouchableOpacity>
      <Text style={styles.voteCount}>{voteCount}</Text>
      <TouchableOpacity style={styles.button} onPress={onDownvote}>
        <Text style={styles.buttonText}>Downvote</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CB8C4',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  voteCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});

export default Vote;
