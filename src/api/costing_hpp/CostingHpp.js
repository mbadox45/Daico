import http from '../http-common'

export default new class CostingHpp{
    getByDate(date){
        return http.post(`costing-hpp/date`,date);
    }
}