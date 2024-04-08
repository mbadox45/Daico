import http from "./http-common";

class AuthService{
    postSignIn(data){
        return http.post('login',data);
    }
}

export default new AuthService;