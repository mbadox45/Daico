import http from '../http-auth'

export default new class DailyDmo{
    
    addPost(data){
        return http.post(`daily-dmo/add`, data);
    }
    updatePost(id,data){
        return http.post(`daily-dmo/update/${id}`, data);
    }
    
    getAll(){
        return http.get('daily-dmo');
    }
    getByID(id){
        return http.get(`daily-dmo/get/${id}`);
    }
    getByDate(date){
        return http.post(`daily-dmo/date`, date);
    }
}