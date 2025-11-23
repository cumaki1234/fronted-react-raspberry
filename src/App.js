import React, { useEffect } from 'react';
import { messaging, getToken, onMessage } from './firebase';
import Dashboard from './Dashboard';

function App() {

  useEffect(() => {
    // Pedir permiso para notificaciones
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        // Obtener token FCM para el navegador
        getToken(messaging, { vapidKey: 'BPmt6lS293LToON7YqfnTGb5IXr-BF0mWDGGc8dtk7VDYiNsEhu7iUx1ZMcB5gbgj6EbYJSeqN-A7I0xfttKhZY' })
          .then((currentToken) => {
            if (currentToken) {
              fetch("http://localhost:5000/api/v1/token", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: currentToken })
              })
              .then(res => res.json())
              .then(data => console.log("Token guardado:", data))
              .catch(err => console.error("Error guardando token:", err));

              // TODO: enviar token a backend para guardar en DB
            } else {
              console.log('No se pudo obtener token FCM');
            }
          })
          .catch((err) => {
            console.log('Error al obtener token FCM:', err);
          });
      } else {
        console.log('Permiso para notificaciones denegado');
      }
    });

    // Escuchar mensajes cuando la app está abierta
    onMessage(messaging, (payload) => {
      console.log('Mensaje recibido en primer plano: ', payload);
      alert(`Notificación: ${payload.notification.title} - ${payload.notification.body}`);
    });
  }, []);

  return (
    <div className="App">
      
      <Dashboard />

    </div>
  );
}

export default App;
