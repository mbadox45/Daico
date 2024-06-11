<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // Components
    import FormDialogDetAlloc from '@/views/finance/production/det_alloc/components/FormDialogDetAlloc.vue'

    // API
    import CategoryProdMaster from '@/api/master/CategoryProdMaster.js';
    import PlantMaster from '@/api/master/PlantMaster.js';
    import Laporan_Produksi from '@/api/det_alloc/Laporan_Produksi.js';

    // Variable
    // Table
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const list_category = ref([]);
    const list_production = ref([]);
    // Time
    const loadingTable = ref(false)
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const periods = ref('')
    const list_tahun = ref([]);
    const op = ref();
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const data_form = ref();
    const title_dialog = ref('');
    // Message Configure
    const messages = ref([]);
    let count = ref(0);
    const time = ref(3000)

    const route = useRoute();
    const router = useRouter();

    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
            periods.value = `${moment(dateString).format('MMMM')} ${tahun.value}`
    
            const list = await loadCategory()
            list_category.value = list;

            const prod = await loadReportProduction(dateString);
            // const loadProd = Object.entries(prod).map(([key, value]) => ({
            //     name: key,
            //     items: value
            // }));
            const loadProd = Object.entries(prod).map(([key, value]) => {
                const items = [];
                for (let i = 0; i < value.length; i++) {
                    if (value[i] && Object.keys(value[i])[0].startsWith('total ')) {
                        items[items.length - 1].totals = items[items.length - 1].totals || [];
                        items[items.length - 1].totals.push({
                            name: Object.keys(value[i])[0],
                            value: Object.values(value[i])[0]
                        });
                    } else {
                        items.push(value[i]);
                    }
                }
                return {
                    name: key,
                    items: items
                };
            });
            const list_prod = []
            for (let i = 0; i < loadProd.length; i++) {
                const items = loadProd[i].items;
                for (let j = 0; j < items.length; j++) {
                    if (items[j].plant != null ) {
                        if (items[j].id_plant == 1 || items[j].id_plant == 3) {
                            list_prod.push({
                                id: items[j].id,
                                id_plant: items[j].id_plant,
                                id_uraian: items[j].id_uraian,
                                tanggal: items[j].tanggal,
                                tgl: moment(items[j].tanggal).format('DD MMMM YYYY'),
                                plant: items[j].plant != null ? items[j].plant.nama : '-',
                                uraian: items[j].uraian != null ? items[j].uraian.nama : '-',
                                uraian: items[j].uraian != null ? items[j].uraian.nama : '-',
                                satuan: items[j].uraian != null ? items[j].uraian.satuan : '-',
                                id_category: items[j].uraian != null ? items[j].uraian.id_category : null,
                                kategori: items[j].uraian != null ? items[j].uraian.kategori.nama : '-',
                                value: items[j].value,
                                harga_satuan: items[j].harga_satuan == null ? 0 : items[j].harga_satuan.value,
                                finalValue: items[j].finalValue,
                                totals: items[j].totals,
                            })
                        } else {
                            continue ;
                        }
                    } else {
                        list_prod.push({
                            id: items[j].id,
                            id_plant: items[j].id_plant,
                            id_uraian: items[j].id_uraian,
                            tanggal: items[j].tanggal,
                            tgl: moment(items[j].tanggal).format('DD MMMM YYYY'),
                            plant: items[j].plant != null ? items[j].plant.nama : '-',
                            uraian: items[j].uraian != null ? items[j].uraian.nama : '-',
                            uraian: items[j].uraian != null ? items[j].uraian.nama : '-',
                            satuan: items[j].uraian != null ? items[j].uraian.satuan : '-',
                            id_category: items[j].uraian != null ? items[j].uraian.id_category : null,
                            kategori: items[j].uraian != null ? items[j].uraian.kategori.nama : '-',
                            value: items[j].value,
                            harga_satuan: items[j].harga_satuan == null ? 0 : items[j].harga_satuan.value,
                            finalValue: items[j].finalValue,
                            totals: items[j].totals,
                        })
                    }
                }
            }

            list_production.value = list_prod
            console.log(list_prod)
            console.log(loadProd)
            loadBulan()
            loadTahun()
            loadingTable.value = false
        } catch (error) {
            list_production.value = []
            loadingTable.value = false
            loadBulan()
            loadTahun()
        }
    }

    const formData = (cond, data) => {
        if (cond == 'add') {
            router.push('/form-det-alloc')
        } else {
            visible.value = true;
        }
        messages.value = [];
        status_form.value = cond;
        console.log(cond)
        data_form.value = data;
        title_dialog.value = cond == 'add' ? 'Laporan Produksi - Tambah Data' : cond == 'edit' ? 'Laporan Produksi - Edit Data' : 'Laporan Produksi - Hapus Data' ;
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

    const loadReportProduction = async(tgl) => {
        try {
            const response = await Laporan_Produksi.getByDate({tanggal:tgl});
            const load = response.data;
            const data = load.data;
            return data;
        } catch (error) {
            return null;
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

    const formatCurrency = (amount) =>  {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return parts.join(',');
    }

    const saveData = (ket) => {
        if (ket == 'sukses') {
            messages.value = [
                { severity: 'success', content: 'Data berhasil disimpan', id: count.value++ }
            ];
            setTimeout(function() {
                loadData()
                visible.value = false
            }, time.value);
        } else if (ket == 'sudah_ada') {
            messages.value = [
                { severity: 'warn', content: 'Data bulan tersebut sudah tersedia', id: count.value++ }
            ];
            setTimeout(function() {
                loadData()
                visible.value = false
            }, time.value);
        } else if (ket == 'gagal') {
            messages.value = [
                { severity: 'warn', content: 'Mohon data diisi dengan lengkap', id: count.value++ }
            ];
        } else if (ket == 'error') {
            messages.value = [
                { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
            ];
        } else {
            visible.value = false
        }
    }

</script>

<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-3 flex gap-2">
                <div class="p-inputgroup p-fluid">
                    <Button icon="pi pi-plus" severity="info" size="small" @click="formData('add', null)"/>
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

        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '70rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <form-dialog-det-alloc :status_request="status_form" :data_dialog="data_form" @submit="saveData"/>
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
        <DataTable v-else v-model:filters="filters" :value="list_production" scrollable scrollHeight="450px" showGridlines rowGroupMode="subheader" groupRowsBy="kategori" sortField="id_category" sortMode="single" :sortOrder="1" dataKey="id" :globalFilterFields="['uraian', 'kategori', 'tgl', 'plant']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="kategori"></Column>
            <Column field="nama" style="min-width: 200px" sortable>
                <template #header>
                    <div class="w-full flex justify-content-center font-bold uppercase">
                        <span class="text-sm">Uraian</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex align-items-center justify-content-between gap-2 font-medium text-xs">
                        <span>{{data.uraian}}</span>
                        <Button icon="pi pi-pencil" size="small" severity="warning" class="p-1" text @click="formData('edit', data)"/>
                    </div>
                </template>
            </Column>
            <Column field="tanggal" style="min-width: 100px" sortable>
                <template #header>
                    <div class="w-full flex justify-content-center font-bold uppercase">
                        <span class="text-sm">Tanggal</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex align-items-center justify-content-center gap-2 font-medium text-xs">
                        <span>{{data.tgl}}</span>
                    </div>
                </template>
            </Column>
            <Column field="satuan" style="min-width: 6rem;">
                <template #header>
                    <div class="w-full flex justify-content-center font-bold">
                        <span class="text-sm">UoM</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex justify-content-center font-medium text-xs">
                        <span>{{data.satuan}}</span>
                    </div>
                </template>
            </Column>
            <Column field="test">
                <template #header>
                    <div class="w-full flex justify-content-center font-bold uppercase">
                        <span class="text-sm">Plant</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex justify-content-center font-medium text-xs">
                        <span>{{data.plant}}</span>
                    </div>
                </template>
            </Column>
            <Column field="test">
                <template #header>
                    <div class="w-full flex justify-content-center font-bold uppercase">
                        <span class="text-sm">Harga</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex justify-content-end font-medium text-xs">
                        <span>Rp. {{formatCurrency(Number(data.harga_satuan).toFixed(2))}}</span>
                    </div>
                </template>
            </Column>
            <Column field="test">
                <template #header>
                    <div class="w-full flex justify-content-center font-bold uppercase">
                        <span class="text-sm">Qty</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex justify-content-end font-medium text-xs">
                        <span>{{Number(data.value) == 0 ? null : formatCurrency(Number(data.value).toFixed(2))}}</span>
                    </div>
                </template>
            </Column>
            <Column field="test" >
                <template #header>
                    <div class="w-full flex justify-content-center font-bold uppercase">
                        <span class="text-sm">Total</span>
                    </div>
                </template>
                <template #body="{data}">
                    <div class="w-full flex justify-content-end font-medium text-xs">
                        <span>{{Number(data.value) == 0 ? '-' : formatCurrency(Number(data.finalValue).toFixed(2))}}</span>
                    </div>
                </template>
            </Column>
            <template #groupheader="{data}">
                <div class="flex align-items-center gap-2">
                    <span class="font-bold text-sm uppercase">{{ data.kategori }}</span>
                </div>
            </template>
        </DataTable>

    </div>
</template>