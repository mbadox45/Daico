import http from '../http-auth'
import http2 from '../http-common'

export default new class PenyusutanBiayaMaster{
    getAll(){
        return http2.get('biaya-penyusutan');
    }
    getLatest(){
        return http2.get('biaya-penyusutan/latest');
    }
    getByID(id){
        return http2.get(`biaya-penyusutan/get/${id}`);
    }

    addPost(data){
        return http.post(`biaya-penyusutan/add`, data);
    }
    updatePost(id,data){
        return http.post(`biaya-penyusutan/update/${id}`, data);
    }
}