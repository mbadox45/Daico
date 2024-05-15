import http from '../http-auth'

export default new class CurrencyOdoo{
    getAll(){
        return http.get('currency/index');
    }
    getByID(id){
        return http.get(`currency/get/${id}`);
    }
    getExIdr(){
        return http.get(`currency/ex-idr`);
    }
}