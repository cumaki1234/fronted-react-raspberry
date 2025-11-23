importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDjTJUPChaa34aSKHZ244GCkLVwyCxzhFM",
    authDomain: "prueba-app-raspberry.firebaseapp.com",
    projectId: "prueba-app-raspberry",
    messagingSenderId: "2608170308",
    appId: "1:2608170308:web:ca4150d7d9c04d3167c311"
};

// Inicializar Firebase aquí:
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
