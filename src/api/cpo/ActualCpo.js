import http from '../http-auth'

export default new class ActualCpo{
    getAll(){
        return http.get('actual-cpo');
    }
    getByID(id){
        return http.get(`actual-cpo/get/${id}`);
    }
    getByDate(date){
        return http.post(`actual-cpo/date`,date);
    }

    addActual(data){
        return http.post(`actual-cpo/add`, data);
    }
    updateActual(id,data){
        return http.post(`actual-cpo/update/${id}`, data);
    }
}