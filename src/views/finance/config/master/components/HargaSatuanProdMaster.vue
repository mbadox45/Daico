<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {formatCurrency} from '@/views/load_data/func_dummy.js';
    import {loadCategory} from '@/views/load_data/master_config.js'
    import HargaSatuanProdMaster from '@/api/master/HargaSatuanProdMaster.js';

    // VARIABLE
    const searchKeyword = ref('');
    const products = ref([]);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const forms = ref({
        id_category: null,
        id_uraian_produksi: null,
        value: null,
    })
    const loadingTable = ref(false)
    const list_category = ref([]);
    const list_uraian = ref([])
    
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

    const filteredList = computed(() => {
        return products.value.filter(item =>
            item.nama.toLowerCase().includes(searchKeyword.value.toLowerCase())
        );
    });

    const loadData = async() => {
        try {
            loadingTable.value = true
            products.value = [];
            const response = await HargaSatuanProdMaster.getLatest({nama:'Alloc11'})
            const load = response.data;
            // console.log(load)
            const data = load.data;
            for (let a = 0; a < data.length; a++) {
                const uraian = data[a].uraian
                products.value.push({
                    id:data[a].id,
                    nama:uraian == null ? '-' : uraian.nama,
                    satuan:uraian == null ? '-' : uraian.satuan,
                    value:data[a].value,
                    id_uraian_produksi:data[a].id_uraian_produksi,
                    updated_at:data[a].updated_at,
                    created_at:data[a].created_at,
                })
            }
            loadingTable.value = false
        } catch (error) {
            products.value = []
            loadingTable.value = false
        }
    }

    const formDatabase = async(cond, data) => {
        messages.value = []
        visible.value = true
        status_form.value = cond;
        const category = await loadCategory();
        if (category != null) {
            list_category.value = category;
        } else {
            list_category.value = [];
        }
        title_dialog.value = cond == 'add' ? 'Satuan Harga - Tambah Data' : cond == 'edit' ? 'Satuan Harga - Edit Data' : 'Satuan Harga - Hapus Data' ;
        if (cond == 'add') {
            resetForm()
        } else {
            forms.value = {
                id_category: data.id_category,
                id_uraian_produksi: data.id_uraian_produksi,
                value: data.value,
            }
        }
    }

    const loadListCategory = async() => {
        const load_category = await loadCategory();
        const list = []
        if (load_category != null && forms.value.id_category != null) {
            const load = load_category.find(item => item.id == forms.value.id_category)
            const uraian = load.uraian;
            for (let i = 0; i < uraian.length; i++) {
                list.push({
                    id: uraian[i].id,
                    nama: uraian[i].nama + ' - ' + uraian[i].satuan,
                    satuan: uraian[i].satuan,
                    id_category: uraian[i].id_category,
                    category: load.nama,
                })
            }
        }
        list_uraian.value = list
    }

    const resetForm = () => {
        forms.value = {
            id_category: null,
            id_uraian_produksi: null,
            value: null,
        }
    }

    const saveData = async () => {
        status_form.value
        if (forms.value.nama != null) {
            if (status_form.value == 'add') {
                const response = await HargaSatuanProdMaster.addPost(forms.value);
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
                const response = await HargaSatuanProdMaster.updatePost(forms.value.id, forms.value);
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
    <div class="flex-auto flex flex-column gap-3 p-3 bg-white shadow-3">
        <span class="font-medium text-xl">Data Satuan Harga Produksi</span>
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
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '50rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex flex-column gap-1">
                <label for="username" class="font-semibold">Category <small class="text-red-500">*</small></label>
                <Dropdown v-model="forms.id_category" filter :options="list_category" optionLabel="nama" optionValue="id" placeholder="Select a Category" class="w-full" @change="loadListCategory"/>
            </div>
            <div class="flex justify-content-between gap-4 mt-4">
                <div class="flex flex-column gap-1 w-full">
                    <label for="username" class="font-semibold">Uraian <small class="text-red-500">*</small></label>
                    <Dropdown v-model="forms.id_uraian_produksi" filter :options="list_uraian" optionLabel="nama" optionValue="id" placeholder="Select a Uraian" class="w-full"/>
                </div>
                <div class="flex flex-column gap-1 w-full">
                    <label for="username" class="font-semibold">Harga <small class="text-red-500">*</small></label>
                    <InputNumber id="dmo" v-model="forms.value" class="w-full" placeholder="Qty" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" />
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
        <DataTable v-else v-model:filters="filters" showGridlines :value="products" dataKey="id" scrollable scrollHeight="380px" :globalFilterFields="['nama','value']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <template #groupheader="{data}">
                <div class="flex align-items-center gap-2">
                    <span class="font-bold text-sm uppercase">{{ data.nama }}</span>
                </div>
            </template>
            <Column field="id_uraian_produksi" style="min-width: 8rem;">
                <template #header>
                    <span class="text-sm font-bold uppercase">uraian</span>
                </template>
                <template #body="{ data }">
                    <span class="font-medium text-sm">{{ data.nama }}</span>
                </template>
            </Column>
            <Column field="value" style="min-width: 8rem;">
                <template #header>
                    <span class="text-sm font-bold uppercase flex justify-content-center w-full">Value</span>
                </template>
                <template #body="{ data }">
                    <span class="font-medium text-sm flex justify-content-end gap-2">Rp. {{ formatCurrency(Number(data.value).toFixed(2)) }}</span>
                </template>
            </Column>
            <Column field="updated_at" style="min-width: 8rem;">
                <template #header>
                    <span class="text-sm font-bold uppercase flex justify-content-end w-full">Updated At</span>
                </template>
                <template #body="{ data }">
                    <span class="font-light text-sm flex justify-content-end gap-2 align-items-center"><i class="pi pi-calendar"></i> <span>{{ moment(data.updated_at).format('DD MMMM YYYY') }}</span> <i class="pi pi-clock"></i> <span>{{ moment(data.updated_at).format('HH:mm:ss') }}</span></span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>