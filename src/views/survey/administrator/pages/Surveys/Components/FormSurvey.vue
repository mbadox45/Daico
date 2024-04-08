<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute  } from 'vue-router';
import moment from 'moment';
import Editor from 'primevue/editor';

// API
import QuestionService from '@/api/QuestionService';
import SurveyService from '@/api/SurveyService';
import { settingPertanyaan, BreadcrumbHome, formSurvey } from '@/api/DataVariable';


// Variable
const toast = useToast();
const router = useRouter();
const route = useRoute();

const params = route.params.cond;
const id_survey = route.query.id;

const judul = ref(null);
const deskipsi = ref(null);
const forms = ref(formSurvey);
const forms_chapter = ref([{order_sp:'', pertanyaan:['']}]);
const forms_answare = ref([{order_sp:null}]);
const survey_pertanyaan_ids = ref([]);
const answers = ref(null);
const tot_answare = ref(1);

// Dropdown
const listQuestion = ref([])

const payload = JSON.parse(localStorage.getItem('payload'));
const tokens = localStorage.getItem('usertoken');
const breadcrumbHome = ref(BreadcrumbHome);
const breadcrumbItems = ref([]);

// Detail Menu Peranyaan
const menu = ref(null);
const items = ref(settingPertanyaan);

// Given accsess public funtion
onMounted(() => {
    addForms();
    bcItems();
});

const bcItems = () => {
    if (params == 'add') {
        judul.value = 'Form Add Survey';
        deskipsi.value = 'Silahkan buat survey pertanyaan anda untuk user.';
        breadcrumbItems.value = [
            { label: 'Home', to:'/home' }, { label: 'Management', to:'#' }, { label: 'Survey', to:'/survey' }, { label: 'Add Survey', class:'font-bold', disabled:true}
        ]
    } else {
        judul.value = 'Form Edit Survey';
        deskipsi.value = 'Silahkan buat survey pertanyaan anda untuk user.';
        breadcrumbItems.value = [
            { label: 'Home', to:'/home' }, { label: 'Management', to:'#' }, { label: 'Survey', to:'/survey' }, { label: id_survey, to:`/form-survey/${params}?id=${id_survey}` }, { label: 'Edit Survey', class:'font-bold', disabled:true}
        ]
    }
}

// Function Private
const loadQuestion = () => {
    QuestionService.getQuestions().then(res => {
        const load = res.data;
        if (load.code == 200) {
            const data = load.data;
            // console.log(data)
            const list = [];
            for (let i = 0; i < data.length; i++) {
                // const list2 = [];
                // const options = data[i].options;
                // for (let a = 0; a < options.length; a++) {
                //     list2[a] = options[a].id;
                // }
                list[i] = {
                    order_sp:data[i].category_id,
                    name:data[i].question,
                    value:data[i].id,
                    question_order:data[i].id,
                }
            }
            // console.log(list)
            listQuestion.value = list;
        } else {
            listQuestion.value = [];
        }
    })
    .catch(error => {
        listQuestion.value = [];
        // console.error(error.response.status);
    })
}

const addForms = () => {
    if (params == 'edit') {
        SurveyService.getSurveyID(id_survey).then(res => {
            setTimeout(loadQuestion, 1000);
            const load = res.data;
            if (load.code == 200) {
                const data = load.survey;
                // console.log(data);
                forms.value.id = data.id;
                forms.value.title = data.title;
                forms.value.desc = data.desc;
                forms.value.from = data.from;
                forms.value.to = data.to;
                const ans = data.survey_pertanyaans; 
                const list = [];
                const list2 = [];
                for (let i = 0; i < ans.length; i++) {
                    const question = ans[i].questions;
                    // list[i].order_sp = ans[i].value
                    list2[i] = ans[i].id;
                    const pertanyaan = [];
                    for (let a = 0; a < question.length; a++) {
                        // pertanyaan[a]= {
                        //     question_order:question[a].id,
                        // };
                        pertanyaan[a]= question[a].id;
                    }
                    list[i] = {
                        order_sp: ans[i].value,
                        pertanyaan: pertanyaan,
                    }
                }
                forms_chapter.value = list;
                survey_pertanyaan_ids.value = list2;
                console.log(ans);
            } else {
                forms.value = {}
            }
        }).catch(error => {
            console.error(error.response.status);
        })
    } else {
        resetForm();
        loadQuestion();
    }
}

