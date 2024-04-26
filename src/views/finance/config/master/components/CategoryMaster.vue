<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {master} from '@/api/dummy/variable_form.js';
    import CategoryMaster from '@/api/master/CategoryMaster.js';

    // VARIABLE
    const products = ref([]);
    const expandedRows = ref([]);
    const expandedRows2 = ref([]);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const forms_chapter = ref({id:null, nama_category1:null, category2:[{id:null, nama_category2:null, category3:[{id:null, nama_category3:null}]}]});
    const forms = ref({master})
    const loadingTable = ref(false)
    
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const title_dialog = ref('');

    // Message Configure
    const messages = ref([]);
    let count = ref(0);
    const time = ref(3000)

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        try {
            loadingTable.value = true
            products.value = [];
            const response = await CategoryMaster.getAll()
            const load = response.data;
            // console.log(load)
            const data = load.data;
            for (let a = 0; a < data.length; a++) {
                const category2 = data[a].cat2
                const list_cat2 = []
                for (let b = 0; b < category2.length; b++) {
                    const category3 = category2[b].cat3
                    const list_cat3 = []
                    for (let c = 0; c < category3.length; c++) {
                        list_cat3.push({
                            id: category3[c].id,
                            nama_category3: category3[c].nama,
                        })
                    }
                    list_cat2.push({
                        id: category2[b].id,
                        nama_category2: category2[b].nama,
                        category3:list_cat3,
                    })
                }
                products.value.push({
                    id:data[a].id,
                    nama_category1:data[a].nama,
                    category2:list_cat2,
                })
            }
            console.log(products.value)
            loadingTable.value = false
        } catch (error) {
            products.value = []
            loadingTable.value = false
        }
    }

    const formDatabase = (cond, data) => {
        messages.value = []
        visible.value = true
        status_form.value = cond;
        title_dialog.value = cond == 'add' ? 'Category - Tambah Data' : cond == 'edit' ? 'Category - Edit Data' : 'Category - Hapus Data' ;
        console.log(data)
        if (cond == 'add') {
            resetForm()
        } else {
            forms_chapter.value = data;
        }
    }

    const addsForm = () => {
        forms_chapter.value.category2.push({
            id:null, 
            nama_category2:null, 
            category3:[{
                id:null, 
                nama_category3:null,
            }]
        });
    };

    const removeForm = (index) => {
        forms_chapter.value.category2.splice(index, 1);
    };

    const addsForm2 = (index) => {
        forms_chapter.value.category2[index].category3.push({
            id:null, 
            nama_category3:null,
        });
    };

    const removeForm2 = (mainIndex, subIndex) => {
        forms_chapter.value.category2[mainIndex].category3.splice(subIndex, 1);
    };

    const resetForm = () => {
        forms_chapter.value = {
            id:null, 
            nama_category1:null, 
            category2:[{
                id:null, 
                nama_category2:null, 
                category3:[{
                    id:null, 
                    nama_category3:null,
                }]
            }]
        };
    }

    const saveData = async () => {
        status_form.value
        // console.log(forms_chapter.value);
        // if (forms.value.nama != null) {
            if (status_form.value == 'add') {
                const response = await CategoryMaster.addCategory(forms_chapter.value);
                const load = response.data;
                if (load.success == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di tambahkan', id: count.value++ }
                    ];
                    setTimeout(function() {
                        loadData()
                        visible.value = false
                    }, time.value);
                } else {
                    messages.value = [
                        { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
                    ];
                }
            } else if (status_form.value == 'edit') {
                const response = await CategoryMaster.updateCategory(forms_chapter.value.id, forms_chapter.value);
                const load = response.data;
                if (load.success == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di update', id: count.value++ }
                    ];
                    setTimeout(function() {
                        loadData()
                        visible.value = false
                    }, time.value);
                } else {
                    messages.value = [
                        { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
                    ];
                }
            } else {
                messages.value = [
                    { severity: 'success', content: 'Data berhasil di hapus', id: count.value++ }
                ];
            }
        // } else {
        //     messages.value = [
        //         { severity: 'warn', content: 'Mohon data diisi dengan lengkap', id: count.value++ }
        //     ];
        // }
    }
