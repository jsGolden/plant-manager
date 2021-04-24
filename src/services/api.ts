import axios from 'axios';

const api = axios.create({
    baseURL: 'https://my-json-server.typicode.com/jsGolden/plant-manager',
});

export default api;