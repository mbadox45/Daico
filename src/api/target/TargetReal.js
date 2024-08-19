import http from '../http-auth'
import http2 from '../http-common'

export default new class TargetReal{
    
    addPost(data){
        return http.post(`target-real/add`, data);
    }
    updatePost(id,data){
        return http.post(`target-real/update/${id}`, data);
    }
    
    getAll(){
        return http2.get('target-real');
    }
    getByID(id){
        return http2.get(`target-real/get/${id}`);
    }
    getByDate(date){
        return http2.post(`target-real/date`, date);
    }
}