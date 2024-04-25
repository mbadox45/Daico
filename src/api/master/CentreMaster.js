import http from '../http-auth'

export default new class CentreMaster{
    getAll(){
        return http.get('cCenter');
    }
    getByID(id){
        return http.get(`cCenter/get/${id}`);
    }

    addCentre(data){
        return http.post(`cCenter/add`, data);
    }
    updateCentre(id,data){
        return http.post(`cCenter/update/${id}`, data);
    }
}