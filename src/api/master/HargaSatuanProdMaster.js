import http from '../http-auth'

export default new class HargaSatuanProdMaster{
    getAll(){
        return http.get('harga-satuan');
    }
    getByID(id){
        return http.get(`harga-satuan/get/${id}`);
    }
    getLatest(data){
        return http.get('harga-satuan/latest',data);
    }

    addPost(data){
        return http.post(`harga-satuan/add`, data);
    }
}