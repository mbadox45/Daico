<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import Editor from 'primevue/editor';
import { useRouter, useRoute  } from 'vue-router';


// API
import UserService from '@/api/UserService';
import QuestionService from '@/api/QuestionService';
import CategoryService from '@/api/CategoryService';
import { formQuestion, settingPertanyaan, BreadcrumbHome, typeAnswer, listRequired, listCategory} from '@/api/DataVariable';


// Variable
const toast = useToast();
const router = useRouter();
const route = useRoute();

const params = route.params.cond;
const id_question = route.query.id;

const judul = ref(null);
const deskipsi = ref(null);
const forms = ref(formQuestion);
const forms_answare = ref([{option_id:null, value:'', desc:'', extra:false}]);
const forms_text = ref([{option_id:null, value:'', desc:'', extra:false}]);
const forms_number = ref({start:1, end:3});
const answers = ref(null);
const tot_answare = ref(1);
const changePertanyaan = ref(true);

// Dropdown
const listType = ref(typeAnswer)
const listRequire = ref(listRequired)
const listCategories = ref([])

const breadcrumbHome = ref(BreadcrumbHome);
const breadcrumbItems = ref([]);

// Detail Menu Peranyaan
const menu = ref(null);
const items = ref(settingPertanyaan);

// Given accsess public funtion
onMounted(() => {
    addForms(params);
    bcItems();
    // loadUser();
});

const changeQuestion = (val) => {
    changePertanyaan.value = val;
}

const bcItems = () => {
    if (params == 'add') {
        judul.value = 'Form Add Question';
        deskipsi.value = 'Silahkan ajukan pertanyaan anda untuk user.';
        breadcrumbItems.value = [
            { label: 'Home', to:'/home' }, { label: 'Management', to:'#' }, { label: 'Questions', to:'/questions' }, { label: 'Add Question', class:'font-bold', disabled:true}
        ]
    } else {
        judul.value = 'Form Edit Question';
        deskipsi.value = 'Silahkan ajukan pertanyaan anda untuk user.';
        breadcrumbItems.value = [
            { label: 'Home', to:'/home' }, { label: 'Management', to:'#' }, { label: 'Questions', to:'/questions' }, { label: id_question, to:`/edit-question/${id_question}` }, { label: 'Edit Question', class:'font-bold', disabled:true}
        ]
    }
}

const inputNumbers = () => {
    if (forms_number.value.end < 3) {
        forms_number.value.end = 3
    } else {
        forms_number.value.end = forms_number.value.end
    }
    console.log(forms_number.value.end);
};

// Function Private
const loadUser = () => {
    CategoryService.getCategories().then(res => {
        const load = res.data;
        if (load.code == 200) {
            const data = load.data;
            console.log(load);
            const list = [];
            for (let i = 0; i < data.length; i++) {
                list[i] = {
                    category_id:data[i].id,
                    name:data[i].name,
                }
            }
            listCategories.value = list;
        } else {
            listCategories.value = [];
            console.log('kosong');
        }
    }).catch(error => {
        listCategories.value = [];
        console.error(error.response.status);
    })
}

const addForms = (type) => {
    if (type == 'edit') {
        answers.value = type;
        QuestionService.getQuestionsID(id_question).then(res => {
            const load = res.data;
            if (load.code == 200) {
                loadUser();
                const data = load.data;
                console.log(data);
                forms.value.id = data.id;
                forms.value.question = data.question;
                forms.value.type = data.type;
                forms.value.require = data.require == true ? 1:0;
                forms.value.category_id = data.category_id;
                const ans = data.options;
                console.log(ans);
                tot_answare.value = ans.length;
                const list = [];
                if (ans.length < 1) {
                    list[0] = {
                        option_id: null,
                        value: '',
                        extra: false,
                        desc: '-',
                    };
                } else {
                    for (let i = 0; i < ans.length; i++) {
                        list[i] = {
                            option_id: ans[i].id,
                            value: ans[i].value,
                            extra: ans[i].extra_answer =='0' ? false : true,
                            desc: ans[i].description,
                        };
                    }
                }
                forms_answare.value = list;
            } else {
                forms.value = {}
            }
        }).catch(error => {
            console.error(error.response.status);
        })
    } else {
        answers.value = type;
        resetForm()
        loadUser();
    }
}

