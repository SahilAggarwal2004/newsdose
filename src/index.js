import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ContextProvider from './context/ContextProvider';
import registersw from './registersw';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
);

registersw();