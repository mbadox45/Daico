import http from '../http-auth'

export default new class TargetReal{
    
    addPost(data){
        return http.post(`target-real/add`, data);
    }
    updatePost(id,data){
        return http.post(`target-real/update/${id}`, data);
    }
    
    getAll(){
        return http.get('target-real');
    }
    getByID(id){
        return http.get(`target-real/get/${id}`);
    }
    getByDate(date){
        return http.post(`target-real/date`, date);
    }
}