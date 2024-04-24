import http from '../http-auth'

export default new class OutstandingCpo{
    getAll(){
        return http.get('outstanding-cpo');
    }
    getByID(id){
        return http.get(`outstanding-cpo/get/${id}`);
    }

    addOutstanding(data){
        return http.post(`outstanding-cpo/add`, data);
    }
    updateOutstanding(id,data){
        return http.post(`outstanding-cpo/update/${id}`, data);
    }
}