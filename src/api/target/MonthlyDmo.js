import http from '../http-auth'

export default new class MonthlyDmo{
    
    addPost(data){
        return http.post(`monthly-dmo/add`, data);
    }
    updatePost(id,data){
        return http.post(`monthly-dmo/update/${id}`, data);
    }
    
    getAll(){
        return http.get('monthly-dmo');
    }
    getByID(id){
        return http.get(`monthly-dmo/get/${id}`);
    }
    getByDate(date){
        return http.post(`monthly-dmo/date`, date);
    }
}