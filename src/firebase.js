import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDjTJUPChaa34aSKHZ244GCkLVwyCxzhFM",
    authDomain: "prueba-app-raspberry.firebaseapp.com",
    projectId: "prueba-app-raspberry",
    messagingSenderId: "2608170308",
    appId: "1:2608170308:web:ca4150d7d9c04d3167c311"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };