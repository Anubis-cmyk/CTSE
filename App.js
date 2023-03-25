import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './screens/login/LoginScreen';
import HomeScreen from './screens/home/HomeScreen';
import ArticleScreen from './screens/item/ItemScreen';
import AddArticleScreen from './screens/add/AddArticle';
import ProfileScreen from './screens/profile/ProfileScreen';
import EditArticleScreen from './screens/edit/EditArticleScreen';

import {initializeApp} from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD4E6ZaioGPXuxmEKwhdtUOkbiWMh5DIgY",
  authDomain: "ueeschoolmanagment.firebaseapp.com",
  databaseURL: "https://ueeschoolmanagment-default-rtdb.firebaseio.com",
  projectId: "ueeschoolmanagment",
  storageBucket: "ueeschoolmanagment.appspot.com",
  messagingSenderId: "946389956508",
  appId: "1:946389956508:web:844d5746ddd95379e17a59",
  measurementId: "G-P0YDHG2WBS"
};

initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Add" component={AddArticleScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Edit" component={EditArticleScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="userProfile" component={ProfileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Article" component={ArticleScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
