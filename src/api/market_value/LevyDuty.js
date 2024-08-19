import http from '../http-auth'
import http2 from '../http-common'

export default new class LevyDuty{
    getAll(){
        return http2.get(`levy-duty`);
    }
    getByID(id){
        return http2.get(`levy-duty/get/${id}`);
    }
    getByDate(data){
        return http2.post(`levy-duty/date`, data);
    }

    addPost(data){
        return http.post(`levy-duty/add`, data);
    }
    updatePost(data, id){
        return http.post(`levy-duty/update/${id}`, data);
    }
}