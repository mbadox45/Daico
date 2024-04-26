import http from '../http-auth'

export default new class DebeConfig{
    getAll(){
        return http.get('debe');
    }
    getByID(id){
        return http.get(`debe/get/${id}`);
    }

    addDebe(data){
        return http.post(`debe/add`, data);
    }
    updateDebe(id,data){
        return http.post(`debe/update/${id}`, data);
    }
}