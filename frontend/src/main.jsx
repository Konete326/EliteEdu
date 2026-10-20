import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.update();
    }).catch(() => {});
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
