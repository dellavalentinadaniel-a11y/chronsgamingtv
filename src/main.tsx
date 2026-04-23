import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SupabaseAuthProvider>
        <App />
      </SupabaseAuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
