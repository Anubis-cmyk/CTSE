import React, { useState, useEffect } from 'react';
import { View, Text,Alert, StyleSheet, FlatList,Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/app';
import { auth,database } from '../../Connector/Firebase';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) { 
        setUser(user);
        const userArticlesRef = database.collection('articles').where('userEmail', '==', user.email);
        userArticlesRef.onSnapshot((snapshot) => {
          const articles = [];
          snapshot.forEach((doc) => {
            articles.push({ id: doc.id, ...doc.data() });
          });
          setArticles(articles);
        });
      } else { 
        setUser(null);
      }
    });
 
    return unsubscribe;
  }, []);
 
  const handleEditArticle = (article) => {
    navigation.navigate('EditArticle', { article });
  };

  const handleResetPassword = () => {
    auth.sendPasswordResetEmail(user.email)
      .then(() => { 
        alert('Password reset email sent successfully');
      })
      .catch((error) => { 
        alert(error.message);
      });
  };

  const handleDeleteArticle = async (article) => {
    try {
      Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this article?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress:async () => { 
           
          await database.collection('articles').doc(article.id).delete();
        } },
      ],
      { cancelable: false }
    );
     
    } catch (error) {
      console.error(error);
    }

    
  };
const renderItem = ({ item })  => (
   <TouchableOpacity style={styles.article} onPress={() => handleEditArticle(item)}>
              <Animatable.View animation={'fadeInDown'} style={styles.articleHeadder}>
                <Text style={styles.articleTitle}>{item.name}</Text>
                <View style={styles.icons}>
                  <TouchableOpacity style={styles.optionIcons} onPress={() => handleDeleteArticle(item)}>
                    <Ionicons name="trash-outline" size={30} color="#f00" />
                  </TouchableOpacity>
                  <TouchableOpacity  style={styles.optionIcons} onPress={() => navigation.navigate('Edit',{item})}>
                    <Ionicons name="md-pencil-sharp" size={30} color="#1c1c1c" />
                  </TouchableOpacity>
                </View>
              </Animatable.View>
              <Animatable.View  animation={'fadeIn'} style={styles.articleImageContainer}>
                {item.imageUrl ?  <Image  source={{ uri: item.imageUrl }} style={styles.articleImageContainer} /> : <Ionicons name="image-outline" size={30} color="#fff" />}

              </Animatable.View>
              <View style={styles.articleInfo}> 
                <View style={styles.articleTags}>
                  {item.tags.map((tag) => (
                    <Text key={tag} style={styles.tag}>{tag}</Text>
                  ))}
                </View>
                <Text style={styles.articleDescription}>{item.shortInfo}</Text>
              </View>
             
            </TouchableOpacity>
  );
  
  return (
    <LinearGradient colors={[ '#072b42', '#005a79', '#008ea0', '#00c3af', '#27f8a6']} style={styles.container}>
      <View style={styles.container}>
      <Animatable.View animation={'fadeInDown'} style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="arrow-back" size={40} color="#000" onPress={() => navigation.goBack()} />
          <Text style={styles.title}>My Profile</Text>
        </View>
        {user && (
          <>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
           <TouchableOpacity style={styles.addArticle} onPress={handleResetPassword}>
                <Text style={styles.addArticleText}>Reset Password</Text>
              </TouchableOpacity> 
          </>
        )}
      </Animatable.View>
      <Animatable.View animation={'fadeInUp'} style={styles.articlesContainer}>
        <View style={styles.inputContainer}>
          <Animatable.Text animation={'fadeInLeft'}  style={styles.articlesTitle}>My Articles</Animatable.Text>
          <Animatable.View animation={'fadeInRight'} >
            <TouchableOpacity style={styles.addArticle} onPress={() => navigation.navigate('Add')}>
            <Ionicons name="add-sharp" size={20} color="#fff" />
            <Text style={styles.addArticleText}>Add Article</Text>
          </TouchableOpacity>
          </Animatable.View>
        </View>
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => <Text style={styles.noArticles}>No articles yet</Text>}
        />
      </Animatable.View>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileCard: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  articleHeadder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  optionIcons: {
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    
  },

  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImageContainer: { 
    width: '100%', 
    justifyContent: 'space-evenly',
    flexDirection: 'row', 
  },
  profileInfo: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  articlesContainer: {
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    marginBottom: 10,
  },
  addArticle: {
    backgroundColor: '#012343',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    color: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addArticleText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  articlesTitle: {
    fontSize: 24,
    marginTop: 25,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  article: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
    height: 450,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: '#999',
    borderRadius: 5,
    padding: 5,
  },
  articleImageContainer: {
    width: '90%',
    height: '65%',
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center', 

},
articleInfo: {
flex: 1,
},
articleTitle: {
fontSize: 20,
fontWeight: 'bold',
marginBottom: 5,
},
articleTags: {
    display:'flex',
    flexDirection: 'row',
    flexWrap: 'wrap', 
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
  },
  tag: {
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 12,
    color: '#6B6B6B',
    marginRight: 5,
    marginTop: 5,
  },
  articleDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: '#6B6B6B',
    marginRight: 10,
    marginLeft: 10,
    flexWrap: 'wrap',
  },
noArticles: {
fontSize: 18,
color: '#fff',
textAlign: 'center',
marginTop: 20,
},
});

export default ProfileScreen;