import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Vote from './Vote';

const FishCard = ({ fish }) => {
  const [voteCount, setVoteCount] = useState(fish.voteCount);

  const handleUpvote = () => {
    setVoteCount(voteCount + 1);
    // Update vote count in your database
  };

  const handleDownvote = () => {
    setVoteCount(voteCount - 1);
    // Update vote count in your database
  };

  return (
    <View style={styles.fishCard}>
      <Image style={styles.fishImage} source={{ uri: fish.image }} />
      <View style={styles.fishInfo}>
        <Text style={styles.fishName}>{fish.name}</Text>
        <Text style={styles.fishShortInfo}>{fish.shortInfo}</Text>
        <Vote
          voteCount={voteCount}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fishCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    height: 180,
  },
  fishImage: {
    width: 120,
    height: 120,
  },
  fishInfo: {
    flex: 1,
    padding: 10,
  },
  fishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CB8C4',
    marginBottom: 5,
  },
  fishShortInfo: {
    fontSize: 14,
    color: '#6B6B6B',
  },
});

export default FishCard;