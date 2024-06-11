import http from '../http-auth'
import http2 from '../http-common'

export default new class SettingMaster{
    getAll(){
        return http2.get('settings');
    }
    getByID(id){
        return http2.get(`settings/get/${id}`);
    }
    getByName(name){
        return http2.get(`settings/name/${name}`);
    }

    addPost(data){
        return http.post(`settings/add`, data);
    }
    updatePost(id,data){
        return http.post(`settings/update/${id}`, data);
    }
}