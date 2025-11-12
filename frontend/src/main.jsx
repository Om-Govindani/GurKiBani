// frontend/src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


// **********************************************
// * THE CRITICAL FIX FOR PERSISTENT STORAGE *
// **********************************************
async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (isPersisted) {
        console.log("Storage is already persistent.");
        return true;
      }
      
      // Request persistent storage
      const granted = await navigator.storage.persist();
      
      if (granted) {
        alert("✅ Persistent storage granted! Data is protected.");
      } else {
        alert("⚠️ Persistent storage denied. Please ensure PWA is installed.");
      }
      return granted;
    } catch (error) {
      alert("Error requesting persistent storage:", error);
      return false;
    }
  } else {
    alert("StorageManager API not supported.");
    return false;
  }
}

// Call the function immediately before mounting the React App
requestPersistentStorage();
// **********************************************
// * END OF CRITICAL FIX *
// **********************************************


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)