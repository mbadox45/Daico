import http from '../http-auth'

export default new class ReportMaster{
    getAll(){
        return http.get('mReport');
    }
    getByID(id){
        return http.get(`mReport/get/${id}`);
    }

    addPost(data){
        return http.post(`mReport/add`, data);
    }
    updatePost(id,data){
        return http.post(`mReport/update/${id}`, data);
    }
}