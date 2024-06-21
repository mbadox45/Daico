import http from '../http-auth'
import http2 from '../http-common'

export default new class Rekening{
    getAll(){
        return http2.get('rekening');
    }
    getByID(id){
        return http2.get(`rekening/get/${id}`);
    }

    addPost(data){
        return http.post(`rekening/add`, data);
    }
    updatePost(id,data){
        return http.post(`rekening/update/${id}`, data);
    }
}