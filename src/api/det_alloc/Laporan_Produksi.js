import http from '../http-auth'
import http2 from '../http-common'

export default new class Laporan_Produksi{
    
    addPost(data){
        return http.post(`laporan-produksi/add`, data);
    }
    updatePost(id,data){
        return http.post(`laporan-produksi/update/${id}`, data);
    }
    
    getByDateRekap(date){
        return http2.post('laporan-produksi/recap', date);
    }
    getByID(id){
        return http2.get(`laporan-produksi/get/${id}`);
    }
    getByDate(date){
        return http2.post(`laporan-produksi/date`, date);
    }
}