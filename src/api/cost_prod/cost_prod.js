import http from '../http-common'

export default new class CostProd{
    
    getAll(data){
        return http.post(`cost-prod/get`, data);
    }

    getBebanProd(data){
        return http.post(`beban-prod/get`, data);
    }
}