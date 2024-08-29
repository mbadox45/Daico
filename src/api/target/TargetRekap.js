import http from '../http-common'

export default new class TargetRekap{
    
    getByDate(date){
        return http.post(`target-recap/date`, date);
    }
}