const addsForm = () => {
    forms_chapter.value.push({
        order_sp:'',
        pertanyaan:[''],
    });
    // const fa = forms_answare.value;
    // const lq = listQuestion.value;
};

const addsFormPertanyaaan = (index) => {
    forms_chapter.value[index].pertanyaan.push('');
};

const removeForm = (index) => {
    forms_chapter.value.splice(index, 1); // Remove the form at the specified index
};

const removeSubEmail = (mainIndex, subIndex) => {
    forms_chapter.value[mainIndex].pertanyaan.splice(subIndex, 1);
};

const resetForm = () => {
    forms.value.title = '';
    forms.value.desc = '';
    forms.value.from = '';
    forms.value.to = '';
    forms_answare.value = [ {order_sp:null}];
}

const backToQuestion = () => {
    router.push({path:'/survey'})
}

const compareAndPush = (data) => {
    const load = [];

    for (let i = 0; i < data.length; i++) {
        if (!load.includes(data[i])) {
            load.push(data[i]);
        }
    }

    return load;
};

const postDialog = async () => {
    if (params == 'add') {
        const fa = forms_chapter.value;
        // console.log(fa);
        if (forms.value.title != '' && forms.value.desc != '' && forms.value.from != '' && forms.value.to != '' && fa[0].order_sp != '') {
            const order_sp = [];
            const value = [];
            let question_order = '';
            for (let i = 0; i < fa.length; i++) {
                order_sp[i] = i+1;
                value[i] = fa[i].order_sp;
                const fap = fa[i].pertanyaan 
                question_order += (i+1) + '|';
                for (let a = 0; a < fap.length; a++) {
                    if (a >= (fap.length - 1) && i >= (fa.length - 1)) {
                        question_order += fap[a];
                    } else if (a >= (fap.length - 1) && i < (fa.length - 1)) {
                        question_order += fap[a] + ';';
                    } else {
                        question_order += fap[a] + ',';
                    }
                }
            }
            forms.value.order_sp = order_sp;
            forms.value.value = value;
            forms.value.question_order = question_order;
            forms.value.from = moment(forms.value.from).format('YYYY-MM-DD');
            forms.value.to = moment(forms.value.to).format('YYYY-MM-DD');
            SurveyService.addSurvey(forms.value).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    resetForm();
                    toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                    setTimeout(backToQuestion, 3000);
                } else {
                    toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
                }
            }).catch(error => {
                console.error(error.response.status);
                toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
            })
        } else {
            toast.add({ severity: 'warn', summary: 'Caution', detail: `Harap diisi dengan lengkap`, life: 3000 });
        }
    } else {
        const fa = forms_chapter.value;
        if (forms.value.title != '' && forms.value.desc != '' && forms.value.from != '' && forms.value.to != '' && fa[0].order_sp != '') {
            console.log(fa);
            const order_sp = [];
            const value = [];
            const question_order = [];
            // const survey_pertanyaan_id = [];
            for (let i = 0; i < fa.length; i++) {
                order_sp[i] = i+1;
                value[i] = fa[i].order_sp;
                const fap = fa[i].pertanyaan 
                let qo = (i+1) + '|';
                for (let a = 0; a < fap.length; a++) {
                    if (a >= (fap.length - 1)) {
                        qo += fap[a];
                    }  else {
                        qo += fap[a] + ',';
                    }
                }
                question_order[i] = qo;
            }
            console.log({order_sp:order_sp,value:value,question_order:question_order});
            forms.value.from = moment(forms.value.from).format('YYYY-MM-DD');
            forms.value.to = moment(forms.value.to).format('YYYY-MM-DD');
            forms.value.order_sp = order_sp;
            forms.value.value = value;
            forms.value.question_order = question_order;
            forms.value.survey_pertanyaan_id = survey_pertanyaan_ids;
            try {
                const response = SurveyService.updateSurvey(forms.value.id, forms.value);
                console.log(response);
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                setTimeout(backToQuestion, 3000);
            } catch (error) {
                toast.add({ severity: 'danger', summary: 'Attention', detail: `Unable to post data`, life: 3000 });
            }
        } else {
            toast.add({ severity: 'warn', summary: 'Caution', detail: `Harap diisi dengan lengkap`, life: 3000 });
        }
        // console.log(params);
        // console.log(forms.value);
        // console.log(forms_chapter.value);
    }
}

