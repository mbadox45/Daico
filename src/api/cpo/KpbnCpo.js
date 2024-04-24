import http from '../http-auth'

export default new class KpbnCpo{
    getAll(){
        return http.get('cpo-kpbn');
    }
    getByID(id){
        return http.get(`cpo-kpbn/get/${id}`);
    }
    getByDate(date){
        return http.post(`cpo-kpbn/date`,date);
    }

    addKpbn(data){
        return http.post(`cpo-kpbn/add`, data);
    }
    updateKpbn(id,data){
        return http.post(`cpo-kpbn/update/${id}`, data);
    }
}