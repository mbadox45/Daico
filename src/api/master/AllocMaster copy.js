import http from '../http-auth'

export default new class AllocMaster{
    getAll(){
        return http.get('allocation');
    }
    getByID(id){
        return http.get(`allocation/get/${id}`);
    }

    addAlloc(data){
        return http.post(`allocation/add`, data);
    }
    updateAlloc(id,data){
        return http.post(`allocation/update/${id}`, data);
    }
}