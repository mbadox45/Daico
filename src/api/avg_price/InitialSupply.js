import http from '../http-common'
import http2 from '../http-auth'

export default new class InitialSupply{
    getAll(){
        return http.get('initial-supply');
    }
    getByID(id){
        return http.get(`initial-supply/get/${id}`);
    }
    getByDate(date){
        return http.post(`initial-supply/date`,date);
    }

    addPost(data){
        return http2.post(`initial-supply/add`, data);
    }
    updatePost(id,data){
        return http2.post(`initial-supply/update/${id}`, data);
    }
}