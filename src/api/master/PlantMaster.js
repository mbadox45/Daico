import http from '../http-auth'

export default new class PlantMaster{
    getAll(){
        return http.get('plant');
    }
    getByID(id){
        return http.get(`plant/get/${id}`);
    }

    addPlant(data){
        return http.post(`plant/add`, data);
    }
    updatePlant(id,data){
        return http.post(`plant/update/${id}`, data);
    }
}