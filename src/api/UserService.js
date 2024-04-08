import http from './http-auth'

export default new class UserService{
    getUsers(){
        return http.get('users');
    }
    getUsersID(id){
        return http.get(`user/get/${id}`);
    }
    activeUser(id){
        return http.get(`user/active/${id}`);
    }
    resetPasswordUser(id){
        return http.get(`reset-password/${id}`);
    }

    addUser(data){
        return http.post(`user/add`, data);
    }
    updateUser(id,data){
        return http.post(`user/update/${id}`, data);
    }
    logoutUser(){
        return http.post(`logout`);
    }
}