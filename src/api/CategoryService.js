import http from './http-auth'

export default new class CategoryService{
    getCategories(){
        return http.get('category');
    }
    getCategoryID(id){
        return http.get(`category/get/${id}`);
    }
    activeCategory(id){
        return http.get(`category/active/${id}`);
    }

    addCategory(data){
        return http.post(`category/add`, data);
    }
    updateCategory(id,data){
        return http.post(`category/update/${id}`, data);
    }
}