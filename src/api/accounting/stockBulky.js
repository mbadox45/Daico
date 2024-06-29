import http from '../http-auth'
import http2 from '../http-common'

export default new class stockBulky{
    getAll(){
        return http2.get('stock-bulky');
    }
    getByID(id){
        return http2.get(`stock-bulky/get/${id}`);
    }
    getLatest(){
        return http2.get(`stock-bulky/latest`);
    }
    getByDate(data){
        return http2.get(`stock-bulky/date`, data);
    }
    getByPeriod(data){
        return http2.get(`stock-bulky/period`, data);
    }

    addPost(data){
        return http.post(`stock-bulky/add`, data);
    }
    updatePost(id,data){
        return http.post(`stock-bulky/update/${id}`, data);
    }
}