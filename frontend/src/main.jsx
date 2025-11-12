import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Function to request persistent storage from the browser
// async function requestPersistentStorage() {
//   if (navigator.storage && navigator.storage.persist) {
//     try {
//       // 1. Check if persistence is already granted
//       const isPersisted = await navigator.storage.persisted();
//       if (isPersisted) {
//         console.log("Storage is already persistent. No eviction risk.");
//         return true;
//       }
      
//       // 2. Request persistent storage
//       const granted = await navigator.storage.persist();
      
//       if (granted) {
//         console.log("✅ Persistent storage granted! Data is protected.");
//       } else {
//         alert("⚠️ Persistent storage denied. Data remains 'best-effort'.");
//       }
//       return granted;
//     } catch (error) {
//       console.error("Error requesting persistent storage:", error);
//       return false;
//     }
//   } else {
//     console.log("StorageManager API not supported or persist() not available.");
//     return false;
//   }
// }

// // Call the function when the application starts
// requestPersistentStorage();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)