import React from 'react';
import Routes from './routes';

import './styles/global.css';
import 'leaflet/dist/leaflet.css';

import { ToastProvider } from 'react-toast-notifications';

function App() {
  return (
    <ToastProvider autoDismiss={true} autoDismissTimeout={2000}>
      <Routes />
    </ToastProvider>
  );
}

export default App;
