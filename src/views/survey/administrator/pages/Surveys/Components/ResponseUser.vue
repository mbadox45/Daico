<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute  } from 'vue-router';

// API
import SurveyService from '@/api/SurveyService';
import UserService from '@/api/UserService';
import { FormPreview } from '@/api/DataVariable';

const route = useRoute();
const judul = ref(route.query.title);
const deskipsi = ref(route.query.desc);
const survey_pertanyaan = ref([]);
const list_user = ref([]);
const datachart = ref();
const selectUser = ref();
const colorcode = ref(['#C0392B','#8E44AD', '#2980B9', '#16A085', '#27AE60', '#F39C12', '#D35400']);
const colorcodehover = ref(['#EC7063', '#AF7AC5', '#5DADE2', '#48C9B0', '#58D68D', '#F4D03F', '#EB984E']);
const labelchart = ref({
    plugins: {
        legend: {
            labels: {
                usePointStyle: true
            }
        }
    }
});

const params = route.params.id;

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Management', to:'#' },  { label: 'Survey', to:'/survey'},  { label: params, to:`/response-survey/${params}`}, { label: 'Response Survey by User', class:'font-bold', disabled:true  }]);

const chartOptions = ref({
    plugins: {
        legend: {
            labels: {
                usePointStyle: true
            }
        }
    }
});


onMounted(() => {
    // loadSurvey()
    loadUser()
    // datachart.value = setChartData()
});

const bcItems = () => {
    judul.value = 'Form Add Survey';
    deskipsi.value = 'Silahkan buat survey pertanyaan anda untuk user.';
    breadcrumbItems.value = [
        { label: 'Home', to:'/home' }, { label: 'Management', to:'#' },  { label: 'Survey', to:'/survey'},  { label: params, to:`/response-survey/${params}`}, { label: 'Response Survey', class:'font-bold', disabled:true  }
    ]
}

const loadUser = async () => {
    try {
        const response = await UserService.getUsers()
        const load = response.data;
        const data = load.data;
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list[i] = {
                name: data[i].name,
                id: data[i].id
            }
        }
        list_user.value = list;
        // console.log(data)
    } catch (error) {
        list_user.value = [];
        // console.log(error.response.data)
    }
}

const setChartData = (label, data, bg, bgh) => {
    return {
        labels: label,
        datasets: [
            {
                data: data,
                backgroundColor: bg,
                hoverBackgroundColor: bgh
            }
        ]
    };
}

const loadSurvey = async () => {
    // console.log(selectUser.value);
    try {
        const response = await SurveyService.getAnswerSurveyByUserAndID(params, {user_id:selectUser.value.id})
        const load = response.data

        // survey_pertanyaan.value = sp;
        // mengambil data sp untuk ditampilkan di chartjs
        const sp = load.survey_pertanyaans;
        console.log(sp);
        const list_sp = [];
        for (let i = 0; i < sp.length; i++) {
            const element_sp = sp[i];
            const list_question = [];
            const element_sp_question = element_sp.questions;
            for (let b = 0; b < element_sp_question.length; b++) {
                const element_question = element_sp_question[b];
                list_question[b] = {
                    answers : element_question.answers,
                    // persentasi: null,
                    questionId: element_question.questionId,
                    questionType: element_question.questionType,
                    questionValue: element_question.questionValue
                }
            }
            list_sp[i] = {
                id : element_sp.id,
                value : element_sp.value,
                questions: list_question,
            }
        }
        console.log(list_sp);
        survey_pertanyaan.value = list_sp;
    } catch (error) {
        survey_pertanyaan.value = [];
        console.log(error.response.data)
    }
}

</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-6 md:col-6 sm:col-6">
                        <strong class="text-blue-800 text-2xl font-semibold">{{judul}}</strong><br/>
                        <small>{{ deskipsi }}</small>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6">
                        <Dropdown v-model="selectUser" :options="list_user" filter optionLabel="name" placeholder="Select a Company" class="w-full" @change="loadSurvey()"></Dropdown>
                    </div>
                </div>
                <Divider type="dotted"/>
                <div class="grid" v-if="selectUser !=null">
                    <div class="col-12 md:col-12 sm:col-12" v-if="survey_pertanyaan.length > 0">
                        <div v-for="list in survey_pertanyaan" :key="list.id">
                            <div class="text-pink-700 px-3 py-2 bg-pink-100 border-round-md" v-html="list.value"></div>
                            <div v-for="questions in list.questions" :key="questions.questionId" class="ml-5 md:ml-5 sm:ml-3 mt-2 mb-5">
                                <strong class="font-semibold" v-html="questions.questionValue"></strong>
                                <span>Answer:</span>
                                <ul>
                                    <li v-for="answare in questions.answers" :key="answare.optionId">{{ answare.description }}</li>
                                </ul>
                            </div>
                            <Divider type="solid"></Divider>
                        </div>
                    </div>
                    <div class="col-12 md:col-12 sm:col-12" v-else>
                        <h3 class="font-normal text-center"> {{ selectUser.name }} - Belum Mengisi Survey !</h3>
                    </div>
                </div>
                <div v-else>
                    <h3 class="font-normal  text-center">Silahkan Pilih User !</h3>
                </div>
            </div>
        </div>
    </div>
</template>