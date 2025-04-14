import global from "global";
import React from "react";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import "bootstrap/dist/css/bootstrap.min.css";

// Set global as window if not already defined
if (typeof global === 'undefined') {
  window.global = window;
}



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
