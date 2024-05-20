import http from '../http-auth'

export default new class LevyDuty{
    getAll(){
        return http.get(`levy-duty`);
    }
    getByID(id){
        return http.get(`levy-duty/get/${id}`);
    }
    getByDate(data){
        return http.post(`levy-duty/date`, data);
    }

    addPost(data){
        return http.post(`levy-duty/add`, data);
    }
    updatePost(data, id){
        return http.post(`levy-duty/update/${id}`, data);
    }
}