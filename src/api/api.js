import axios from 'axios';

export const NodeURL = 'http://localhost:4000';
// export const NodeURL = 'http://einstro-001-site5.htempurl.com/';
// export const NodeURL = 'https://api.einstrostudyabroad.com';


export const client = axios.create({
  baseURL: NodeURL,
});

client.defaults.responseType = 'json';

client.interceptors.request.use(function (config) {
  const authToken = localStorage.getItem('ESA-admin');

  if (authToken) {
    config.headers['Authorization'] = authToken;
  }

  return config;
});

const request = (options) => {
  const onSuccess = (response) => {
    /* SESSION HANDLING:
			- When Server returns "00" -> which means the session has expired  
			- Pushes the URL to Login Page -> "/login"
		*/
    if (response?.data?.status === '00') {
      localStorage.removeItem('ESA-admin');
      localStorage.removeItem('adminData');
      window.location = '/admin';
    }
    return response.data; // This in turn returns the data from the server when status is 1
  };
  const onError = (error) => {
    if (error.response) {
      // Request was made but server responded with something other than 2xx
    } else {
      // Something else happened while setting up the request triggered the error
    }
    return Promise.reject(error.response || error.message);
  };
  return client(options).then(onSuccess).catch(onError);
};
export default request;
  