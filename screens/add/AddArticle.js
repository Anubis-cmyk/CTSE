import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import {database,storage,auth} from '../../Connector/Firebase';
import firebase from 'firebase/app';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useNavigation } from '@react-navigation/native';


const AddArticleScreen = () => {

    const [name, setName] = useState('');
    const [shortInfo, setShortInfo] = useState('');
    const [longInfo, setLongInfo] = useState('');
    const [tags, setTags] = useState('');
    const [tagsList, setTagsList] = useState([]);
    const [image, setImage] = useState(null);
    const [user, setUser] = useState(null);
    const [showProgress, setShowProgress] = useState(false);

    const navigation = useNavigation();
    
    
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.canceled) {
        setImage(result.uri);
        }
    };

    const takeImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.canceled) {
        setImage(result.uri);
        }
    };
    const addNewTag = () => {
        setTagsList([...tagsList, tags]);
        setTags('');
    };

    const removeTag = (index) => {
        setTagsList(tagsList.filter((tag, i) => i !== index));
    };
    const handleUpload = async () => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = storage.ref().child(`images/${name}-${new Date().getTime()}`);
        await ref.put(blob);
        const url = await ref.getDownloadURL();
        return url;
    };

    const handleSubmit = async () => {
        try {
        if (name === '') {
          alert('Please enter a name');
          return;
        }
        if (shortInfo === '') {
          alert('Please enter a short description');
          return;
        }
        if (longInfo === '') {
          alert('Please enter a long description');
          return;
        }
        if (tagsList.length === 0) {
          alert('Please enter at least one tag');
          return;
        }
        if (image === null) {
          alert('Please select an image');
          return;
        }

        
        const imageUrl = await handleUpload();
        const articleRef = database.collection('articles').doc();
        await articleRef.set({
            "id":articleRef.id,
            "name":name,
            "shortInfo":shortInfo,
            "longInfo":longInfo,
            "tags":tagsList,
            "imageUrl":imageUrl,
            "voteCount": 0,  
            "votedBy": [],
            "userEmail": user.email,
        }).then(() => {
            setName('');
            setShortInfo('');
            setLongInfo('');
            setTags('');
            setImage(null);
            setTagsList([]); 
            alert('Article added successfully!');
        });
       
        } catch (error) {
        alert(error.message);
        }
    };

  return (
    <ScrollView style={styles.pageContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ''}>
        <LinearGradient colors={[ '#072b42', '#005a79', '#008ea0', '#00c3af', '#27f8a6']} >
        <View style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={40} color="#fff" />
            </TouchableOpacity>
            <Animatable.Text animation="fadeInDown" duration={1000} style={styles.title}>Add a new article</Animatable.Text>
          </View>
              <View style={styles.formContainer}>
              <Animatable.View animation="fadeInLeft" duration={1000} style={styles.inputContainer}>
                <Text style={styles.label}>Name of the article</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setName(text)}
                  value={name}
                />
              </Animatable.View>
              <Animatable.View animation="fadeInRight" duration={1000} style={styles.inputContainer}>
                <Text style={styles.label}>Enter a short description</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setShortInfo(text)}
                  value={shortInfo}
                />
              </Animatable.View>
              <Animatable.View animation="fadeInLeft" duration={1000} style={styles.inputContainer}>
                <Text style={styles.label}>Enter a long description</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setLongInfo(text)}
                  value={longInfo}
                  multiline={true}
                  numberOfLines={4}
                />
              </Animatable.View>
              <Animatable.View animation="fadeInRight" duration={1000} style={styles.inputContainer}>
                <Text style={styles.label}>Enter tags</Text>
                <View style={styles.tagsContainer}>
                  {tagsList.map((tag, index) => (
                    <Animatable.View animation={"fadeInRight"} key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeTag(index)}>
                        <Ionicons name="close" size={20} color="#e74c3c" />
                      </TouchableOpacity>
                    </Animatable.View>
                  ))}
                   <View style={styles.tag}>
                      <TextInput
                        style={styles.tagInput}
                        onChangeText={text => setTags(text)}
                        value={tags}
                        placeholder="Add a tag"
                        placeholderTextColor="#999"
                      />
                      <TouchableOpacity onPress={addNewTag}>
                        <Ionicons name="add" size={20} color="#012343" />
                      </TouchableOpacity>
                    </View>
                </View>
              </Animatable.View>
              <Animatable.View animation="fadeInUp" duration={1000} style={styles.imageContainer}>
                {image ? (
                <Ionicons name="close" size={30} color="#e74c3c" style={styles.imageClose} onPress={() => setImage(null)} />
                ) : null}
                {image ? (
                    <Animatable.Image animation={"zoomIn"} source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons
                      name="camera-outline"
                      size={30}
                      color="#999"
                      onPress={takeImage}
                      style={styles.imageIcon}
                      />
                  <Ionicons
                      name="image-outline"
                      size={30}
                      color="#999"
                      onPress={pickImage}
                      style={styles.imageIcon}
                      />
                  </View>
                  )}
                  </Animatable.View>
                  <TouchableOpacity onPress={handleSubmit}>
                  <Animatable.View animation="fadeIn" duration={1000} style={styles.button}>
                      <Text style={styles.buttonText}>Save Article</Text>
                  </Animatable.View>
                  </TouchableOpacity>
          </View>
    </View>
          </LinearGradient>
  </KeyboardAvoidingView>
</ScrollView>
);
};
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20, 
    width: '100%',  
    
  },
  header: {
    display: 'flex',
    flexDirection: 'row', 
    justifyContent: 'space-evenly',
    width: '90%',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius:10,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
     backgroundColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    color: '#6B6B6B',
    marginRight: 5,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',

  },
  tagText: {
    color: '#6B6B6B',
    marginRight: 5,
  },
  tagInput: {
    color: '#6B6B6B',
    marginRight: 5,
    width: 100,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#999',
    padding: 5,
    borderRadius: 5,
    color: '#6B6B6B',
    backgroundColor: '#fff',
  },
  imageClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    elevation: 2,
    borderColor: '#999',
    borderWidth: 1,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageIcon: {
    marginRight: 10,
    padding: 15,    
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
    
  },

  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
 button: {
    backgroundColor: '#012343',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 5,
    color: '#FFF',
    },
buttonText: {
    textAlign: 'center',
    color: '#0097A7',
    fontSize: 16,
    fontWeight: 'bold',
    },
});


export default AddArticleScreen;