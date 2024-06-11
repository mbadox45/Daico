import http from '../http-auth'
import http2 from '../http-common'

export default new class SubProductMaster{
    getAll(){
        return http2.get('sub-product');
    }
    getByID(id){
        return http2.get(`sub-product/get/${id}`);
    }

    addPost(data){
        return http.post(`sub-product/add`, data);
    }
    updatePost(id,data){
        return http.post(`sub-product/update/${id}`, data);
    }
}