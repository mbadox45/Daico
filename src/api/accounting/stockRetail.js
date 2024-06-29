import http from '../http-auth'
import http2 from '../http-common'

export default new class stockRetail{
    getAll(){
        return http2.get('stock-retail');
    }
    getByID(id){
        return http2.get(`stock-retail/get/${id}`);
    }
    getLatest(){
        return http2.get(`stock-retail/latest`);
    }
    getByDate(data){
        return http2.get(`stock-retail/date`, data);
    }
    getByPeriod(data){
        return http2.get(`stock-retail/period`, data);
    }

    addPost(data){
        return http.post(`stock-retail/add`, data);
    }
    updatePost(id,data){
        return http.post(`stock-retail/update/${id}`, data);
    }
}