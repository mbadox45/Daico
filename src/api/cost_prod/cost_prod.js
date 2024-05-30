import http from '../http-auth'

export default new class CostProd{
    
    getAll(data){
        return http.post(`cost-prod/get`, data);
    }
}