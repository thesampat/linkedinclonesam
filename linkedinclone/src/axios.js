import axios from 'axios'

const customaxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar', "Content-Type": "application/json" },
  credentials: "include", 

});


customaxios.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 401) {
    return instance(error.config); 
    alert('error on response')
  }

  throw error;
});


export default customaxios

