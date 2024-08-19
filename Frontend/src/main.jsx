import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'sonner';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import SocketProvider from './services/socketProvider';
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
       <PersistGate loading={null} persistor={persistor}>
         <BrowserRouter>
          <Toaster/>
          <App/>
        </BrowserRouter>
       </PersistGate>
      </SocketProvider>
    </Provider>
  </React.StrictMode>,
);
