import http from '../http-auth'

export default new class MarketRouters{
    getAll(){
        return http.get(`market-router`);
    }
    getByID(id){
        return http.get(`market-router/get/${id}`);
    }
    getByDate(data){
        return http.post(`market-router/date`, data);
    }

    addPost(data){
        return http.post(`market-router/add`, data);
    }
    updatePost(data, id){
        return http.post(`market-router/update/${id}`, data);
    }
}