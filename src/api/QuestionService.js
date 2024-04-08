import http from './http-auth'

export default new class QuestionService{
    getQuestions(){
        return http.get('question');
    }
    getQuestionsID(id){
        return http.get(`question/get/${id}`);
    }
    activeQuestion(id){
        return http.get(`question/active/${id}`);
    }

    addQuestion(data){
        return http.post(`question/add`, data);
    }
    updateQuestion(id,data){
        return http.post(`question/update/${id}`, data);
    }
}