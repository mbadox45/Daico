<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {db} from '@/api/dummy/database.js'

    // VARIABLE
    const products = ref();
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const list_tahun = ref([]);
    const op = ref();
    
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const title_dialog = ref('');


    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadBulan = () => {
        list_bulan.value = []
        if (tahun.value >= Number(moment().format('yyyy'))) {
            const month = Number(moment().format('M'))
            for (let i = 1; i <= month; i++) {
                const dateString = `2024-${i.toString().padStart(2, '0')}-01`;
                const monthName = moment(dateString, 'YYYY-MM-DD').format('MMMM');
                list_bulan.value.push({ id: i, name: monthName });
            }
        } else {
            for (let i = 1; i <= 12; i++) {
                const dateString = `2024-${i.toString().padStart(2, '0')}-01`;
                const monthName = moment(dateString, 'YYYY-MM-DD').format('MMMM');
                list_bulan.value.push({ id: i, name: monthName });
            }
        }
    }

    const loadTahun = () => {
        const year = Number(moment().format('yyyy'))
        list_tahun.value = []
        for (let i = 2020; i <= year; i++) {
            list_tahun.value.push({ id: i, name: i });
        }
    }

    const loadData = async() => {
        products.value = []
        for (let i = 0; i < db.length; i++) {
            products.value.push({id: db[i].id, coa:db[i].coa, category1:db[i].category1, category2:db[i].category2, category3:db[i].category3, man_report:db[i].man_report, cost_centre:db[i].cost_centre, plant:db[i].plant, allocation:'-'});
        }
        loadTahun();
        loadBulan();
    }

    const formDatabase = (cond, data) => {
        visible.value = true
        status_form.value = cond;
        title_dialog.value = cond == 'add' ? 'Tambah Data' : cond == 'edit' ? 'Edit Data' : 'Hapus Data' ;
    }

    const opByPeriod = (event) => {
        op.value.toggle(event);
    }

    const loadByPeriod = () => {
        op.value.toggle();
    }
</script>

<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-3 flex gap-2">
                <Button icon="pi pi-plus" severity="info" size="small" @click="formDatabase('add', null)"/>
                <Button label="Select by Period" outlined severity="secondary" size="small" @click="opByPeriod"/>
                <OverlayPanel ref="op" :style="{ width: '25rem' }">
                    <div class="flex flex-column gap-3">
                        <span class="font-light text-sm">Please select a period</span>
                        <div class="p-inputgroup p-fluid">
                            <span class="p-inputgroup-addon bg-white">
                                <i class="pi pi-calendar"></i>
                            </span>
                            <Dropdown v-model="tahun" :options="list_tahun" optionLabel="name" optionValue="id" placeholder="Tahun" @change="loadBulan" checkmark :highlightOnSelect="false" class="w-full" />
                            <Dropdown v-model="bulan" :options="list_bulan" optionLabel="name" optionValue="id" placeholder="Bulan" checkmark :highlightOnSelect="false" class="w-full" />
                        </div>
                        <Button icon="pi pi-check" label="Submit" severity="success" class="w-auto" @click="loadByPeriod"/>
                    </div>
                </OverlayPanel>
            </div>
            <div class="w-4">
            </div>
            <div class="w-3">
                <div class="p-inputgroup p-fluid">
                    <span class="p-inputgroup-addon bg-white">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText v-model="filters['global'].value" placeholder="Search"/>
                </div>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '50rem' }">
            <span class="p-text-secondary block mb-5">Update your information.</span>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="username" class="font-semibold w-6rem">Username</label>
                <InputText id="username" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="email" class="font-semibold w-6rem">Email</label>
                <InputText id="email" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="visible = false"></Button>
            </div>
        </Dialog>

        <!-- Table -->
        <DataTable v-model:filters="filters" :value="products" paginator :rows="10" dataKey="id" scrollable :globalFilterFields="['coa', 'category1']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="coa" header="Chart of Account" frozen style="min-width: 12rem">
                <template #body="{ data }">
                    <strong class="text-sm">{{ data.coa }}</strong>
                </template>
            </Column>
            <Column header="" frozen>
                <template #body="{ data }">
                    <div class="flex gap-3">
                        <button @click="formDatabase('edit', data)" class="p-2 text-sm border-none border-round text-yellow-500"><i class="pi pi-pencil"></i></button>
                        <button @click="formDatabase('delete', data)" class="p-2 text-sm border-none border-round text-pink-500"><i class="pi pi-trash"></i></button>
                    </div>
                </template>
            </Column>
            <Column field="category1" header="Category 1" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.category1 }}
                </template>
            </Column>
            <Column field="category2" header="Category 2" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.category2 }}
                </template>
            </Column>
            <Column field="category3" header="Category 3" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.category3 }}
                </template>
            </Column>
            <Column field="man_report" header="Management Report" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.man_report }}
                </template>
            </Column>
            <Column field="cost_centre" header="Cost Centre" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cost_centre }}
                </template>
            </Column>
            <Column field="plant" header="Plant" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.plant }}
                </template>
            </Column>
            <Column field="allocation" header="Allocation" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.allocation }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>