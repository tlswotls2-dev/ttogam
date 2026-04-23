import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { CollectionStoreProvider } from './context/CollectionStoreContext.jsx';
import { initializeFirebaseAnalytics } from './firebase/config.js';
import { registerSW } from 'virtual:pwa-register';
import 'leaflet/dist/leaflet.css';
import './index.css';

registerSW({
  immediate: true,
});
initializeFirebaseAnalytics();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <CollectionStoreProvider>
          <App />
        </CollectionStoreProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
