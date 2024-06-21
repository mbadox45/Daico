import http from '../http-auth'
import http2 from '../http-common'

export default new class RekeningKerja{
    getAll(){
        return http2.get('rekening-unit');
    }
    getByID(id){
        return http2.get(`rekening-unit/get/${id}`);
    }
    getLatest(){
        return http.get(`rekening-unit/latest`);
    }

    addPost(data){
        return http.post(`rekening-unit/add`, data);
    }
    updatePost(id,data){
        return http.post(`rekening-unit/update/${id}`, data);
    }
}