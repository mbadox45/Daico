import http from '../http-auth'
import http2 from '../http-common'

export default new class KursMandiri{
    getAll(){
        return http2.get('kurs-mandiri');
    }
    getByID(id){
        return http2.get(`kurs-mandiri/get/${id}`);
    }
    getLatest(){
        return http.get(`kurs-mandiri/latest`);
    }
    getByDate(data){
        return http.post(`kurs-mandiri/date`, data);
    }

    addPost(data){
        return http.post(`kurs-mandiri/add`, data);
    }
    updatePost(id,data){
        return http.post(`kurs-mandiri/update/${id}`, data);
    }
}