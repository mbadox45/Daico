<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute  } from 'vue-router';
// import { useToast } from 'primevue/usetoast';

// API
import SurveyService from '@/api/SurveyService';
import { FormPreview } from '@/api/DataVariable';

// const toast = useToast();
const router = useRouter();
const route = useRoute();
const time = ref(3000)

const surveys = ref({from: '', to:'', title:'', desc:'', id:0});
const pertanyaan = ref([]);
const answare = ref([{id_pertanyaan:null, type:'',value:null}]);
const selectedCategories = ref()
const payload = JSON.parse(localStorage.getItem('payload'));
const roles = localStorage.getItem('roles');

// Kondisi form sudah di submit(true) jika belum (false)
const finished = ref('-');

const listPertanyaan = ref(FormPreview)

const params = route.params.id;
const judul = route.query.title;
const deskipsi = route.query.desc;

onMounted(() => {
    loadSurvey()
});

const loadSurvey = () => {
    SurveyService.getSurveyID(params).then(res => {
        const load = res.data;
        if (load.code == 200) {
            const data = load.survey;
            surveys.value = {
                from: data.from,
                to: data.to,
                desc: data.desc,
                title: data.title,
                id: data.id,
            }
            const sp = data.survey_pertanyaans
            for (let i = 0; i < sp.length; i++) {
                const question = sp[i].questions;
                const questions = [];

                question.sort((a, b) => a.id - b.id);
                // Proses penambahan v-model yaitu "model" sebagai media input komponen form
                for (let a = 0; a < question.length; a++) {
                    let model;
                    if (question[a].type == 'checkbox') {
                        model = [];
                    } else if (question[a].type == 'number') {
                        model = 0;
                    } else {
                        model = '';
                    }
                    const options = question[a].options
                    options.sort((a, b) => a.id - b.id);
                    questions[a] = {
                        category_id: question[a].category_id,
                        question: question[a].question,
                        require: question[a].require,
                        status: question[a].status,
                        type: question[a].type,
                        id: question[a].id,
                        options: options,
                        pivot: question[a].pivot,
                        model: model,
                        model_extra: '',
                    }
                }
                pertanyaan.value[i] = {
                    id: sp[i].id,
                    value: sp[i].value,
                    question: questions,
                }
            }
            console.log(pertanyaan.value);
            console.log(sp);
        } else {
            surveys.value = {from: '', to:'', title:'', desc:'', id:0}
        }
    })
}

const submitForm = async () => {
    console.log(pertanyaan.value);
    const pertanyaans = pertanyaan.value;
    let answare = '{"answer": {';
    for (let i = 0; i < pertanyaans.length; i++) {
        answare += `"sp-${pertanyaans[i].id}":{`;
        const question = pertanyaans[i].question;
        answare += '"jawaban":"'
        let jawaban = '';
        for (let a = 0; a < question.length; a++) {
            // Jawaban string
            jawaban += question[a].id+'|';
            if (question[a].type == 'checkbox') {
                const model = question[a].model;
                for (let b = 0; b < model.length; b++) {
                    jawaban += model[b]
                    if (b < (model.length-1)) {
                        jawaban +='~';
                    }
                }
            } else {
                jawaban += question[a].model
            }
            if (a < (question.length - 1)) {
                jawaban += ';';
            } else {
                jawaban += '",';
            }
        }
        // Extra string
        jawaban += '"extra":';
        let ext = '';
        let firstIndexWithData = true;
        for (let a = 0; a < question.length; a++) {
            const options = question[a].options;
            const model = question[a].model;
            for (let b = 0; b < options.length; b++) {
                if (options[b].extra_answer != "0" && model == options[b].id) {
                    if (!firstIndexWithData) {
                        ext += ', '; // Add a comma if it's not the first index with data
                    } else {
                        ext += '{'; // Add "{" for the first index with data
                        firstIndexWithData = false; // Set the flag to false after adding "{"
                    }
                    ext += `"ext-${options[b].id}":"${options[b].model_extra}"`
                }
            }
        }
        if (!firstIndexWithData) {
            ext += '}'; // Add "}" if there was data in the options
        }

        if (ext == '') {
            ext += 'null'
        }
        jawaban += ext
        answare += jawaban;
        if (i >= (pertanyaans.length - 1)) {
            answare += '}';
        } else {
            answare += '},';
        }
    }
    answare +='}}';
    const postAnswer = JSON.parse(answare)
    // console.log(answare);

    // toast.add({ severity: 'success', summary: 'Successfully', detail: `Filling in the survey data has been completed`, life: 3000 });
    SurveyService.postAnswerSurvey(params, postAnswer).then(res => {
        const load = res.data;
        console.log(load)
        finished.value = 'sukses';
    }).catch(error => {
        console.log(error.response.data)
        const code = error.response.data.code;
        if (code == 400) {
            finished.value = 'sudah';
        } else {
            finished.value = 'error';
        }
    });
}

