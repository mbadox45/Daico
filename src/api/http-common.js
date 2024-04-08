import axios from "axios";
import { URL_API } from "./DataVariable";

export default axios.create({
    baseURL:URL_API,
    headers:{
        'Content-Type': 'application/json'
    }
})