import axios from "axios";
import { URL_API_Portal } from "./DataVariable";

const http = axios.create({
    baseURL: URL_API_Portal,
})

class VerifyService{
    getUser(id,headers){
        return http.get(`user/get/${id}`, headers);
    }
}

export default new VerifyService;