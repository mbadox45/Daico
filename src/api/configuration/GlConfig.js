import http from '../http-auth'

export default new class GlConfig{
    getByDate(data){
        return http.post(`general-ledger/date`, data);
    }
}