</script>

<template>
    <div class="grid">
        <Toast/>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div>
                    <h5>{{judul}}</h5>
                    <span>{{deskipsi}}</span>
                </div>
                <Panel header="SURVEY" class="my-5">
                    <template #icons>
                        <Button class="p-panel-header-icon p-link text-blue-500 mr-2" icon="pi pi-save" v-tooltip.top="'Simpan'" @click="postDialog"></Button>
                        <Button class="p-panel-header-icon p-link text-grey-500 mr-2" icon="pi pi-refresh" v-tooltip.top="'Bersihkan Form'" @click="resetForm"></Button>
                        <Menu ref="menu" id="config_menu" :model="items" popup />
                    </template>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Judul</label>
                            <InputText id="text" type="text" v-model="forms.title"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Deskripsi</label>
                            <!-- <Editor v-model="forms.desc" editorStyle="height: 120px" placeholder="Deskripsikan untuk keterangan" /> -->
                            <Textarea v-model="forms.desc" autoResize rows="5" cols="30" />
                        </div>
                        <div class="field col-12 md:col-12">
                            <strong>Tanggal Berlaku</strong>
                        </div>
                        <div class="field col-6 md:col-6">
                            <label for="lastname2">Mulai</label>
                            <Calendar inputId="calendar" v-model="forms.from"></Calendar>
                        </div>
                        <div class="field col-6 md:col-6">
                            <label for="lastname2">Sampai</label>
                            <Calendar inputId="calendar" v-model="forms.to"></Calendar>
                        </div>
                        <div class="field col-12 md:col-12">
                            <Divider/>
                        </div>
                        <div class="field col-12 md:col-12" v-for="(form, index) in forms_chapter" :key="index">
                            <!-- <p for="lastname2">Chapter {{ index+1 }}</p> -->
                            <div class="p-inputgroup flex-1">
                                <span class="p-inputgroup-addon bg-gray-300">
                                    <i class="pi pi-bookmark"></i>
                                </span>
                                <InputText id="text" type="text" disabled class="bg-gray-300" :value="`Chapter ${index+1}`"/>
                                <Button icon="pi pi-plus" severity="primary" @click="addsForm" outlined></Button>
                                <Button icon="pi pi-minus" severity="danger" @click="removeForm(index)" :disabled="index == 0 ? true : false" outlined></Button>
                            </div>
                            <Editor v-model="form.order_sp" editorStyle="height: 120px" class="mb-2" placeholder="Silahkan ajukan pertanyaan" />
                            <div class="formgrid grid justify-content-center">
                                <div class="field col-11 md:col-11" v-for="(pertanyaan, subindex) in form.pertanyaan" :key="subindex">
                                    <label for="lastname2">Pertanyaan {{ subindex+1 }}</label>
                                    <div class="p-inputgroup flex-1">
                                        <span class="p-inputgroup-addon">
                                            <i class="pi pi-question-circle"></i>
                                        </span>
                                        <Dropdown v-model="form.pertanyaan[subindex]" :options="listQuestion" optionLabel="name" optionValue="question_order" filter placeholder="Pertanyaan">
                                            <template #option="slotProps">
                                                <div class="max-w-30rem flex text-wrap" style="white-space: pre-wrap;">
                                                    <p v-html="slotProps.option.name"></p>
                                                </div>
                                            </template>
                                        </Dropdown>
                                        <Button icon="pi pi-plus" severity="primary" @click="addsFormPertanyaaan(index)" outlined></Button>
                                        <Button icon="pi pi-minus" severity="danger" @click="removeSubEmail(index, subindex)" :disabled="subindex == 0 ? true : false" outlined></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    </div>
</template>