const link = () => {
    router.back();
}

</script>

<template>
    <div class="flex justify-content-center min-h-screen overflow-hidden pb-6 bg-contain" style="background-image: url('/layout/bg4.jpg');">
        <!-- <Toast position="bottom-center"/> -->
        <div class="grid w-full justify-content-center">
            <div class="col-12 md:col-8 sm:col-8 bg-white mt-6 border-round-md" v-show="finished == '-'">
                <div class="flex justify-content-between py-6 px-4 bg-no-repeat bg-cover border-round-md shadow-2" style="background-image: url('/layout/bg2.jpg');">
                    <div class="">
                        <div class="font-bold text-3xl md:text-3xl sm:text-xl mb-1 p-1 bg-cyan-50 border-round-md">{{surveys.title.toLocaleUpperCase()}}</div>
                        <div class="text-gray-500 font-semibold text-md">{{surveys.desc}}</div>
                    </div>
                    <div class="">
                        <img src="/layout/inl.png" alt="PT. Industri Nabati Lestari" class="mr-3 w-5rem">
                        <img src="/layout/n3.png" alt="PT. Perkebunan Nusantara" class="w-5rem">
                    </div>
                </div>
                <!-- <div class="">
                    <h6 class="text-md"><i class="pi pi-user font-semibold mr-2"></i>{{ payload.name }}</h6>
                    <span><i class="pi pi-envelope font-semibold mr-2"></i>{{ payload.email }}</span>
                </div> -->
                <Divider/>
                <div class="card shadow-3" v-for="list in pertanyaan" :key="list.id">
                    <div class="bg-orange-100 border-round-md pt-2 px-2">
                        <span class="text-cyan-800" v-html="list.value"></span>
                        <Divider/>
                    </div>
                    <div v-for="question in list.question" :key="question.id" class="my-4">
                        <div class="grid align-items-center">
                            <div class="">
                                <pre class="font-medium md:text-lg sm:text-xs" style="font-family: Arial, Helvetica, sans-serif; white-space: pre-wrap;" v-html="`${question.question}`"></pre>
                            </div>
                            <div class="">
                                <span class="text-red-600 font-bold text-sm mx-2" v-show="question.require==true">(*)</span>
                            </div>
                        </div>
                        <div v-show="question.type == 'checkbox'">
                            <div v-for="options in question.options" :key="options.id" class="my-1 flex align-items-center">
                                <Checkbox :value="options.id" v-model="question.model" />
                                <label class="ml-2">{{ options.description }}</label>
                            </div>
                        </div>
                        <div v-show="question.type == 'text'">
                            <InputText id="text" type="text" class="w-full my-2" v-model="question.model"/>
                        </div>
                        <div v-show="question.type == 'radio'" class="my-1">
                            <div v-for="options in question.options" :key="options.id" class="my-1">
                                <div class="flex align-items-center">
                                    <RadioButton name="pizza" :value="options.id" v-model="question.model"/>
                                    <label class="ml-2">{{ options.description }}</label>
                                </div>
                                <div class="mt-2">
                                    <InputText :placeholder="`Jika ${options.description}, berikan alasannya`" v-model="options.model_extra" v-show="options.extra_answer == '1'" class="w-full"/>
                                </div>
                            </div>
                        </div>
                        <div v-show="question.type == 'range'" class="my-2">
                            <SelectButton :options="question.options" optionLabel="description" optionValue="id" v-model="question.model"/>
                        </div>
                        <div v-show="question.type == 'dropdown'">
                            <Dropdown :options="question.options" optionLabel="description" optionValue="id" placeholder="Select a Answare" class="w-full" v-model="question.model"/>
                        </div>
                        <div v-show="question.type == 'number'">
                            <InputNumber class="w-full my-2" v-model="question.model"/>
                        </div>
                    </div>
                </div>
                <div class="card shadow-3 bg-gray-300">
                    <h6 class="text-xl"><i class="text-xl pi pi-user font-semibold mr-2"></i>{{ payload.name }}</h6>
                    <span class="text-xl"><i class="text-xl pi pi-envelope font-semibold mr-2"></i>{{ payload.email }}</span>
                </div>
                <div class="flex justify-content-between">
                    <Button label="BACK" severity="danger" icon="pi pi-arrow-left" size="small" @click="link"></Button>
                    <Button label="SUBMIT" severity="primary" size="small" :disabled="roles == 'admin' ? true : false" @click="submitForm"></Button>
                </div>
                <Divider/>
                <div class="flex-1 ">
                    <div class="w-full text-right text-lg"><strong>SURVEY - INL</strong></div>
                    <div class="w-full text-right text-lg"><strong>ICT Development</strong> &copy; 2023 - PT. Industri Nabati Lestari</div>
                </div>
            </div>
            <div class="col-12 md:col-8 sm:col-8 bg-white mt-6 border-round-md" v-show="finished == 'sukses'">
                <div class="flex justify-content-between py-6 px-4 bg-no-repeat bg-cover border-round-md shadow-2 mb-8" style="background-image: url('/layout/bg2.jpg');">
                    <div class="">
                        <div class="text-3xl md:text-3xl sm:text-lg mb-1 p-1 bg-cyan-50 border-round-md"><span class="font-bold mr-2">{{ payload.name }}</span> <span class="font-thin">({{ payload.email }})</span></div>
                        <div class="text-gray-600 text-md mt-2">By <strong>PT. Industri Nabati Lestari</strong></div>
                    </div>
                    <div class="">
                        <img src="/layout/inl.png" alt="PT. Industri Nabati Lestari" class="mr-3 w-5rem">
                        <img src="/layout/n3.png" alt="PT. Perkebunan Nusantara" class="w-5rem">
                    </div>
                </div>
                <div class="mt-8 text-center">
                    <h1 class="font-normal">Terimakasih telah mengisi data survey dari kami</h1>
                    <h5 class="font-bold mb-6">{{surveys.title}}</h5>
                    <Button label="Back to the list survey page" severity="warning" outlined size="small" @click="link"></Button>
                </div>
            </div>
            <div class="col-12 md:col-8 sm:col-8 bg-white mt-6 border-round-md" v-show="finished == 'sudah'">
                <div class="flex justify-content-between py-6 px-4 bg-no-repeat bg-cover border-round-md shadow-2 mb-8" style="background-image: url('/layout/bg2.jpg');">
                    <div class="">
                        <div class="text-3xl md:text-3xl sm:text-lg mb-1 p-1 bg-cyan-50 border-round-md"><span class="font-bold mr-2">{{ payload.name }}</span> <span class="font-thin">({{ payload.email }})</span></div>
                        <div class="text-gray-600 text-md mt-2">By <strong>PT. Industri Nabati Lestari</strong></div>
                    </div>
                    <div class="">
                        <img src="/layout/inl.png" alt="PT. Industri Nabati Lestari" class="mr-3 w-5rem">
                        <img src="/layout/n3.png" alt="PT. Perkebunan Nusantara" class="w-5rem">
                    </div>
                </div>
                <div class="mt-8 text-center">
                    <h1 class="font-normal">Pengisian form telah berakhir, <br/> terimakasih telah berpartisipasi.</h1>
                    <h5 class="font-bold text-bluegray-200 mb-6">{{surveys.title}}</h5>
                    <Button label="Back to the list survey page" severity="warning" outlined size="small" @click="link"></Button>
                </div>
            </div>
        </div>
    </div>
</template>