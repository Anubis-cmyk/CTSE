import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app"
 

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const database = firebase.firestore();
export const storage = firebase.storage();