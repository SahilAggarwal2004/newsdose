import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import State from './context/State';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <State>
    <App />
  </State>
);