</script>

<template>
    <div class="flex-auto flex flex-column gap-3 p-3 bg-white shadow-3">
        <span class="font-medium text-xl">Category</span>
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-auto flex gap-2">
                <Button icon="pi pi-plus" severity="info" size="small" @click="formDatabase('add', null)"/>
            </div>
            <div class="p-inputgroup p-fluid ">
                <span class="p-inputgroup-addon bg-white">
                    <i class="pi pi-search"></i>
                </span>
                <InputText type="text" placeholder="Search" class="w-full" v-model="filters['global'].value"/>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" :draggable="false" modal :header="title_dialog" :style="{ width: '50rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex flex-column gap-3">
                <label for="username" class="font-normal uppercase text-sm">Main Category <small class="text-red-500">*</small></label>
                <InputText id="username" v-model="forms_chapter.nama_category1" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex flex-column gap-3 mt-3" v-for="(form, index) in forms_chapter.category2" :key="index">
                <div class="flex flex-column">
                    <Divider>
                        <label for="username" class="font-medium uppercase text-sm">Sub Category {{index + 1}}</label>
                    </Divider>
                    <div class="p-inputgroup p-fluid ">
                        <span class="p-inputgroup-addon bg-white">
                            <span>Sub Category <small class="text-red-500">*</small></span>
                        </span>
                        <InputText id="sub1" v-model="form.nama_category2" class="flex-auto" autocomplete="off" />
                        <Button icon="pi pi-plus" severity="success" outlined @click="addsForm"/>
                        <Button icon="pi pi-minus" severity="danger" outlined @click="removeForm(index)" :disabled="index == 0 ? true : false"/>
                    </div>
                    <div class="flex-flex-column gap-3 mt-3 px-5" v-for="(form2, indexs) in form.category3" :key="indexs">
                        <div class="p-inputgroup p-fluid ">
                            <span class="p-inputgroup-addon bg-white">
                                <span class="font-medium uppercase text-sm">Sub Category {{index + 1}}.{{indexs + 1}} <small class="text-red-500">*</small></span>
                            </span>
                            <InputText id="sub1" v-model="form2.nama_category3" class="flex-auto" autocomplete="off" />
                            <Button icon="pi pi-plus" severity="success" outlined @click="addsForm2(index)"/>
                            <Button icon="pi pi-minus" severity="danger" outlined @click="removeForm2(index, indexs)"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="saveData"></Button>
            </div>
        </Dialog>

        <!-- Table -->
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <DataTable v-else v-model:expandedRows="expandedRows" v-model:filters="filters" :value="products" paginator :rows="10" showGridlines :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="id" scrollable :globalFilterFields="['nama','nama_category2']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column expander style="width: 5rem" />
            <Column field="nama" header="Category" style="min-width: 8rem;">
                <template #body="{ data }">
                    <strong class="text-sm">{{ data.nama_category1 }}</strong>
                </template>
            </Column>
            <Column header="" style="min-width: 10px;">
                <template #body="{ data }">
                    <div class="flex justify-content-end gap-3">
                        <button @click="formDatabase('edit', data)" class="bg-transparent text-sm border-none border-round text-yellow-500"><i class="pi pi-pencil"></i></button>
                    </div>
                </template>
            </Column>
            <template #expansion="{data}">
                <DataTable :value="data.category2" class="p-datatable-sm" v-model:expandedRows="expandedRows2" :globalFilterFields="['nama']">
                    <Column expander style="width: 5rem" />
                    <Column field="Name" sortable>
                        <template #header>
                            <span class="text-xs">Sub Category</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-sm">{{ data.nama_category2 }}</span>
                        </template>
                    </Column>
                    <template #expansion="{data}">
                        <DataTable :value="data.category3" class="p-datatable-sm" :globalFilterFields="['nama']">
                            <Column field="Name" sortable>
                                <template #header>
                                    <span class="text-xs">Sub Category 2</span>
                                </template>
                                <template #body="{data}">
                                    <span class="text-sm">{{ data.nama_category3 }}</span>
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </DataTable>
            </template>
        </DataTable>
    </div>
</template>