import http from '../http-common'

export default new class ProCost{
    getByDate(data){
        return http.post(`market-value/date`, data);
    }
}