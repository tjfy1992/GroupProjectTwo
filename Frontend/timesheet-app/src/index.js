import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import qs from 'qs';

//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

//axios interceptor for request
axios.interceptors.request.use(

  (config) => {
    console.log(config.method)
    if (config.method === "post"){
        config.data = qs.stringify(config.data);
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
  },

  (req) => {
    console.log(123)
     //req.headers['Access-Control-Allow-Origin'] = '*';
     //todo: add token here
     return req;
  },

  (err) => {
     return Promise.reject(err);
  }
);

//axios interceptor for response
axios.interceptors.response.use(
  (successRes) =>  {
    return successRes;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