const addsForm = () => {
    // tot_answare.value++;
    forms_answare.value.push({
        option_id: null,
        value: '',
        extra: false,
        desc: '',
    });
};

const addsFormRange = () => {
    // console.log(forms.value.type)
    if (forms.value.type == 'range') {
        const list = [];
        for (let i = 0; i < 5; i++) {
            list[i] = {
                option_id: null,
                value: i+1,
                extra: false,
                desc: '',
            }
        }
        forms_answare.value = list;
        // console.log(list);
    } else {
        forms_answare.value = [
            {option_id: null, value: '', extra: false, desc: ''}
        ];
    }
};

const removeForm = (index) => {
    forms_answare.value.splice(index, 1); // Remove the form at the specified index
};

const resetForm = () => {
    forms.value.category_id = 0;
    forms.value.question = null;
    forms.value.type = null;
    forms.value.require = null;
    forms_answare.value = [ {value: '', extra: false, desc: '',}];
    forms_text.value = [ {value: '', extra: false, desc: '-',}];
    forms_number.value = {start:1, end:3};
}

const backToQuestion = () => {
    router.push({path:'/questions'})
}

const postDialog = () => {
    // fill data in var array condition
    const opt_id = [];
    const desc = [];
    const value = [];
    const extra = [];
    forms.value.type = forms.value.type;
    if (forms.value.type == 'text') {
        const ft = forms_text.value;
        desc[0] = ft[0].desc;
        value[0] = ft[0].value;
        extra[0] = ft[0].extra == false ? '0' : '1';
        forms_answare.value[0] = {
            desc: ft[0].desc,
            value: ft[0].value,
            extra: ft[0].extra,
        };
    } else if (forms.value.type == 'number') {
        const fn = forms_number.value;
        for (let i = 0; i < fn.end; i++) {
            desc[i]=(i+fn.start).toString();
            value[i]=(i+fn.start).toString();
            extra[i]='0';
            forms_answare.value[0] = {desc:(i+fn.start).toString(), value:(i+fn.start).toString()};
        }
    } else {
        const ans = forms_answare.value;
        for (let i = 0; i < ans.length; i++) {
            if (ans[i].option_id != null) {
                opt_id[i]=ans[i].option_id;
            }
            desc[i]=ans[i].desc;
            value[i]=ans[i].value;
            extra[i]=ans[i].extra == false ? '0' : '1';
        }
    }
    forms.value.id = forms.value.id;
    forms.value.category_id = forms.value.category_id;
    forms.value.question = forms.value.question;
    forms.value.require = forms.value.require;
    forms.value.desc = desc;
    forms.value.value = value;
    forms.value.extra = extra;

    if (params == 'add') {
        if (forms.value.type == 'text' || forms.value.type == 'number') {
            QuestionService.addQuestion(forms.value).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    resetForm();
                    toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                    setTimeout(backToQuestion, 3000);
                } else {
                    this.$refs.toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
                }
            }).catch(error => {
                console.error(error.response.status);
                toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
            })
        } else {
            if (forms.value.question != null && forms.value.type != null && forms.value.require != null && forms_answare.value[0].value != '' && forms_answare.value[0].desc != null) {
                // console.log(forms_answare.value);
                // console.log(forms.value);
                QuestionService.addQuestion(forms.value).then(res => {
                    const load = res.data;
                    if (load.code == 200) {
                        resetForm();
                        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                        setTimeout(backToQuestion, 3000);
                    } else {
                        this.$refs.toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
                    }
                }).catch(error => {
                    console.error(error.response.status);
                    toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
                })
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Harap diisi dengan lengkap`, life: 3000 });
            }
        }
    } else if (params == 'edit') {
        forms.value.option_id = opt_id;
        if (forms.value.category_id != 0 && forms.value.question != null && forms.value.type != null && forms.value.require != null && forms_answare.value[0].value != '' && forms_answare.value[0].desc != '') {
            console.log(forms.value)
            QuestionService.updateQuestion(forms.value.id,forms.value).then(res => {
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
        console.log(forms.value);
        console.log(params);
        toast.add({ severity: 'success', summary: 'Successfully', detail: `Delete successfully`, life: 3000 });
        resetForm();
    }
}

</script>

<template>
    <div class="grid">
        <Toast position="top-center"/>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div>
                    <h5>{{judul}}</h5>
                    <span>{{deskipsi}}</span>
                </div>
                <Panel header="PERTANYAAN" class="my-5">
                    <template #icons>
                        <Button class="p-panel-header-icon p-link text-red-500 mr-2" icon="pi pi-arrow-left" v-tooltip.top="'Kembali'" @click="postDialog"></Button>
                        <Button class="p-panel-header-icon p-link text-blue-500 mr-2" icon="pi pi-save" v-tooltip.top="'Simpan'" @click="postDialog"></Button>
                        <Button class="p-panel-header-icon p-link text-gray-500 mr-2" icon="pi pi-sync" v-tooltip.top="'Bersihkan Form'" @click="resetForm"></Button>
                        <Menu ref="menu" id="config_menu" :model="items" popup />
                    </template>
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-12 p-fluid">
                            <label for="firstname2">Pertanyaan</label>
                            <Editor v-model="forms.question" editorStyle="height: 120px" placeholder="Silahkan ajukan pertanyaan" />
                            <!-- <Textarea v-model="forms.question" autoResize rows="8" cols="30" placeholder="Silahkan ajukan pertanyaan"/> -->
                        </div>
                        <div class="field col-12 md:col-6 p-fluid">
                            <label for="firstname2">Tanda wajib</label>
                            <Dropdown v-model="forms.require" :options="listRequire" optionLabel="name" optionValue="require" placeholder="* Wajib menjawab" class="w-full"></Dropdown>
                        </div>
                        <!-- <div class="field col-12 md:col-4 p-fluid">
                            <label for="firstname2">Kategori</label>
                            <Dropdown v-model="forms.category_id" :options="listCategories" optionLabel="name" optionValue="category_id" placeholder="Kategori pertanyaan" class="w-full md:w-17rem"></Dropdown>
                        </div> -->
                        <div class="field col-12 md:col-6 p-fluid">
                            <label for="firstname2">Tipe Jawaban</label>
                            <Dropdown v-model="forms.type" :options="listType" optionLabel="name" optionValue="type" placeholder="Answer Type" class="w-full" @change="addsFormRange">
                                <!-- <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex align-items-center">
                                        <img :alt="slotProps.value.name" :src="slotProps.value.icon" :class="`mr-2`" style="width: 18px" />
                                        <div>{{ slotProps.value.name }}</div>
                                    </div>
                                    <span v-else>
                                        {{ slotProps.placeholder }}
                                    </span>
                                </template> -->
                                <template #option="slotProps">
                                    <div class="flex align-items-center">
                                        <img :alt="slotProps.option.name" :src="slotProps.option.icon" :class="`mr-2`" style="width: 18px" />
                                        <div>{{ slotProps.option.name }}</div>
                                    </div>
                                </template>
                            </Dropdown>
                        </div>
                        <div class="field col-12 md:col-12 p-fluid">
                            <div v-show="forms.type == 'checkbox'">
                                <label for="label">List Jawaban</label>
                                <div v-for="(form, index) in forms_answare" :key="index">
                                    <div class="p-inputgroup flex-1 my-3">
                                        <span class="p-inputgroup-addon">
                                            <i class="pi pi-check-square"></i>
                                        </span>
                                        <InputText placeholder="Desc" v-model="form.desc" />
                                        <InputText placeholder="Value (Contoh: jawaban1)" v-model="form.value" />
                                        <Button icon="pi pi-plus" severity="primary" @click="addsForm" outlined></Button>
                                        <Button icon="pi pi-minus" severity="danger" @click="removeForm(index)" :disabled="index == 0 ? true : false" outlined></Button>
                                    </div>
                                    <div class="flex align-items-center mt-2" v-if="index == (forms_answare.length - 1)">
                                        <InputSwitch v-model="form.extra" />
                                        <label for="ingredient1" class="ml-2"> Opsi Lainnya</label>
                                    </div>
                                </div>
                            </div>
                            <div v-show="forms.type == 'radio'">
                                <label for="label">List Jawaban</label>
                                <div v-for="(form, index) in forms_answare" :key="index">
                                    <div class="p-inputgroup flex-1 my-3">
                                        <span class="p-inputgroup-addon">
                                            <i class="pi pi-stop-circle"></i>
                                        </span>
                                        <InputText placeholder="Desc" v-model="form.desc" />
                                        <InputText placeholder="Value" v-model="form.value" />
                                        <Button icon="pi pi-plus" severity="primary" @click="addsForm" outlined />
                                        <Button icon="pi pi-times" severity="danger" @click="removeForm(index)" :disabled="index == 0 ? true : false" outlined />
                                    </div>
                                    <div class="flex align-items-center mt-2" v-if="index == (forms_answare.length - 1)">
                                        <InputSwitch v-model="form.extra" />
                                        <label for="ingredient1" class="ml-2"> Opsi Lainnya </label>
                                    </div>
                                </div>
                            </div>
                            <div v-show="forms.type == 'dropdown'">
                                <label for="label">List Jawaban</label>
                                <div v-for="(form, index) in forms_answare" :key="index">
                                    <div class="p-inputgroup flex-1 my-3">
                                        <span class="p-inputgroup-addon">
                                            <i class="pi pi-caret-down"></i>
                                        </span>
                                        <InputText placeholder="Desc" v-model="form.desc" />
                                        <InputText placeholder="Value" v-model="form.value"/>
                                        <Button icon="pi pi-plus" severity="primary" @click="addsForm" outlined />
                                        <Button icon="pi pi-times" severity="danger" @click="removeForm(index)" :disabled="index == 0 ? true : false" outlined />
                                    </div>
                                </div>
                            </div>
                            <div v-show="forms.type == 'range'">
                                <div class="flex justify-content-between align-items-end">
                                    <label for="label">List Jawaban</label>
                                    <div>
                                        <small class="text-bluegray-500"><strong>Note:</strong></small><br/>
                                        <small class="text-red-500"><strong>-</strong> Untuk pertanyaan negatif, "Sangat Setuju" di urutan ke 1</small><br/>
                                        <small class="text-red-500"><strong>-</strong> Untuk pertanyaan positif, "Sangat Setuju" di urutan ke 5</small>
                                    </div>
                                </div>
                                <div v-for="(form, index) in forms_answare" :key="index">
                                    <div class="p-inputgroup flex-1 my-3">
                                        <span class="p-inputgroup-addon">
                                            {{ index+1 }}
                                        </span>
                                        <InputText placeholder="Contoh: Sangat Setuju" v-model="form.desc"/>
                                        <InputText placeholder="Contoh: sangat_setuju" v-model="form.value"/>
                                    </div>
                                </div>
                                <div class="flex justify-content-between">
                                    <small><strong>Ket:</strong> Desc (Keterangan atau label), Value (Identitas data)</small>
                                    <small class="text-pink-400"><strong>Contoh:</strong> Sangat Baik (Desc), sangat_baik (Value)</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    </div>
</template>