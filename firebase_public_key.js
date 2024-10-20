// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDSfOMkLvsZtgaTgq-xyLHDD2rVkbsV7SM",
    authDomain: "node0x01.firebaseapp.com",
    projectId: "node0x01",
    storageBucket: "node0x01.appspot.com",
    messagingSenderId: "470389990634",
    appId: "1:470389990634:web:e25d8c37109fad01e06393",
    measurementId: "G-2FJ85NF23F"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);



