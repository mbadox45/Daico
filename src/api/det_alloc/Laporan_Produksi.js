import http from '../http-auth'

export default new class Laporan_Produksi{
    
    addPost(data){
        return http.post(`laporan-produksi/add`, data);
    }
    updatePost(id,data){
        return http.post(`laporan-produksi/update/${id}`, data);
    }
    
    getAll(){
        return http.get('laporan-produksi');
    }
    getByID(id){
        return http.get(`laporan-produksi/get/${id}`);
    }
    getByDate(date){
        return http.post(`laporan-produksi/date`, date);
    }
}