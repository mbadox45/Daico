<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';


// API
import {formSurvey, listSurvey} from '@/api/DataVariable';
import QuestionService from '@/api/QuestionService';


// Variable
const searchKeyword = ref('');
const layout = ref('list');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const checked = ref([]);

const dialogs = ref(false)
const titledialogs = ref(null);
const forms = ref(formSurvey);
const date = new Date();
const statusdialog = ref(null);
const list_Survey = ref([]);
const loadings = ref(true)

const payload = JSON.parse(localStorage.getItem('payload'));
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Management', to:'/survey' }, { label: 'Questions', class:'font-bold', disabled:true  }]);

const toast = useToast();
const router = useRouter();

// Given accsess public funtion
onMounted(() => {
    loadSurvey();
});

const onCheck = (id) => {
    console.log(checked.value[id]);
}

const editQuestion = (cond ,id) => {
    if (cond == 'add') {
        router.push(`/form-question/${cond}`);
    } else {
        router.push(`/form-question/${cond}?id=${id}`);
    }
}

const loadSurvey = () => {
    // loadings.value = true;
    QuestionService.getQuestions().then(res => {
        const load = res.data;
        // console.log(load);
        if (load.code == 200) {
            const data = load.data;
            // console.log(data);
            const list = [];
            data.sort((a, b) => a.id - b.id);
            for (let i = 0; i < data.length; i++) {
                list[i] = {
                    id:data[i].id,
                    question:data[i].question,
                    type:data[i].type,
                    require:data[i].require,
                    // category_name:data[i].category.name,
                    category_id:data[i].category_id,
                    tot_answare:data[i].options.length,
                }
            }
            list_Survey.value = list;
            loadings.value = false;
        } else {
            list_Survey.value = [];
            loadings.value = false;
        }
    })
    .catch(error => {
        list_Survey.value = [];
        loadings.value = false;
        console.error(error.response.status);
    })
}

const filteredList = computed(() => {
    return list_Survey.value.filter(item =>
        item.question.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
});

const resetForm = () => {
    forms.value = {
        id: 0,
        desc: '',
        title: '',
        from: date,
        to: date,
    }
}

const postDialog = () => {
    console.log(forms.value)
    dialogs.value = false;
    if (statusdialog.value == 'add') {
        console.log(statusdialog.value)
        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
    } else {
        console.log(statusdialog.value)
        toast.add({ severity: 'success', summary: 'Successfully', detail: `Updated successfully`, life: 3000 });
    }
}

</script>

<template>
    <div class="grid">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="{ width: '650px' }" :modal="true">
            <template #header>
                <h4>{{titledialogs}}</h4>
            </template>
            <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Judul</label>
                    <InputText id="email" type="email" v-model="forms.title"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Deskripsi</label>
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
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="dialogs = false" class="p-button-outlined p-button-danger" />
                <Button label="Save" icon="pi pi-save" @click="postDialog" class="p-button-outlined p-button-success" autofocus :disabled="disablebtnchangepass" />
            </template>
        </Dialog>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-6 md:col-6 sm:col-6">
                        <!-- <h5>List Categories</h5> -->
                        <h5>List Questions</h5>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <Button severity="info" size="small" icon="pi pi-plus" outlined label="Add Question" @click="editQuestion('add','')" />
                    </div>
                    <div class="col-12">
                        <InputText v-model="searchKeyword" placeholder="Search by title" style="width: 100%" />
                    </div>
                </div>
                <DataView :value="filteredList" :layout="layout" :paginator="true" :rows="10" :sortOrder="sortOrder" :sortField="sortField" v-if="list_Survey.length > 0">
                    <!-- <template #header>
                        <div class="grid grid-nogutter">
                            <div class="col-12 text-left">
                            </div>
                        </div>
                    </template> -->
                    <template #list="slotProps">
                        <div class="col-12">
                            <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                                <img :src="'/question.png'" :alt="slotProps.data.question" class="my-4 md:my-0 w-8 md:w-7rem mr-5" />
                                <div class="flex-1 text-center md:text-left">
                                    <div class="font-bold text-xl" style="color: #F1C40F;" v-html="slotProps.data.question"></div>
                                    <!-- <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" class="mb-2"></Rating> -->
                                    <div class="flex align-items-center lg:text-left sm:text-center">
                                        <i v-show="slotProps.data.type=='checkbox'" class="pi pi-check-square mr-2"></i>
                                        <i v-show="slotProps.data.type=='radio'" class="pi pi-stop-circle mr-2"></i>
                                        <span class="font-semibold">{{slotProps.data.tot_answare}} Jawaban</span>
                                    </div>
                                    <div class="flex align-items-center lg:text-left sm:text-center">
                                        <span class="mr-2 font-bold">Sifat Pertanyaan: </span>
                                        <span class="font-semibold" :style="`color: ${slotProps.data.require == true ? '#E74C3C':'#AEB6BF'};`">{{slotProps.data.require == true ? 'Wajib':'Opsional'}}</span>
                                    </div>
                                </div>
                                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                                    <Button icon="pi pi-pencil" class="mb-2" v-tooltip.left="'Edit Pertanyaan'" label="Edit" severity="warning" size="small" outlined @click="editQuestion('edit', slotProps.data.id)"></Button>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
                <div class="text-center mb-5 mt-2" v-else>
                    <span class="text-lg">{{ loadings == true ? '' : 'Data not found' }} </span>
                </div>
                <div class="flex align-items-center justify-content-center mb-3" v-if="loadings == true">
                    <div class="">
                        <ProgressSpinner aria-label="Loading" style="width: 50px; height: 50px" />
                    </div>
                    <div class="text-gray-500 font-semibold">Please wait ...</div>
                </div>
            </div>
        </div>
    </div>
</template>