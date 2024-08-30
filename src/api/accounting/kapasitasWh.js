import http from '../http-auth'
import http2 from '../http-common'

export default new class kapasitasWh{
    getAll(){
        return http2.get('kapasitas-wh-pallet');
    }
    getByID(id){
        return http2.get(`kapasitas-wh-pallet/get/${id}`);
    }
    getLatest(){
        return http2.get(`kapasitas-wh-pallet/latest`);
    }
    getByDate(data){
        return http2.get(`kapasitas-wh-pallet/date`, data);
    }
    getByPeriod(data){
        return http2.get(`kapasitas-wh-pallet/period`, data);
    }

    addPost(data){
        return http.post(`kapasitas-wh-pallet/add`, data);
    }
    updatePost(id,data){
        return http.post(`kapasitas-wh-pallet/update/${id}`, data);
    }
}