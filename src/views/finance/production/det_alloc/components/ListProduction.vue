<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';
    import { useToast } from "primevue/usetoast";
    import { useRouter, useRoute } from 'vue-router';

    // Components
    import FormDialogDetAlloc from '@/views/finance/production/det_alloc/components/FormDialogDetAlloc.vue'
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import { cek_token } from "@/api/DataVariable.js";
    import { URL_WEB } from '@/api/DataVariable';
    
    // Variable
    const props = defineProps({
        datas:{
            type:Array,
            default: () => {}
        }
    });

    // Table
    const expandedRows = ref([]);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const searchKeyword = ref('');
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

    const filteredList = computed(() => {        
        return list_production.value.filter(items => items.nama.toLowerCase().includes(searchKeyword.value.toLowerCase()));
    });

    const loadData = async() => {
        loadingTable.value = true
        try {    
            const response = props.datas;
            const list = []
            if (response != null) {
                for (let i = 0; i < response.length; i++) {
                    list.push({
                        id: response[i].id,
                        nama: response[i].nama,
                        uraian: response[i].uraian,
                    })
                }
            }
            list_production.value = list
            loadingTable.value = false
        } catch (error) {
            list_production.value = []
            loadingTable.value = false
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

    const saveData = (ket) => {
        if (ket == 'sukses') {
            messages.value = [
                { severity: 'success', content: 'Data berhasil disimpan', id: count.value++ }
            ];
            setTimeout(function() {
                window.location.replace(`${URL_WEB}det-alloc`);
                // loadData()
                visible.value = false
            }, time.value);
        } else if (ket == 'sudah_ada') {
            messages.value = [
                { severity: 'warn', content: 'Data bulan tersebut sudah tersedia', id: count.value++ }
            ];
            setTimeout(function() {
                window.location.replace(`${URL_WEB}det-alloc`);
                // loadData()
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
    <div class="flex flex-column gap-4">
        <div class="flex md:flex-row flex-column md:justify-content-between md:align-items-center gap-5">
            <div class="md:w-auto w-full flex gap-2">
                <span class="font-bold text-2xl font-italic w-full">List Data Produksi</span>
            </div>
            <div class="md:w-4 w-full">
                <div class="p-inputgroup p-fluid">
                    <Button v-if="cek_token != null" icon="pi pi-plus" severity="info" size="small" @click="formData('add', null)"/>
                    <span class="p-inputgroup-addon bg-white">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText v-model="searchKeyword" placeholder="Search"/>
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
        <div v-else class="flex flex-column">
            <div class="w-full text-center" v-if="filteredList.length < 1">
                <span>-- Data not found-- </span>
            </div>
            <DataView v-else :value="filteredList" :layout="'list'" :paginator="true" :rows="5">
                <template #list="{data}">
                    <div class="col-12 flex flex-column gap-3 border-1 border-round border-gray-300 p-3 my-2">
                        <div class="flex w-full">
                            <div class="flex align-items-center w-full">
                                <div class="flex-1 text-center md:text-left">
                                    <div class="font-semibold uppercase text-2xl">{{ data.nama }}</div>
                                </div>
                            </div>
                            <!--<div class="p-inputgroup p-fluid">
                                <span class="p-inputgroup-addon bg-white">
                                    <i class="pi pi-search"></i>
                                </span>
                                <InputText v-model="filters['global'].value" placeholder="Search"/>
                            </div>-->
                        </div>
                        <DataTable v-model:filters="filters" v-model:expandedRows="expandedRows" :value="data.uraian" dataKey="id" :globalFilterFields="['nama', 'total_qty']">
                            <template #empty> No uraian production found. </template>
                            <template #loading> Loading uraian production data. Please wait. </template>
                            <Column expander style="width: 5rem" />
                            <Column field="nama" style="min-width: 200px">
                                <template #header>
                                    <div class="w-full flex justify-content-start font-bold uppercase">
                                        <span class="text-sm">Uraian</span>
                                    </div>
                                </template>
                                <template #body="{data}">
                                    <div class="w-full flex align-items-center justify-content-start gap-2 font-medium text-sm font-bold">
                                        <span class="text-cyan-600">{{data.nama}}</span>
                                    </div>
                                </template>
                            </Column>
                            <Column field="nama" style="min-width: 200px">
                                <template #header>
                                    <div class="w-full flex justify-content-end font-bold uppercase">
                                        <span class="text-sm">Total QTY</span>
                                    </div>
                                </template>
                                <template #body="{data}">
                                    <div class="w-full flex align-items-center justify-content-end gap-2 font-medium text-sm font-bold">
                                        <span>{{formatCurrency(Number(data.total_qty).toFixed(2))}} <span class="text-teal-600">{{ data.satuan }}</span></span>
                                    </div>
                                </template>
                            </Column>
                            <template #expansion="{ data }">
                                <div class="px-4">
                                    <DataTable :value="data.items" dataKey="id" showGridlines paginator :rows="5">
                                        <template #empty> No items production found. </template>
                                        <template #loading> Loading items production data. Please wait. </template>
                                        <Column field="value" v-if="cek_token != null">
                                            <template #body="{data}">
                                                <div class="w-auto flex align-items-center justify-content-center font-medium text-xs">
                                                    <Button icon="pi pi-pencil" size="small" severity="warning" text class="py-0" @click="formData('edit', data)"/>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column field="tanggal" style="min-width: 200px" sortable>
                                            <template #header>
                                                <div class="w-full flex justify-content-center font-bold uppercase">
                                                    <small class="text-sm">Tanggal</small>
                                                </div>
                                            </template>
                                            <template #body="{data}">
                                                <div class="w-full flex align-items-center justify-content-center gap-2 font-medium text-xs">
                                                    <span>{{moment(data.tanggal).format('DD MMMM YYYY')}}</span>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column field="plant" style="min-width: 200px">
                                            <template #header>
                                                <div class="w-full flex justify-content-center font-bold uppercase">
                                                    <small class="text-sm">Plant</small>
                                                </div>
                                            </template>
                                            <template #body="{data}">
                                                <div class="w-full flex align-items-center justify-content-center gap-2 font-medium text-xs">
                                                    <span>{{ data.plant != null ? data.plant.nama : '-'}}</span>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column field="value" style="min-width: 200px" sortable>
                                            <template #header>
                                                <div class="w-full flex justify-content-end font-bold uppercase">
                                                    <small class="text-sm">Qty</small>
                                                </div>
                                            </template>
                                            <template #body="{data}">
                                                <div class="w-full flex align-items-center justify-content-end gap-2 font-medium text-xs">
                                                    <span>{{formatCurrency(Number(data.value))}}</span>
                                                </div>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </template>
            </DataView>
        </div>
    </div>
</template>