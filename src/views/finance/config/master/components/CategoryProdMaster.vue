<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import CategoryProdMaster from '@/api/master/CategoryProdMaster.js';
    import { loadAll_CategoryProdMaster, add_CategoryProdMaster, update_CategoryProdMaster } from "@/controller/master_data/CategoryProductionController.js";

    // VARIABLE
    const products = ref([]);
    const expandedRows = ref([]);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const forms = ref({id:null, nama:null, uraian:[]});
    const forms_sub = ref([{id:null, id_category:null, nama:null, satuan: null}])
    const loadingTable = ref(false)
    const loadingSubmit = ref(false)

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
            const list = [];
            const data = await loadAll_CategoryProdMaster()
            if (data != null) {
                for (let a = 0; a < data.length; a++) {
                    const category2 = data[a].uraian
                    const list_cat2 = []
                    for (let b = 0; b < category2.length; b++) {
                        list_cat2.push({
                            id: category2[b].id,
                            id_category: category2[b].id_category,
                            nama: category2[b].nama,
                            satuan:category2[b].satuan,
                        })
                    }
                    list.push({
                        id:data[a].id,
                        nama:data[a].nama,
                        uraian:list_cat2,
                    })
                }
            }
            products.value = list
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
        loadingSubmit.value = false;
        if (cond == 'add') {
            resetForm()
        } else {
            forms.value = {id:data.id, nama: data.nama, uraian: []};
            const uraian = data.uraian;
            const list = []
            if (uraian.length > 0) {
                for (let i = 0; i < uraian.length; i++) {
                    list.push({
                        id: uraian[i].id,
                        id_category: uraian[i].id_category,
                        nama: uraian[i].nama,
                        satuan: uraian[i].satuan,
                    })
                }
            } else {
                list = [{id:null, id_category:null, nama:null, satuan: null}]
            }
            forms.value = {id:data.id, nama: data.nama, uraian: []};
            forms_sub.value = list;
        }
    }

    const addsForm = () => {
        forms_sub.value.push({ id:null, nama:null, satuan:null });
    };

    const removeForm = (index) => {
        forms_sub.value.splice(index, 1);
    };

    const resetForm = () => {
        forms.value = { id:null, nama:null, uraian:[] };
        forms_sub.value = [{ id:null, nama:null, satuan:null }];
    }

    const saveData = async () => {
        if (forms.value.nama != null && forms.value.nama != "") {
            const sub = forms_sub.value;
            let msg = []
            let kondisi;
            for (let i = 0; i < sub.length; i++) {
                if (sub[i].nama !== null && sub[i].nama !== "" && sub[i].satuan !== null && sub[i].satuan !== "") {
                    if (i < (sub.length - 1)) {
                        continue;
                    }
                    msg = [{ severity: 'success', content: 'Data berhasil di simpan', id: count.value++ }];
                    kondisi = true;
                } else {
                    msg = [{ severity: "warn", content: `Mohon data diisi pada bagian sub category ke-${i+1} dengan lengkap`, id: count.value++ },];
                    kondisi = false;
                    break;
                }
            }
            if (kondisi == true) {
                loadingSubmit.value = true;
                forms.value.uraian = forms_sub.value
                if (status_form.value == 'add') {
                    const response = await add_CategoryProdMaster(forms.value);
                    if (response.status == true) {
                        messages.value = [{ severity: 'success', content: 'Data berhasil di tambahkan', id: count.value++ }];
                        setTimeout(function() {
                            loadData()
                            visible.value = false
                        }, time.value);
                    } else {
                        let severity = "";
                        if (response.code == 400) {
                            severity = "warning";
                        } else {
                            severity = "error";
                        }
                        messages.value = [{ severity: severity, content: response.msg, id: count.value++ }];
                    }
                    loadingSubmit.value = false;
                } else if (status_form.value == 'edit') {
                    const response = await update_CategoryProdMaster(forms.value.id, forms.value);
                    if (response.status == true) {
                        messages.value = [{ severity: 'success', content: 'Data berhasil di update', id: count.value++ }];
                        setTimeout(function() {
                            loadData()
                            visible.value = false
                        }, time.value);
                    } else {
                        let severity = "";
                        if (response.code == 400) {
                            severity = "warning";
                        } else {
                            severity = "error";
                        }
                        messages.value = [{ severity: severity, content: response.msg, id: count.value++ }];
                    }
                    loadingSubmit.value = false;
                } else {
                    messages.value = [ { severity: 'success', content: 'Data berhasil di hapus', id: count.value++ } ];
                    loadingSubmit.value = false;
                }
            } else {
                messages.value = msg;
            }
        } else {
            messages.value = [{ severity: "warn", content: "Mohon data diisi dengan lengkap", id: count.value++ },];
        }
    }
