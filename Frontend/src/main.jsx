import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './app/store';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
// import './index.css';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  
    <Provider store={store}>
    <BrowserRouter>
      <Toaster/>
      <App />
      </BrowserRouter>
    </Provider>
   
  </React.StrictMode>,
);


