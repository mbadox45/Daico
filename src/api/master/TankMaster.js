import http from '../http-auth'
import http2 from '../http-common'

export default new class TankMaster{
    getAll(){
        return http2.get('tank');
    }
    getByID(id){
        return http2.get(`tank/get/${id}`);
    }

    addPost(data){
        return http.post(`tank/add`, data);
    }
    updatePost(id,data){
        return http.post(`tank/update/${id}`, data);
    }
}