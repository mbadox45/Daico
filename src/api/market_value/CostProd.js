import http from '../http-common'

export default new class CostProd{
    getByDate(data){
        return http.post(`cost-prod/get`, data);
    }
}