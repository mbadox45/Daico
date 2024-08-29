import http from '../http-common'

export default new class DashService{
    getByDate(date){
        return http.post(`dashboard/date`,date);
    }
}