import http from '../http-auth'
import http2 from '../http-common'

export default new class ProductMaster{
    getAll(){
        return http2.get('product');
    }
    getByID(id){
        return http2.get(`product/get/${id}`);
    }

    addPost(data){
        return http.post(`product/add`, data);
    }
    updatePost(id,data){
        return http.post(`product/update/${id}`, data);
    }
}