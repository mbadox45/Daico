import axios from "axios";
import { URL_API_Portal, APP_ID } from "./DataVariable";

const http = axios.create({
    baseURL: URL_API_Portal,
})

class VerifyService{
    getUser(id,headers){
        return http.get(`user/get/${id}`, headers);
    }

    getAkses(headers){
        return http.get(`akses/app/get/${APP_ID}`, headers);
    }

}

export default new VerifyService;