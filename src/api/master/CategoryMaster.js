import http from '../http-auth'

export default new class CategoryMaster{
    
    addCategory(data){
        return http.post(`category/add`, data);
    }
    updateCategory(id,data){
        return http.post(`category/update/${id}`, data);
    }

    // Category 1
    getAll(){
        return http.get('category1');
    }
    getByID(id){
        return http.get(`category1/get/${id}`);
    }
}