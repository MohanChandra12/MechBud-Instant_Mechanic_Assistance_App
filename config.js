import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAcYS3bUtzJkDmI7MJcLFeCfCYsiJ4Ga0Q",
    authDomain: "mohan-chandra.firebaseapp.com",
    databaseURL: "https://mohan-chandra-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "mohan-chandra",
    storageBucket: "mohan-chandra.appspot.com",
    messagingSenderId: "109100575068545080593",
    appId: "1:966077020077:web:ecc0990687d28822acd324"
  };
  
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
  
export {firebase};