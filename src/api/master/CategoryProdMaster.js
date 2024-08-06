import http from '../http-auth'

export default new class CategoryProdMaster{
    
    addPost(data){
        return http.post(`kategori-produksi/add`, data);
    }
    updatePost(id,data){
        return http.post(`kategori-produksi/update/${id}`, data);
    }

    // Category
    getAll(){
        return http.get('kategori-produksi');
    }
    getByID(id){
        return http.get(`kategori-produksi/get/${id}`);
    }
}