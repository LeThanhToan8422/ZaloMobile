import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
   apiKey: 'AIzaSyD8ZCn86sMNfbF_dgdAAUFJWu5zhbdS53o',
   authDomain: 'zalo-764f9.firebaseapp.com',
   projectId: 'zalo-764f9',
   storageBucket: 'zalo-764f9.appspot.com',
   messagingSenderId: '619440363043',
   appId: '1:619440363043:web:d98573010291847385c396',
   measurementId: 'G-6TRP1LKPRB',
};

if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD8ZCn86sMNfbF_dgdAAUFJWu5zhbdS53o",
//   authDomain: "zalo-764f9.firebaseapp.com",
//   projectId: "zalo-764f9",
//   storageBucket: "zalo-764f9.appspot.com",
//   messagingSenderId: "619440363043",
//   appId: "1:619440363043:web:d98573010291847385c396",
//   measurementId: "G-6TRP1LKPRB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
