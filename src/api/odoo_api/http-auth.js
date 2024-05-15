import axios from "axios";
import { URL_API_Odoo } from "../DataVariable";

const http = axios.create({
    baseURL: URL_API_Odoo,
    headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('usertoken')}`,
        'Access-Control-Allow-Methods':'*',
    }
})

export default http;