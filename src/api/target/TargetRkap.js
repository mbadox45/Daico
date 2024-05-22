import http from '../http-auth'

export default new class TargetRkap{
    
    addPost(data){
        return http.post(`target-rkap/add`, data);
    }
    updatePost(id,data){
        return http.post(`target-rkap/update/${id}`, data);
    }
    
    getAll(){
        return http.get('target-rkap');
    }
    getByID(id){
        return http.get(`target-rkap/get/${id}`);
    }
    getByDate(date){
        return http.post(`target-rkap/date`, date);
    }
}