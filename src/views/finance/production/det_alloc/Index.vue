<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API
    import CategoryProdMaster from '@/api/master/CategoryProdMaster.js';
    import PlantMaster from '@/api/master/PlantMaster.js';

    // Variable
    // Table
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const list_category = ref([]);
    // Time
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const periods = ref('')
    const list_tahun = ref([]);
    const op = ref();

    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
        periods.value = `${moment(dateString).format('MMMM')} ${tahun.value}`

        const list = await loadCategory()
        list_category.value = list;
        console.log(list);
        loadBulan()
        loadTahun()
    }

    const loadCategory = async() => {
        try {
            const response = await CategoryProdMaster.getAll();
            const load = response.data;
            const data = load.data;
            const list = [];
            for (let i = 0; i < data.length; i++) {
                const uraian = data[i].uraian;
                for (let u = 0; u < uraian.length; u++) {
                    list.push({
                        id: uraian[u].id,
                        id_category: uraian[u].id_category,
                        nama_category: data[i].nama,
                        nama: uraian[u].nama,
                        satuan: uraian[u].satuan,
                        value: 0
                    })
                }
            }
            return list;
        } catch (error) {
            return null;
        }
    }

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

    const opByPeriod = (event) => {
        op.value.toggle(event);
    }

    const loadByPeriod = () => {
        op.value.toggle();
        loadData()
    }

</script>

<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-3 flex gap-2">
                <div class="p-inputgroup p-fluid">
                    <Button icon="pi pi-plus" severity="info" size="small"/>
                    <Button icon="pi pi-calendar" severity="secondary" size="small" @click="opByPeriod"/>
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
                    <span class="p-inputgroup-addon bg-white w-full justify-content-end">
                        <small class="font-medium text-cyan-700">{{ periods }}</small>
                    </span>
                </div>
            </div>
            <div class="w-4">
                <!-- <span>Periode : {{ periods }}</span> -->
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

        <!-- Table -->
        <!-- <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div> -->
        <DataTable v-model:filters="filters" :value="list_category" showGridlines rowGroupMode="subheader" groupRowsBy="nama_category" sortField="id" sortMode="single" :sortOrder="1" dataKey="id" :globalFilterFields="['uraian']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="nama_category" header="Uraian"></Column>
            <Column field="nama" style="min-width: 200px">
                <template #header>
                    <div class="w-full flex justify-content-center font-bold uppercase">
                        <span>Uraian</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex justify-content-start font-medium text-sm">
                        <span>{{data.nama}}</span>
                    </div>
                </template>
            </Column>
            <Column field="satuan">
                <template #header>
                    <div class="w-full flex justify-content-center font-bold">
                        <span>UoM</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex justify-content-center font-medium text-sm">
                        <span>{{data.satuan}}</span>
                    </div>
                </template>
            </Column>
            <Column field="test">
                <template #header>
                    <div class="w-full flex justify-content-center font-bold uppercase">
                        <span>Plant</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex justify-content-center font-medium text-sm">
                        <span>{{data.test}}</span>
                    </div>
                </template>
            </Column>
            <Column field="test" style="min-width: 200px">
                <template #header>
                    <div class="w-full flex justify-content-center font-bold uppercase">
                        <span>Value</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex justify-content-end font-medium text-sm">
                        <span>{{data.value}}</span>
                    </div>
                </template>
            </Column>
            <template #groupheader="{data}">
                <div class="flex align-items-center gap-2">
                    <span class="font-bold text-lg uppercase">{{ data.nama_category }}</span>
                </div>
            </template>
        </DataTable>

    </div>
</template>