</script>

<template>
    <div class="flex-auto flex flex-column gap-3 p-3 bg-white shadow-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-auto flex align-items-center gap-2">
                <span class="font-medium text-xl">Category Production</span>
            </div>
            <div class="w-5 flex gap-2">
                <Button icon="pi pi-plus" severity="info" class="text-lg font-bold" size="small" @click="formDatabase('add', null)"/>
                <div class="p-inputgroup p-fluid">
                    <span class="p-inputgroup-addon bg-white">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText type="text" placeholder="Search" class="w-full" v-model="filters['global'].value"/>
                </div>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" :draggable="false" modal :header="title_dialog" :style="{ width: '50rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex flex-column gap-3">
                <label for="username" class="font-normal uppercase text-sm">Main Category <small class="text-red-500">*</small></label>
                <InputText id="username" v-model="forms.nama" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex flex-column gap-3 mt-3" v-for="(form, index) in forms_sub" :key="index">
                <div class="flex flex-column">
                    <div class="flex justify-content-between align-items-center gap-5">
                        <Divider>
                            <label for="username" class="font-medium uppercase text-sm">Sub Category {{index + 1}}</label>
                        </Divider>
                        <div class="flex gap-2">
                            <Button icon="pi pi-plus" severity="success" outlined rounded size="small" class="px-2 py-1 h-auto w-auto" @click="addsForm"></Button>
                            <Button icon="pi pi-minus" severity="danger" outlined rounded size="small" class="px-2 py-1 h-auto w-auto" @click="removeForm(index)" :disabled="forms_sub.length > 1 ? false : true"></Button>
                        </div>
                    </div>
                    <div class="flex flex-column gap-2">
                        <div class="p-inputgroup p-fluid ">
                            <span class="p-inputgroup-addon bg-white w-2 flex justify-content-start">
                                <span>Nama <small class="text-red-500">*</small></span>
                            </span>
                            <InputText id="sub1" v-model="form.nama" class="flex-auto" autocomplete="off" />
                        </div>
                        <div class="p-inputgroup p-fluid ">
                            <span class="p-inputgroup-addon bg-white w-2 flex justify-content-start">
                                <span>Satuan <small class="text-red-500">*</small></span>
                            </span>
                            <InputText id="sub1" v-model="form.satuan" class="flex-auto" autocomplete="off" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" :label="loadingSubmit == true ? 'Saving...' : 'Save'" @click="saveData" :disabled="loadingSubmit == true ? true : false"></Button>
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
        <DataTable v-else v-model:expandedRows="expandedRows" v-model:filters="filters" :value="products" scrollHeight="420px" paginator :rows="10" showGridlines :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="id" scrollable :globalFilterFields="['nama','nama_category2']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column expander style="width: 5rem" />
            <Column field="nama" header="Category" style="min-width: 8rem;">
                <template #body="{ data }">
                    <strong class="text-sm">{{ data.nama }}</strong>
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
                <DataTable :value="data.uraian" class="p-datatable-sm" :globalFilterFields="['nama', 'satuan']">
                    <Column field="Nama" sortable>
                        <template #header>
                            <span class="text-xs">Sub Category</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-sm">{{ data.nama }}</span>
                        </template>
                    </Column>
                    <Column field="Satuan" sortable>
                        <template #header>
                            <span class="text-xs">Satuan</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-sm">{{ data.satuan }}</span>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </DataTable>
    </div>
</template>
