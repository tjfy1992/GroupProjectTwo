import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import qs from 'qs';


//axios interceptor for request
axios.interceptors.request.use(

  (config) => {
    let token = localStorage.getItem('token')
    if(token){
      config.headers['token'] = token;
    }
    else{
      config.headers['token'] = '';
    }

    if (config.method === "post"){
        if(config.headers['Content-Type'] !== 'multipart/form-data'){
          config.data = qs.stringify(config.data);
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }  
    }
    return config;
  },

  (req) => {
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
    if(error.response.status === 403){
      localStorage.clear()
      window.location.href = 'http://localhost:3000'
    }
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
