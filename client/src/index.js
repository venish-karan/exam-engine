import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Store from './store/Store';
import AuthProvider from './store/AuthProvider';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import persistStore from 'redux-persist/es/persistStore';

// const persistor = persistStore(Store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <BrowserRouter>
    <AuthProvider store={Store}>
      {/* <PersistGate persistor={persistor} > */}
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
      {/* </PersistGate> */}
    </AuthProvider>
  </BrowserRouter>
  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
