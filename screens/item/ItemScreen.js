import {React,useEffect,useState} from 'react';
import { View, Text,ScrollView, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { auth,database } from '../../Connector/Firebase'; 

const ArticleScreen = ({navigation, route}) => {
    const { fish } = route.params;
    const [fishData, setFishData] = useState([]); 

     useEffect(() => {
     const unsubscribe = database.collection('articles').onSnapshot((snapshot) => {
      const articles = [];
      snapshot.forEach((doc) => {
        articles.push({ id: doc.id, ...doc.data() });
      });
      setFishData(articles);
    });
    return unsubscribe;

  }, []);

    console.log(fish);
    const renderSimilarFish = ({ item }) => (
        <TouchableOpacity style={styles.similarFish} onPress={()=>navigation.navigate("Article", { fish: item })}>
        <Animatable.Image
            animation="fadeIn"
            delay={200}
            duration={800}
            source={{uri:item.imageUrl}}
            style={styles.similarFishImage}
        />
        <Text style={styles.similarFishName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
        <ScrollView style={styles.scroolView}>
            <View style={styles.fishImageContainer}>
                <Animatable.Image
                animation="fadeIn"
                delay={200}
                duration={800}
                source={{uri:fish.imageUrl}}
                style={styles.fishImage}
                />
            </View>
            
            <View style={styles.fishDetailsContainer}>
                <Animatable.Text   animation="fadeInLeft" style={styles.fishName}>{fish.name}</Animatable.Text>
                <Animatable.Text   animation="fadeInUp" style={styles.fishDescription}>{fish.longInfo}</Animatable.Text>
            </View>
            <View style={styles.tagsContainer}>
                <Text style={styles.tagsTitle}>Tags:</Text>
                <View style={styles.tagsList}>
                {fish.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
                </View>
            </View>
            <View style={styles.similarFishContainer}>
                <Text style={styles.similarFishTitle}>Similar Articles:</Text>
                <FlatList
                data={fishData.filter((item) => item.id !== fish.id && item.tags.some((tag) => fish.tags.includes(tag)))}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderSimilarFish}
                />
            </View>
        </ScrollView>
        </View>
    );
};
export default ArticleScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    width: '100%',
    paddingHorizontal: 32,
  },
  imageContainer: {
    marginTop: 32,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    },
  tag: {
    backgroundColor: '#50C2C9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 8,
    },
  scroolView: {
    width: '100%',
    paddingHorizontal: 10,
    },
  fishImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  fishDetailsContainer: {
    marginTop: 32,
  },
  fishName: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  fishDescription: {
    marginTop: 8,
    fontSize: 16,
  },
  tagsContainer: {
    marginTop: 32,
  },
  tagsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  tagContainer: {
    backgroundColor: '#50C2C9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    color: 'white',
    fontWeight: 'bold',
  },
  similarFishContainer: {
    marginTop: 32,
  },
  similarFishTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  similarFish: {
    marginRight: 16,
    marginTop: 16,
    marginBottom: 32,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    elevation: 1,
  },

  similarFishItemContainer: {
    marginRight: 16,
  },
  similarFishImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  similarFishName: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
