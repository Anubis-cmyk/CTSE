import { useState, React, useEffect } from 'react';
import { StyleSheet, Text, View,ScrollView, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../assets/logo.png';
import { auth,database } from '../../Connector/Firebase'; 
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
 
export default function HomeScreen() {
 
  const [isSearch, setIsSearch] = useState(true); 
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [fishData, setFishData] = useState([]); 
  const [votedBy, setVotedBy] = useState([]); 
  const [ipAddress, setIpAddress] = useState('');

  /**
   * Check if user is logged in
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) { 
        setUser(user);
      } else { 
        setUser(null);         
      }
    });
  
    return unsubscribe;
  }, []);

  /**
  * Get user ip address
  */
  useEffect(() => {
    const fetchIpAddress = async () => {
      const response = await fetch('https://api.ipify.org/?format=json');
      const data = await response.json();
      setIpAddress(data.ip);
    };

    fetchIpAddress();
  }, []);

  /**
   * Get fish data from firebase
   */
  useEffect(() => {
     const unsubscribe = database.collection('articles').onSnapshot((snapshot) => {
      const articles = [];
      snapshot.forEach((doc) => {
        articles.push({ id: doc.id, ...doc.data() });
      });
      setFishData(articles);
    });
    return unsubscribe;

  }, [fishData]);


  /**
   * Increase vote count
   * @param {*} id 
   * @param {*} currentVote 
   * @param {*} votedBy 
   */
  const upVote = (id,currentVote,votedBy) => {
    console.log('upvote');

    database.collection('articles').doc(id).update({
      voteCount: currentVote + 1,
      votedBy:  [...votedBy, ipAddress]
    });

  };
  /**
   * Decrease vote count
   * @param {*} id 
   * @param {*} currentVote 
   * @param {*} votedBy 
   */
  const downVote = (id,currentVote,votedBy) => {
    console.log('downvote');
     database.collection('articles').doc(id).update({
      voteCount: currentVote - 1,
      "votedBy": votedBy.filter((item) => item !== ipAddress)
    });
  };

   

  const renderItem = ({ item }) => (
    
    <TouchableOpacity
      style={styles.fishCard}
      onPress={() => navigation.navigate('Article', { fish: item })}
    >
      <Image source={{uri:item.imageUrl}} style={styles.fishImage} />
      <View style={styles.fishTags}>
          {item.tags.map((tag) => (
            <Text key={tag} style={styles.fishTag}>{tag}</Text>
          ))}
        </View>
        <View style={styles.container}>
    
      <View style={styles.fishInfo}>
        <View style={styles.fishNameContainer}>
            <Text style={styles.fishName}>{item.name}</Text>
            <View style={styles.fishVote}>
                <TouchableOpacity style={styles.voteButton} onPress={()=>downVote(item.id,item.voteCount,item.votedBy)}>
                  <Ionicons name="md-arrow-down-circle" size={24} color="#4CB8C4" />
                </TouchableOpacity>
                <Text style={styles.voteCount}>{item.voteCount}</Text>
                <TouchableOpacity style={styles.voteButton} onPress={()=>{item.votedBy.includes(ipAddress)? alert('hi') :upVote(item.id,item.voteCount,item.votedBy) }}>
                  <Ionicons name="md-arrow-up-circle" size={24} color="#4CB8C4" />
                </TouchableOpacity> 
            </View>
        </View>
        <Text style={styles.fishShortInfo}>{item.shortInfo}</Text>
      </View>
    </View>
    <Text  style={styles.textSeeMore}>See more</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[ '#072b42', '#005a79', '#008ea0', '#00c3af', '#27f8a6']} style={styles.header}>
        {isSearch ? 
        (<Image source={logo} style={styles.logoImage} />) : 
        (<TextInput style={styles.searchInput} placeholder="Search"onChange={()=>searchItems} />)}
        <View style={styles.headerRight}>
            <TouchableOpacity style={styles.button} onPress={()=>setIsSearch(!isSearch)}>
                <Ionicons name={isSearch?"md-search":'md-close'} size={24} color="#fff" />
            </TouchableOpacity>
            {user ? (
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('userProfile')}>
                <Ionicons name="md-person" size={24} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Ionicons name="md-log-in" size={24} color="#e74c3c" />
              </TouchableOpacity>
            )}
        </View>
      </LinearGradient>
      <Animatable.View style={styles.searchTagList} animation="fadeInRightBig">
            <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={styles.tag} onPress={()=>navigation.navigate('Category',{category:'Fish'})}>
                <Animatable.Text style={styles.tags} animation="fadeInRight">Fish</Animatable.Text>
              </TouchableOpacity>
             
            </ScrollView>
      </Animatable.View>  
      <View style={styles.content}>
        <FlatList
          data={fishData}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={styles.fishCard.height + styles.fishCard.marginBottom}
          snapToAlignment="start"
          snapToEnd={false}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#845EC2',
  },
searchInput:{
    width: 300,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 16,

},
 logoImage:{
    width: 170,
    height: 80,

},
searchTagList:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    backgroundColor: 'rbga(250,250,0,0.5)',
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 16,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
}, 
tag:{ 
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 16,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
},
headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 80,
},
header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding:10,
  },
  fishNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    },
  fishVote: {
    display: 'flex',
    flexDirection: 'row',
    width: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
},
voteButton: {
    width: 30,
    height: 30,
    borderRadius: 15, 
    alignItems: 'center',
    justifyContent: 'center',
},
voteCount: {
    fontSize: 14,
    color: '#4CB8C4',
},
textSeeMore: {
    fontSize: 15,
    color: '#4CB8C4',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 80,
  },
  fishCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 500,
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: '#FDFDFD',
    borderRadius: 10,
    marginBottom: 20, 
  },
  fishImage: {
    width: '100%',
    height: '40%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  fishInfo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  fishName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CB8C4',
    marginBottom: 5,
  },
  fishShortInfo: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 10,
  },
  fishTags: {
    display:'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  fishTag: {
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    color: '#6B6B6B',
    marginRight: 5,
    marginTop: 5,
  },
});
