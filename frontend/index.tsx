import { registerRootComponent } from 'expo';
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import App from './App';

function Main() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

registerRootComponent(Main);
