import http from '../http-auth'
import http2 from '../http-common'

export default new class StockAwalCpo{
    getAll(){
        return http2.get('stock-awal-cpo');
    }
    getByID(id){
        return http2.get(`stock-awal-cpo/get/${id}`);
    }
    getByDate(date){
        return http.post(`stock-awal-cpo/date`,date);
    }

    addPost(data){
        return http.post(`stock-awal-cpo/add`, data);
    }
    updatePost(id,data){
        return http.post(`stock-awal-cpo/update/${id}`, data);
    }
}