import http from '../http-auth'
import http2 from '../http-common'

export default new class RetailMarketMaster{
    getAll(){
        return http2.get('retail');
    }
    getByID(id){
        return http2.get(`retail/get/${id}`);
    }

    addPost(data){
        return http.post(`retail/add`, data);
    }
    updatePost(id,data){
        return http.post(`retail/update/${id}`, data);
    }
}