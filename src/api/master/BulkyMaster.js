import http from '../http-auth'

export default new class BulkyMaster{
    getAll(){
        return http.get('bulky');
    }
    getByID(id){
        return http.get(`bulky/get/${id}`);
    }

    addBulky(data){
        return http.post(`bulky/add`, data);
    }
    updateBulky(id,data){
        return http.post(`bulky/update/${id}`, data);
    }
}