import http from '../http-auth'
import http2 from '../http-common'

export default new class LocationMaster{
    getAll(){
        return http2.get('location');
    }
    getByID(id){
        return http2.get(`location/get/${id}`);
    }

    addPost(data){
        return http.post(`location/add`, data);
    }
    updatePost(id,data){
        return http.post(`location/update/${id}`, data);
    }
}