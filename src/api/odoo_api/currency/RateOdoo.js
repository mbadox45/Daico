import http from '../http-auth'

export default new class RateOdoo{
    getAll(){
        return http.get('currency_rate/index');
    }
    getByID(id){
        return http.get(`currency_rate/get/${id}`);
    }
    postRate(data){
        return http.post(`currency_rate/period`,data);
    }
}