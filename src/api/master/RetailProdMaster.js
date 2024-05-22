import http from '../http-auth'

export default new class RetailProdMaster{
    getAll(){
        return http.get('retail-prod');
    }
    getByID(id){
        return http.get(`retail-prod/get/${id}`);
    }

    addPost(data){
        return http.post(`retail-prod/add`, data);
    }
    updatePost(id,data){
        return http.post(`retail-prod/update/${id}`, data);
    }
}