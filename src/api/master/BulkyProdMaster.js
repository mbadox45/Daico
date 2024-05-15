import http from '../http-auth'

export default new class BulkyProdMaster{
    getAll(){
        return http.get('bulky-prod');
    }
    getByID(id){
        return http.get(`bulky-prod/get/${id}`);
    }

    addBulky(data){
        return http.post(`bulky-prod/add`, data);
    }
    updateBulky(id,data){
        return http.post(`bulky-prod/update/${id}`, data);
    }
}