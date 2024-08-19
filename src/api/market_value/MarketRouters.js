import http from '../http-auth'
import http2 from '../http-common'

export default new class MarketRouters{
    getAll(){
        return http2.get(`market-router`);
    }
    getByID(id){
        return http2.get(`market-router/get/${id}`);
    }
    getByDate(data){
        return http2.post(`market-router/date`, data);
    }

    addPost(data){
        return http.post(`market-router/add`, data);
    }
    updatePost(data, id){
        return http.post(`market-router/update/${id}`, data);
    }
}