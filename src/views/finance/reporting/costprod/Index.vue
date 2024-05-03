<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {cost_prod} from '@/api/dummy/cost_prod.js'
    import ProductService from '@/service/ProductService';

    // VARIABLE
    const expandedRowGroups = ref();
    const products = ref();
    const total_biaya_produksi = ref();
    const total_cpo_olah = ref();
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
        let tot_biaya_produksi = 0;
        let tot_cpo_olah = 0;
        for (let i = 0; i < cost_prod.length; i++) {
            tot_biaya_produksi = tot_biaya_produksi + cost_prod[i].biaya_produksi;
            tot_cpo_olah = tot_cpo_olah + cost_prod[i].cpo_olah;
            products.value.push({
                uraian: cost_prod[i].uraian,
                detail: cost_prod[i].detail,
                biaya_produksi: cost_prod[i].biaya_produksi < 1 ? '-' : formatCurrency(cost_prod[i].biaya_produksi.toFixed(2)),
                cpo_olah: cost_prod[i].cpo_olah < 1 ? '-' : formatCurrency(cost_prod[i].cpo_olah.toFixed(2)),
            });
        }
        total_biaya_produksi.value = formatCurrency(tot_biaya_produksi.toFixed(2));
        total_cpo_olah.value = formatCurrency(tot_cpo_olah.toFixed(2));
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

    function formatCurrency(amount) {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return parts.join(',');
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

        <!-- Table -->
        <!-- <DataTable v-model:filters="filters" :value="products" showGridlines dataKey="id" scrollable :globalFilterFields="['name']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="uraian" header="Uraian" frozen style="background-color: blue;">
                <template #body="{ data }">
                    <strong class="text-sm">{{ data.uraian }}</strong>
                </template>
            </Column>
            <Column field="detail" header="Detail" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.detail }}
                </template>
            </Column>
            <Column field="biaya_produksi" header="Beban Produksi (Rp)" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.biaya_produksi }}
                </template>
            </Column>
            <Column field="cpo_olah" header="Rp / Kg CPO Olah" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.cpo_olah }}
                </template>
            </Column>
        </DataTable> -->

        <DataTable :value="products" v-model:expandedRowGroups="expandedRowGroups" v-model:filters="filters" :globalFilterFields="['uraian', 'detail', 'biaya_produksi', 'cpo_olah']" expandableRowGroups  rowGroupMode="subheader" groupRowsBy="uraian" sortMode="single" sortField="uraian" :sortOrder="1" tableStyle="min-width: 50rem">
            <Column field="uraian"></Column>
            <Column field="detail" style="min-width: 200px;">
                <template #header>
                    <div class="bg-green-500 text-white w-full border-round p-3">
                        <span>URAIAN</span>
                    </div>
                </template>
            </Column>
            <Column field="biaya_produksi" style="min-width: 200px">
                <template #header>
                    <div class="bg-green-500 text-white w-full border-round p-3">
                        <span>Biaya Produksi</span>
                    </div>
                </template>
            </Column>
            <Column field="cpo_olah" style="min-width: 200px">
                <template #header>
                    <div class="bg-green-500 text-white w-full border-round p-3">
                        <span>CPO Olah</span>
                    </div>
                </template>
            </Column>
            <template #groupheader="slotProps">
                <span class="vertical-align-text-top mx-2 font-bold line-height-3 uppercase text-sm">{{ slotProps.data.uraian }}</span>
            </template>
            <ColumnGroup type="footer">
                <Row>
                    <Column footer="Jumlah Beban Produksi:" footerStyle="text-align:right" />
                    <Column :footer="total_biaya_produksi" footerStyle="text-align:right" />
                    <Column :footer="total_cpo_olah" footerStyle="text-align:right" />
                </Row>
            </ColumnGroup>
        </DataTable>

    </div>
</template>