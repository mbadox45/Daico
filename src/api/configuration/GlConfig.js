import http from '../http-common'

export default new class GlConfig{
    getByDate(data){
        return http.post(`general-ledger/date`, data);
    }
}