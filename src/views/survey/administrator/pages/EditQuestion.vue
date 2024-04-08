<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import Editor from 'primevue/editor';
import { useRouter, useRoute  } from 'vue-router';


// API
import UserService from '@/api/UserService';
import { formQuestion, settingPertanyaan, BreadcrumbHome, typeAnswer, listRequired, listCategory} from '@/api/DataVariable';


// Variable
const toast = useToast();
const router = useRouter();
const route = useRoute();

const params = route.params.id;
const judul = route.query.title;
const deskipsi = route.query.desc;

const dialogs = ref(false)
const titledialogs = ref(null);
const statusdialog = ref(null);
const forms = ref([]);
const changePertanyaan = ref(true);

// Dropdown
const listType = ref(typeAnswer)
const listRequire = ref(listRequired)
const listCategories = ref(listCategory)

const payload = JSON.parse(localStorage.getItem('payload'));
const tokens = localStorage.getItem('usertoken');
const breadcrumbHome = ref(BreadcrumbHome);
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Management', to:'#' }, { label: 'Survey', to:'/survey' }, { label: params, to:`/edit-question/${params}` }, { label: 'Edit Question', class:'font-bold', disabled:true  }]);

// Detail Menu Peranyaan
const menu = ref(null);
const items = ref(settingPertanyaan);

// Given accsess public funtion
onMounted(() => {
    addForms();
});

const changeQuestion = (val) => {
    changePertanyaan.value = val;
}

const toggle = (event) => {
    menu.value.toggle(event);
};

const save = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
};

// Function Private
const loadUser = () => {
    // console.log(tokens)
}

const addForms = () => {
    forms.value.push({
        id: 0,
        category_id: '',
        question: '',
        type: '',
        require: '',
        value:[],
        desc:[],
        extra:[],
    })
}

const removeForm = (index) => {
    forms.value.splice(index, 1); // Remove the form at the specified index
};

const typeInputs = (ident, index) => {
    console.log(index, ident)
};

const resetForm = () => {
    // forms.value = {
    //     id: 0,
    //     category_id: '',
    //     question: '',
    //     type: '',
    //     require: '',
    //     value:[],
    //     desc:[],
    //     extra:[],
    // }
}

const showDialog = (status, id) => {
    dialogs.value = true;
    if (status == 'add') {
        titledialogs.value = 'Create User';
        statusdialog.value = status
        resetForm()
    } else {
        titledialogs.value = 'Edit User';
    }
}

const postDialog = () => {
    console.log(forms.value)
    dialogs.value = false;
    if (statusdialog.value == 'add') {
        console.log(statusdialog.value)
        UserService.addUser(forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                loadUser();
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
    } else {
        console.log(statusdialog.value)
        toast.add({ severity: 'success', summary: 'Successfully', detail: `Updated successfully`, life: 3000 });
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
                <Panel header="Pertanyaan" class="my-5" v-for="(form, index) in forms" :key="index">
                    <template #icons>
                        <Button class="p-panel-header-icon p-link text-green-500 mr-2" icon="pi pi-book" v-tooltip.top="'Text'"></Button>
                        <!-- <Button class="p-panel-header-icon p-link text-green-500 mr-2" icon="pi pi-hashtag" v-else v-tooltip.top="'Media & Text'" @click="changeQuestion(false)"></Button> -->
                        <Button class="p-panel-header-icon p-link text-red-500 mr-2" icon="pi pi-trash" :disabled="index < 1 ? true : false" v-tooltip.top="'Hapus Pertanyaan'" @click="removeForm(index)"></Button>
                        <Button class="p-panel-header-icon p-link text-blue-500 mr-2" icon="pi pi-plus" v-tooltip.top="'Tambah Pertanyaan'" @click="addForms"></Button>
                        <Menu ref="menu" id="config_menu" :model="items" popup />
                    </template>
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-12 p-fluid">
                            <label for="firstname2">Pertanyaan</label>
                            <Textarea v-model="form.question" autoResize rows="8" cols="30" placeholder="Silahkan ajukan pertanyaan"/>
                            <!-- <Editor v-model="form[index].question" editorStyle="height: 180px" placeholder="Silahkan ajukan pertanyaan" v-else /> -->
                        </div>
                        <div class="field col-12 md:col-4 p-fluid">
                            <label for="firstname2">Tanda wajib</label>
                            <Dropdown v-model="form.require" :options="listRequire" optionLabel="name" optionValue="require" placeholder="* Wajib menjawab" class="w-full md:w-17rem"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4 p-fluid">
                            <label for="firstname2">Kategori</label>
                            <Dropdown v-model="form.category_id" :options="listCategories" optionLabel="name" optionValue="category_id" placeholder="Kategori pertanyaan" class="w-full md:w-17rem"></Dropdown>
                        </div>
                        <div class="field col-12 md:col-4 p-fluid">
                            <label for="firstname2">Tipe Jawaban</label>
                            <Dropdown v-model="form.type" :options="listType" @change="typeInputs(forms[index].type, index)" optionLabel="name" placeholder="Answer Type" class="w-full md:w-17rem">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex align-items-center">
                                        <img :alt="slotProps.value.name" :src="slotProps.value.icon" :class="`mr-2`" style="width: 18px" />
                                        <div>{{ slotProps.value.name }}</div>
                                    </div>
                                    <span v-else>
                                        {{ slotProps.placeholder }}
                                    </span>
                                </template>
                                <template #option="slotProps">
                                    <div class="flex align-items-center">
                                        <img :alt="slotProps.option.name" :src="slotProps.option.icon" :class="`mr-2`" style="width: 18px" />
                                        <div>{{ slotProps.option.name }}</div>
                                    </div>
                                </template>
                            </Dropdown>
                        </div>
                        <div class="field col-12 md:col-12 p-fluid">
                            <div v-show="forms[index].type.type == 'checkbox'">
                                <label for="label">List Jawaban</label>
                                <div class="p-inputgroup flex-1 my-3">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-check-square"></i>
                                    </span>
                                    <InputText placeholder="Desc" />
                                    <InputText placeholder="Value" />
                                    <Button icon="pi pi-plus" severity="primary" outlined></Button>
                                    <Button icon="pi pi-minus" severity="danger" outlined></Button>
                                </div>
                                <div class="flex align-items-center mt-2">
                                    <InputSwitch v-model="forms.extra" />
                                    <label for="ingredient1" class="ml-2"> Opsi Lainnya </label>
                                </div>
                            </div>
                            <div v-show="forms[index].type.type == 'radio'">
                                <label for="label">List Jawaban</label>
                                <div class="p-inputgroup flex-1 my-3">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-stop-circle"></i>
                                    </span>
                                    <InputText placeholder="Desc" />
                                    <InputText placeholder="Value" />
                                    <Button icon="pi pi-plus" severity="primary" outlined />
                                    <Button icon="pi pi-times" severity="danger" outlined />
                                </div>
                                <div class="flex align-items-center mt-2">
                                    <InputSwitch v-model="forms.extra" />
                                    <label for="ingredient1" class="ml-2"> Opsi Lainnya </label>
                                </div>
                            </div>
                            <div v-show="forms[index].type.type == 'dropdown'">
                                <label for="label">List Jawaban</label>
                                <div class="p-inputgroup flex-1 my-3">
                                    <span class="p-inputgroup-addon">
                                        <i class="pi pi-caret-down"></i>
                                    </span>
                                    <InputText placeholder="Label Dropdown" />
                                    <Button icon="pi pi-plus" severity="primary" outlined />
                                    <Button icon="pi pi-times" severity="danger" outlined />
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    </div>
</template>