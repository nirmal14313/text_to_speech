import axios from "axios";

// const BASE_URL = "http://192.168.1.125:3064/api";
// export const IMAGE_URL = "http://192.168.1.125:3064/api/uploads";

const BASE_URL = "https://voicebot-poc.appworkdemo.com/api";
export const IMAGE_URL = "https://voicebot-poc.appworkdemo.com/api/uploads";


const DataService = axios.create({
  baseURL: BASE_URL,
});

export default DataService;