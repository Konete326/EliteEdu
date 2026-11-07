import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { runStorageCleanup } from './utils/storagePurge';

runStorageCleanup();

window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

if ('serviceWorker' in navigator) {
  let hasExistingController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hasExistingController && !refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

let originalPrintTitle = '';
window.addEventListener('beforeprint', () => {
  originalPrintTitle = document.title;
  document.title = '';
});
window.addEventListener('afterprint', () => {
  document.title = originalPrintTitle;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
