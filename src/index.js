import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ContextProvider from './context/ContextProvider';
import registersw from './registersw';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient({ defaultOptions: { queries: { staleTime: 600000 } } })
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <ContextProvider>
          <App />
        </ContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

registersw();