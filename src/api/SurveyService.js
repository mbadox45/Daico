import http from './http-auth'

export default new class SurveyService{
    getSurvey(){
        return http.get('survey');
    }
    getSurveyID(id){
        return http.get(`survey/get/${id}`);
    }
    activeSurvey(id){
        return http.get(`survey/active/${id}`);
    }

    addSurvey(data){
        return http.post(`survey/add`, data);
    }
    updateSurvey(id,data){
        return http.post(`survey/update/${id}`, data);
    }

    // Response Surve
    getAnswerSurveyByID(id){
        return http.get(`answer/all/${id}`);
    }
    getAnswerSurveyByUserAndID(id,data){
        return http.post(`answer/individual/${id}`,data);
    }

    // Distributor/User
    getSurveyAvailable(){
        return http.get('survey/avaliable');
    }
    getSurveyAnswered(){
        return http.get('survey/answered');
    }
    postAnswerSurvey(id,data){
        return http.post(`answer/add/${id}`, data);
    }
}