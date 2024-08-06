import http from '../http-auth'
import http2 from '../http-common'

export default new class TipeRekeningMaster{
    getAll(){
        return http2.get('tipe-rekening');
    }
    getByID(id){
        return http2.get(`tipe-rekening/get/${id}`);
    }

    addPost(data){
        return http.post(`tipe-rekening/add`, data);
    }
    updatePost(id,data){
        return http.post(`tipe-rekening/update/${id}`, data);
    }
}