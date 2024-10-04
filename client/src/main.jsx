import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';


const rootElement = document.getElementById('root');

if (ReactDOM.createRoot) {
  // React 18
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // React 17 and below
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
}