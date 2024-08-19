import http from '../http-auth'
import http2 from '../http-common'

export default new class MonthlyDmo{
    
    addPost(data){
        return http.post(`monthly-dmo/add`, data);
    }
    updatePost(id,data){
        return http.post(`monthly-dmo/update/${id}`, data);
    }
    
    getAll(){
        return http2.get('monthly-dmo');
    }
    getByID(id){
        return http2.get(`monthly-dmo/get/${id}`);
    }
    getByDate(date){
        return http2.post(`monthly-dmo/date`, date);
    }
}