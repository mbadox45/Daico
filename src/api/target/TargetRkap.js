import http from '../http-auth'
import http2 from '../http-common'

export default new class TargetRkap{
    
    addPost(data){
        return http.post(`target-rkap/add`, data);
    }
    updatePost(id,data){
        return http.post(`target-rkap/update/${id}`, data);
    }
    
    getAll(){
        return http2.get('target-rkap');
    }
    getByID(id){
        return http2.get(`target-rkap/get/${id}`);
    }
    getByDate(date){
        return http2.post(`target-rkap/date`, date);
    }
}