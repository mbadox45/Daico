import http from '../http-auth'
import http2 from '../http-common'

export default new class JenisRekeningMaster{
    getAll(){
        return http2.get('jenis-rekening');
    }
    getByID(id){
        return http2.get(`jenis-rekening/get/${id}`);
    }

    addPost(data){
        return http.post(`jenis-rekening/add`, data);
    }
    updatePost(id,data){
        return http.post(`jenis-rekening/update/${id}`, data);
    }
}