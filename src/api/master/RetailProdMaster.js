import http from '../http-auth'
import http2 from '../http-common'

export default new class RetailProdMaster{
    getAll(){
        return http2.get('retail-prod');
    }
    getByID(id){
        return http2.get(`retail-prod/get/${id}`);
    }

    addPost(data){
        return http.post(`retail-prod/add`, data);
    }
    updatePost(id,data){
        return http.post(`retail-prod/update/${id}`, data);
    }
}