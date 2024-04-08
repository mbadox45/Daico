<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute  } from 'vue-router';

// API
import SurveyService from '@/api/SurveyService';
import { FormPreview } from '@/api/DataVariable';

const router = useRouter();
const route = useRoute();
const judul = ref(null);
const deskipsi = ref(null);
const survey_pertanyaan = ref([]);
const datachart = ref();
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
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Management', to:'#' },  { label: 'Survey', to:'/survey'},  { label: params, to:`/response-survey/${params}`}, { label: 'Response Survey', class:'font-bold', disabled:true  }]);

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
    loadSurvey()
    // datachart.value = setChartData()
});

const bcItems = () => {
    judul.value = 'Form Add Survey';
    deskipsi.value = 'Silahkan buat survey pertanyaan anda untuk user.';
    breadcrumbItems.value = [
        { label: 'Home', to:'/home' }, { label: 'Management', to:'#' },  { label: 'Survey', to:'/survey'},  { label: params, to:`/response-survey/${params}`}, { label: 'Response Survey', class:'font-bold', disabled:true  }
    ]
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
    try {
        const response = await SurveyService.getAnswerSurveyByID(params)
        const load = response.data
        console.log(load);
        const survey = load.survey;
        
        judul.value = survey.title.toUpperCase();
        deskipsi.value = survey.desc;
        
        // survey_pertanyaan.value = sp;
        // mengambil data sp untuk ditampilkan di chartjs
        const sp = load.survey_pertanyaans;
        const list_sp = [];
        for (let i = 0; i < sp.length; i++) {
            const element_sp = sp[i];
            const list_question = [];
            const element_sp_question = element_sp.questions;
            for (let b = 0; b < element_sp_question.length; b++) {
                const element_question = element_sp_question[b];
                const element_persentasi = element_sp_question[b].persentasi;
                if (element_persentasi !== null) {
                    const label = [];
                    const setdata = [];
                    const bg_color = [];
                    const bgh_color = [];
                    for (let a = 0; a < element_persentasi.length; a++) {
                        const persentasi = element_persentasi[a];
                        label[a] = persentasi.optionText;
                        setdata[a] = persentasi.percentage;
                        bg_color[a] = colorcode.value[a];
                        bgh_color[a] = colorcodehover.value[a];
                    }
                    if (element_question.questionType === 'range') {
                        // console.log(label, setdata)
                        list_question[b] = {
                            answers : element_question.answers,
                            averageQuestionValue : element_question.averageQuestionValue,
                            persentasi: setChartData(label, setdata, bg_color, bgh_color),
                            questionId: element_question.questionId,
                            questionType: element_question.questionType,
                            questionValue: element_question.questionValue
                        }
                    } else {
                        list_question[b] = {
                            answers : element_question.answers,
                            persentasi: setChartData(label, setdata, bg_color, bgh_color),
                            questionId: element_question.questionId,
                            questionType: element_question.questionType,
                            questionValue: element_question.questionValue
                        }
                    }
                } else {
                    list_question[b] = {
                        answers : element_question.answers,
                        persentasi: null,
                        questionId: element_question.questionId,
                        questionType: element_question.questionType,
                        questionValue: element_question.questionValue
                    }
                    
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
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <download-excel :data="survey_pertanyaan" class="py-3 px-2 cursor-pointer font-semibold text-sm text-green-700 hover:text-green-500 " :worksheet = "judul" :name="`${judul}.xls`"><i class="pi pi-download"></i> Download Data</download-excel>
                        <!-- <Button :icon="'pi pi-download'" class="mb-2" :severity="'success'" label="Export Data" outlined size="small"></Button> -->
                    </div>
                </div>
                <Divider type="dotted"/>
                <div class="grid">
                    <div class="col-12 md:col-12 sm:col-12">
                        <div v-for="list in survey_pertanyaan" :key="list.id">
                            <div class="text-pink-700 px-3 py-2 bg-pink-100 border-round-md" v-html="list.value"></div>
                            <!-- <Divider type="solid"></Divider> -->
                            <div v-for="questions in list.questions" :key="questions.questionId" class="ml-5 md:ml-5 sm:ml-3 my-3">
                                <div class="grid">
                                    <div class="col-9 md:col-9 sm:col-9">
                                        <strong class="font-semibold" v-html="questions.questionValue"></strong>
                                    </div>
                                    <div class="col-3 md:col-3 sm:col-3 text-right">
                                        <div class="flex justify-content-end">
                                            <img :alt="questions.questionType" :src="questions.questionType == 'checkbox' ? '/layout/icon/checkbox.png' : questions.questionType == 'number' ? '/layout/icon/number.png' : questions.questionType == 'radio' ? '/layout/icon/radio.png' : questions.questionType == 'dropdown' ? '/layout/icon/dropdown.png' : questions.questionType == 'file' ? '/layout/icon/file.png' : questions.questionType == 'range' ? '/layout/icon/range.png' : '/layout/icon/textinput.png'" :class="`mr-2`" style="width: 18px" /><small class="text-indigo-600">{{ questions.questionType.charAt(0).toUpperCase() + questions.questionType.slice(1) }}</small>
                                        </div>
                                    </div>
                                </div>
                                <ul>
                                    <li v-for="answare in questions.answers" :key="answare.optionId">{{ answare.description }} <strong> <i class="pi pi-angle-double-right mx-3"></i>{{ answare.user_name }}</strong></li>
                                </ul>
                                <div v-show="questions.persentasi !== null">
                                    <Divider align="center" type="dashed">
                                        <b>Grafik</b>
                                    </Divider>
                                    <div class="block sm:flex justify-content-center align-items-center">
                                        <h4 class="text-center font-normal text-xl md:text-xl sm:text-sm">Persentage (%)</h4>
                                        <Chart type="pie" :data="questions.persentasi" :options="labelchart" class="w-40rem md:w-20rem" />
                                    </div>
                                </div>
                            </div>
                            <Divider type="solid"></Divider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>