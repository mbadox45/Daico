<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {loadDataAll} from '@/views/load_data/cost_prod.js';
    import {cost_prod} from '@/api/dummy/cost_prod.js'
    import GlConfig from '@/api/configuration/GlConfig.js';
    import {uraianBebanProduksi} from '@/api/DummyData.js';
    import CategoryMaster from '@/api/master/CategoryMaster.js';

    // VARIABLE
    const list_gl = ref();
    const products = ref([]);
    const total_biaya_produksi = ref();
    const total_cpo_olah = ref();
    const list_category = ref([])
    const loadingTable = ref(false);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const periods = ref('')
    const list_tahun = ref([]);
    const op = ref();
    
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const title_dialog = ref('');


    // Function ===================================================================================================================================================
    onMounted(() => {
        loadCategory()
        loadDataGL()

        // loadData()
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

    const loadDataGL = async() => {
        try {
            loadingTable.value = true
            const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
            // const dateString = `2024-03-01`;
            periods.value = `${moment(bulan.value.toString().padStart(2, '0')).format('MMM')} ${tahun.value}`

            const response = await GlConfig.getByDate({tanggal:dateString})
            const load = response.data;

            // Data
            const data = load.data;
            list_gl.value = []
            const cat = list_category.value;
            let category2;
            for (let i = 0; i < data.length; i++) {
                category2 = data[i].debe == null ? null :  data[i].debe.cat3 == null ? null : cat.find(item => item.id3 == data[i].debe.cat3.id && item.id2 == data[i].debe.cat3.id_category2)
                list_gl.value.push({
                    coa: data[i].account_account == null ? '' : data[i].account_account.code,
                    no_transaksi: data[i].move_name,
                    uraian: data[i].name,
                    debet: Number(data[i].debit),
                    kredit: Number(data[i].credit),
                    date: moment(data[i].date).format('DD MMM YYYY'),
                    cat1: category2 == null ? '-': category2.name1,
                    cat2: category2 == null ? '-': category2.name2,
                    cat3: data[i].debe == null ? '' : data[i].debe.cat3 == null ? '-' :  data[i].debe.cat3.nama,
                    laporan_management: data[i].debe == null ? '' : data[i].debe.m_report == null ? '-' : data[i].debe.m_report.nama,
                    cost_centre: data[i].debe == null ? '' : data[i].debe.c_centre == null ? '-' : data[i].debe.c_centre.nama,
                    plan: data[i].debe == null ? '' : data[i].debe.plant == null ? '-' : data[i].debe.plant.nama,
                    allocation: data[i].debe == null ? '' : data[i].debe.allocation == null ? '-' : data[i].debe.allocation.nama,
                    journal: data[i].move_name + " ("+ data[i].ref + ")",
                    account: data[i].account_account == null ? '' : data[i].account_account.code + ' ' + data[i].account_account.name,
                    reference: data[i].ref,
                });
            }

            loadingTable.value = false
            loadData()
        } catch (error) {
            loadingTable.value = false
            list_gl.value = []
        }
        
    }

    // const loadData = async() => {
    //     loadingTable.value = true
    //     const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
    //     periods.value = `${moment(bulan.value.toString().padStart(2, '0')).format('MMM')} ${tahun.value}`
    //     products.value = await loadDataAll(dateString)
    //     loadingTable.value = false

    //     loadTahun();
    //     loadBulan();
    // }

    const loadData = async() => {
        products.value = []
        let tot_biaya_produksi = 0;
        let tot_cpo_olah = 0;
        console.log(list_gl.value)
        let uraian;
        const gl = list_gl.value;
        let value_gl;
        for (let i = 0; i < uraianBebanProduksi.length; i++) {
            
            // Find Data GL by Laporan Management
            value_gl = gl.filter(item => item.laporan_management.toLowerCase() == uraianBebanProduksi[i].name.toLowerCase())
            console.log(value_gl)
            let debet = 0;
            let kredit = 0;
            if (value_gl.length > 0) {
                for (let a = 0; a < value_gl.length; a++) {
                    debet = debet + value_gl[a].debet
                    kredit = kredit + value_gl[a].kredit
                }
            }
            
            // List DataTable
            if (i > 11 && i < 21) {
                uraian = '- ' + uraianBebanProduksi[i].name
            } else {
                uraian = uraianBebanProduksi[i].name
            }
            products.value.push({
                uraian: uraian,
                biaya_produksi: i == 11 ? null : formatCurrency((debet - kredit).toFixed(2)),
                cpo_olah: i == 11 ? null : formatCurrency(0),
            });

            tot_biaya_produksi = tot_biaya_produksi + (debet - kredit);
            tot_cpo_olah = 0;
        }
        total_biaya_produksi.value = formatCurrency(tot_biaya_produksi.toFixed(2));
        total_cpo_olah.value = formatCurrency(tot_cpo_olah);
        loadTahun();
        loadBulan();
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

    const opByPeriod = (event) => {
        op.value.toggle(event);
    }

    const loadByPeriod = () => {
        op.value.toggle();
        loadData()
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
        <DataTable v-else v-model:filters="filters" :value="products" showGridlines dataKey="id" scrollable scrollHeight="450px" :globalFilterFields="['uraian']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="uraian" header="Uraian" frozen style="width: 60%">
                <template #body="{ data }">
                    <strong class="text-sm font-medium">{{ data.uraian }}</strong>
                </template>
            </Column>
            <Column field="biaya_produksi" header="Beban Produksi (Rp)" style="width: 25%">
                <template #body="{ data }">
                    <div class="w-full text-right">
                        {{ data.biaya_produksi }}
                    </div>
                </template>
            </Column>
            <Column field="cpo_olah" header="Rp / Kg CPO Olah" style="width: 15%">
                <template #body="{ data }">
                    <div class="w-full text-right">
                        {{ data.cpo_olah }}
                    </div>
                </template>
            </Column>
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