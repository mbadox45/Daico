<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {debe} from '@/api/dummy/variable_form.js';
    import DebeConfig from '@/api/configuration/DebeConfig.js';
    import CentreMaster from '@/api/master/CentreMaster.js';
    import AllocMaster from '@/api/master/AllocMaster.js';
    import PlantMaster from '@/api/master/PlantMaster.js';
    import ReportMaster from '@/api/master/ReportMaster.js';
    import CategoryMaster from '@/api/master/CategoryMaster.js';

    // VARIABLE
    const products = ref();
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const loadingTable = ref(false)
    
    // Forms
    const forms = ref({debe})
    const list_category = ref([])
    const list_report = ref([])
    const list_centre = ref([])
    const list_plant = ref([])
    const list_allocation = ref([])

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
        // Value Input
        loadAlloc()
        loadCc()
        loadCategory()
        loadPlant()
        loadReport()

        // DataTable
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            products.value = []
            const response = await DebeConfig.getAll()
            const load = response.data;
            const data = load.data;
            const cat = list_category.value;
            // console.log(cat)
            let category2;
            for (let a = 0; a < data.length; a++) {
                category2 = cat.find(item =>item.id3 == data[a].cat3.id && item.id2 == data[a].cat3.id_category2)
                // console.log(category2)
                products.value.push({
                    id:data[a].id,
                    id_allocation:data[a].id_allocation,
                    id_c_centre:data[a].id_c_centre,
                    id_category3:data[a].id_category3,
                    id_m_report:data[a].id_m_report,
                    id_plant:data[a].id_plant,
                    coa:data[a].coa,
                    allocation:data[a].allocation == null ? '-' : data[a].allocation.nama,
                    c_centre:data[a].c_centre.nama,
                    m_report:data[a].m_report.nama,
                    plant:data[a].plant == null ? '-' : data[a].plant.nama,
                    category3: data[a].cat3.nama,
                    category2: category2.name2,
                    category1: category2.name1,
                })
            }
            console.log(products.value)
            loadingTable.value = false
        } catch (error) {
            products.value = []
            loadingTable.value = false
        }
    }

    const loadAlloc = async() => {
        try {
            list_allocation.value = [];
            const response = await AllocMaster.getAll()
            const load = response.data;
            const data = load.allocation;
            for (let a = 0; a < data.length; a++) {
                list_allocation.value.push({
                    id:data[a].id,
                    name:data[a].nama,
                })
            }
        } catch (error) {
            list_allocation.value = []
        }
    }

    const loadCc = async() => {
        try {
            list_centre.value = [];
            const response = await CentreMaster.getAll()
            const load = response.data;
            const data = load.cCenter;
            for (let a = 0; a < data.length; a++) {
                list_centre.value.push({
                    id:data[a].id,
                    name:data[a].nama,
                })
            }
        } catch (error) {
            list_centre.value = []
        }
    }

    const loadPlant = async() => {
        try {
            list_plant.value = [];
            const response = await PlantMaster.getAll()
            const load = response.data;
            const data = load.Plant;
            for (let a = 0; a < data.length; a++) {
                list_plant.value.push({
                    id:data[a].id,
                    name:data[a].nama,
                })
            }
        } catch (error) {
            list_plant.value = []
        }
    }

    const loadReport = async() => {
        try {
            list_report.value = [];
            const response = await ReportMaster.getAll()
            const load = response.data;
            const data = load.mReport;
            for (let a = 0; a < data.length; a++) {
                list_report.value.push({
                    id:data[a].id,
                    name:data[a].nama,
                })
            }
        } catch (error) {
            list_report.value = []
        }
    }

    const loadCategory = async() => {
        try {
            list_category.value = [];
            const response = await CategoryMaster.getAll()
            const load = response.data;
            const data = load.data;
            for (let a = 0; a < data.length; a++) {
                const cat2 = data[a].cat2;
                for (let b = 0; b < cat2.length; b++) {
                    const cat3 = cat2[b].cat3;
                    for (let c = 0; c < cat3.length; c++) {
                        list_category.value.push({
                            id3:cat3[c].id,
                            id2:cat2[b].id,
                            id1:data[a].id,
                            name3:cat3[c].nama,
                            name2:cat2[b].nama,
                            name1:data[a].nama,
                        })
                    }
                }
            }
            // console.log(list_category.value)
        } catch (error) {
            list_category.value = []
        }
    }

    const formDatabase = (cond, data) => {
        visible.value = true
        status_form.value = cond;
        title_dialog.value = cond == 'add' ? 'Database - Tambah Data' : cond == 'edit' ? 'Database - Edit Data' : 'Database - Hapus Data' ;
        if (cond == 'add') {
            resetForm()
        } else {
            forms.value = {
                id: data.id,
                coa: data.coa,
                id_category3: data.id_category3,
                id_m_report: data.id_m_report,
                id_c_centre: data.id_c_centre,
                id_plant: data.id_plant,
                id_allocation: data.id_allocation,
            }
        }
    }

    const resetForm = () => {
        forms.value = {
            id: null,
            coa: null,
            id_category3: null,
            id_m_report: null,
            id_c_centre: null,
            id_plant: null,
            id_allocation: null,
        }
    }

    const saveData = async () => {
        status_form.value
        if (forms.value.coa != null && forms.value.id_category3 != null && forms.value.id_m_report != null && forms.value.id_c_centre != null && forms.value.id_plant != null && forms.value.id_allocation != null) {
            if (status_form.value == 'add') {
                const response = await DebeConfig.addDebe(forms.value);
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
                const response = await DebeConfig.updateDebe(forms.value.id, forms.value);
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
        } else {
            messages.value = [
                { severity: 'warn', content: 'Mohon data diisi dengan lengkap', id: count.value++ }
            ];
        }
    }
</script>

<template>
    <div class="flex flex-column gap-3 w-full card shadow-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-full flex gap-2">
                <Button icon="pi pi-plus" severity="info" size="small" @click="formDatabase('add', null)"/>
            </div>
            <div class="p-inputgroup p-fluid">
                <span class="p-inputgroup-addon bg-white">
                    <i class="pi pi-search"></i>
                </span>
                <InputText type="text" placeholder="Search" class="w-full" v-model="filters['global'].value"/>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '80rem' }">
            <Divider/>
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex align-items-center gap-3">
                <div class="w-full">
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="coa" class="font-semibold">COA <small class="text-red-500">*</small></label>
                        <InputText id="coa" v-model="forms.coa" class="flex-auto" autocomplete="off" placeholder="00xxx"/>
                    </div>
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="category" class="font-semibold">Category 3 <small class="text-red-500">*</small></label>
                        <Dropdown id="category" v-model="forms.id_category3" :options="list_category" optionValue="id3" optionLabel="name3" placeholder="Category 3" filter checkmark :highlightOnSelect="false" class="flex-auto">
                            <template #header="slotProps">
                                <div v-if="slotProps.header" class="flex align-items-center gap-3">
                                    <span>{{ slotProps }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center gap-3">
                                    <strong class="text-sm">{{ slotProps.option.name3 }}</strong>
                                    <i class="pi pi-angle-double-right"/>
                                    <span>{{ slotProps.option.name2 }}</span>
                                    <i class="pi pi-angle-double-right"/>
                                    <span>{{ slotProps.option.name1 }}</span>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="report" class="font-semibold">Management Report <small class="text-red-500">*</small></label>
                        <Dropdown id="report" v-model="forms.id_m_report" :options="list_report" optionLabel="name" optionValue="id" placeholder="Management Report" filter checkmark :highlightOnSelect="false" class="flex-auto"/>
                    </div>
                </div>
                <div class="w-full">
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="cc" class="font-semibold">Cost Centre <small class="text-red-500">*</small></label>
                        <Dropdown id="cc" v-model="forms.id_c_centre" :options="list_centre" optionLabel="name" optionValue="id" placeholder="Cost Centre" filter checkmark :highlightOnSelect="false" class="flex-auto"/>
                    </div>
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="plant" class="font-semibold">Plant <small class="text-red-500">*</small></label>
                        <Dropdown id="plant" v-model="forms.id_plant" :options="list_plant" optionLabel="name" optionValue="id" placeholder="Plant" filter checkmark :highlightOnSelect="false" class="flex-auto"/>
                    </div>
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="allo" class="font-semibold">Allocation <small class="text-red-500">*</small></label>
                        <Dropdown id="allo" v-model="forms.id_allocation" :options="list_allocation" optionLabel="name" optionValue="id" placeholder="Cost Centre" filter checkmark :highlightOnSelect="false" class="flex-auto"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
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
        <DataTable v-else v-model:filters="filters" :value="products" paginator :rows="10" showGridlines=""  dataKey="id" scrollable scrollHeight="395px" :globalFilterFields="['coa', 'category3', 'category2', 'category1', 'c_centre', 'm_report', 'plant', 'allocation']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="coa" header="Chart of Account" sortable frozen style="min-width: 15rem">
                <template #body="{ data }">
                    <div class="flex w-full justify-content-between align-items-center">
                        <strong class="text-sm">{{ data.coa }}</strong>
                        <button @click="formDatabase('edit', data)" class="p-2 text-sm border-none border-round bg-transparent hover:bg-yellow-100 text-yellow-500"><i class="pi pi-pencil"></i></button>
                    </div>
                </template>
            </Column>
            <!-- <Column header="" frozen>
                <template #body="{ data }">
                    <div class="flex gap-3">
                    </div>
                </template>
            </Column> -->
            <Column field="category1" header="Category 1" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <small>{{ data.category1 }}</small>
                </template>
            </Column>
            <Column field="category2" header="Category 2" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <small>{{ data.category2 }}</small>
                </template>
            </Column>
            <Column field="category3" header="Category 3" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <small>{{ data.category3 }}</small>
                </template>
            </Column>
            <Column field="man_report" header="Management Report" style="min-width: 18rem" sortable>
                <template #body="{ data }">
                    <small>{{ data.m_report }}</small>
                </template>
            </Column>
            <Column field="cost_centre" header="Cost Centre" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <small>{{ data.c_centre }}</small>
                </template>
            </Column>
            <Column field="plant" header="Plant" style="min-width: 12rem">
                <template #body="{ data }">
                    <small>{{ data.plant }}</small>
                </template>
            </Column>
            <Column field="allocation" header="Allocation" style="min-width: 6rem">
                <template #body="{ data }">
                    <small>{{ data.allocation }}</small>
                </template>
            </Column>
        </DataTable>
    </div>
</template>