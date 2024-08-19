<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import {loadBebanProduksi_CostProdController, laporanBebanProduksi_CostProdController} from '@/controller/production/CostProdController.js'

    // VARIABLE
    const products = ref([]);
    const total_biaya_produksi = ref(0);
    const total_cpo_olah = ref(0);
    const loadingTable = ref(false);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});

    // Period Setting
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const tgls = ref(moment().format('DD'))
    const periods = ref(moment(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tgls.value}`).format('MMMM YYYY'))
    const list_tahun = ref([]);
    const op = ref();

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadTahun();
        loadBulan();
        loadingTable.value = true
        // const dateString = `2024-05-01`;
        const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tgls.value}`;
        periods.value = moment(dateString).format('MMMM YYYY')
        const response = await loadBebanProduksi_CostProdController(dateString)
        const loadTable = await laporanBebanProduksi_CostProdController(response)
        console.log(response)
        console.log(loadTable)
        let tot_biaya = 0, tot_cpo = 0;
        if (response != null) {
            for (let i = 0; i < response.length; i++) {
                tot_biaya += response[i].result == null ? 0 : response[i].result;
                tot_cpo += response[i].rp_per_kg_cpo_olah == null ? 0 : response[i].rp_per_kg_cpo_olah;
            }
        }
        total_biaya_produksi.value = tot_biaya
        total_cpo_olah.value = tot_cpo
        products.value = loadTable
        loadingTable.value = false

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
                    <Button label="Select by Period" icon="pi pi-calendar" outlined severity="secondary" size="small" @click="opByPeriod"/>
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
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <DataTable v-else v-model:filters="filters" :value="products" showGridlines dataKey="id" scrollable scrollHeight="470px" :globalFilterFields="['name', 'biaya', 'cpo_olah']">
            <template #empty> No cost production found. </template>
            <template #loading> Loading cost production data. Please wait. </template>
            <Column field="name" header="Uraian" frozen style="width: 60%">
                <template #body="{ data }">
                    <strong class="text-sm font-medium">{{ data.name }}</strong>
                </template>
            </Column>
            <Column field="biaya_produksi" header="Beban Produksi (Rp)" style="width: 25%">
                <template #body="{ data }">
                    <div class="w-full text-right">
                        {{ data.biaya == null ? '0,00' : formatCurrency(Number(data.biaya).toFixed(2)) }}
                    </div>
                </template>
            </Column>
            <Column field="cpo_olah" header="Rp / Kg CPO Olah" style="width: 15%">
                <template #body="{ data }">
                    <div class="w-full text-right">
                        {{ data.cpo_olah == null ? '0,00' : formatCurrency(Number(data.cpo_olah).toFixed(2))}}
                    </div>
                </template>
            </Column>
            <ColumnGroup type="footer">
                <Row>
                    <Column footer="Jumlah Beban Produksi:" footerStyle="text-align:right" />
                    <Column :footer="formatCurrency(Number(total_biaya_produksi).toFixed(2))" footerStyle="text-align:right" />
                    <Column :footer="formatCurrency(Number(total_cpo_olah).toFixed(2))" footerStyle="text-align:right" />
                </Row>
            </ColumnGroup>
        </DataTable>

    </div>
</template>