import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    //transform data for all responses
    return response.data;
  },
  function (error) {
    console.log('axiosClient -response error', error);
    if (!error.response) throw new Error('Network error. Please try agian later.');

    //redirect to login if not login
    if (error.response.status === 401) {
      //clearn token, logout
      window.location.assign('/login.html');
      return;
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosClient;
