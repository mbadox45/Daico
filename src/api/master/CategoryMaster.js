import http from '../http-auth'
import http2 from '../http-common'

export default new class CategoryMaster{
    
    addPost(data){
        return http.post(`category/add`, data);
    }
    updatePost(id,data){
        return http.post(`category/update/${id}`, data);
    }

    // Category 1
    getAll(){
        return http2.get('category1');
    }
    getByID(id){
        return http2.get(`category1/get/${id}`);
    }
}