<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';

    // API
    import {loadCategory, loadPlant} from '@/views/load_data/master_config.js'
    import Laporan_Produksi from '@/api/det_alloc/Laporan_Produksi.js';
    import { postData_DetAllocController } from '@/controller/production/DetAllocController.js'
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

    // Variable
    const tgl_now = ref(moment().format('YYYY-MM'))
    const form_category = ref(null)
    const form_tgl = ref(moment().format('YYYY-MM-DD'))
    const forms = ref([{
        id: null,
        id_plant: null,
        satuan: null,
        id_uraian: null,
        value: null,
    }])
    const list_category = ref([])
    const list_plant = ref([])
    const list_uraian = ref([])
    const loadingTable = ref(false)
    const loadingSubmit = ref(false)
    const time = ref(3000)
    const toast_show = ref(true)

    onMounted(()=>{
        loadData();
    })

    const loadData = async() => {
        loadingTable.value = true
        try {
            const category = await loadCategory();
            const plant = await loadPlant();
            // console.log(category, plant)
            if (category != null) {
                list_category.value = category;
            } else {
                list_category.value = [];
            }
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
        }
        activeToast()
    }

    const activeToast = () => {
        toast_show.value = true
        toast.add({ severity: 'warn', summary: `Pastikan data `, group: 'bc' });
    }

    const loadFormList = async() => {
        loadingTable.value = true;
        loadingSubmit.value = true;
        list_uraian.value = await loadListCategory();
        list_plant.value = await loadPlant();
        const uraian = list_uraian.value;
        const plant = list_plant.value;
        forms.value = []
        for (let i = 0; i < uraian.length; i++) {
            if (uraian[i].id_category == 7 || uraian[i].id_category == 8 || uraian[i].id_category == 9 || uraian[i].id_category == 10 || uraian[i].satuan == 'Hari' ) {
                forms.value.push({
                    id: null,
                    id_plant: null,
                    id_uraian: uraian[i].id,
                    value: null,
                })
            } else if (uraian[i].id == 47 || uraian[i].id == 48 || uraian[i].id == 51 || uraian[i].id == 55) {
                forms.value.push({
                    id: null,
                    id_plant: null,
                    id_uraian: uraian[i].id,
                    value: null,
                })
            } else {
                for (let j = 0; j < plant.length; j++) {
                    forms.value.push({
                        id: null,
                        id_plant: plant[j].id,
                        id_uraian: uraian[i].id,
                        value: null,
                    })
                }
            }
        }
        loadingSubmit.value = false;
        loadingTable.value = false;
    }

    const loadListCategory = async() => {
        const load_category = await loadCategory();
        const list = []
        console.log(form_category.value)
        if (load_category != null && form_category.value != null) {
            const load = load_category.find(item => item.id == form_category.value)
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
        return list
    }

    const postDetAlloc = async(form) => {
        try {
            const response = await Laporan_Produksi.addPost(form);
            const load = response.data;
            const status = load.success;
            const msg = 'data berhasil disimpan';
            return {status: status, msg: msg}
        } catch (error) {
            return {status: false, msg: 'error'}
        }
    }
    
    const postData = async() => {
        loadingTable.value = true;
        loadingSubmit.value = true;
        toast_show.value = false
        const response = await postData_DetAllocController(form_tgl.value, forms.value)
        toast.add({ severity: response.severity, summary: response.severity == 'warn' ? 'Warning' : 'Success', detail: response.content, life: 3000 });
        if (response.severity == 'success') {
            setTimeout(function() {
                loadData()
                router.push('/det-alloc')
            }, 2000);
        }
        loadingSubmit.value = false;
        loadingTable.value = false;
    }

</script>
<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <Toast v-if="toast_show == false" />
        <Toast v-else position="top-center" group="bc">
            <template #message="slotProps">
                <div class="flex flex-column align-items-start" style="flex: 1">
                    <div class="flex align-items-center gap-2">
                        <span class="font-bold text-md text-orange-500 capitalize">Attention !</span>
                    </div>
                    <div class="font-normal text-sm my-3 text-700">{{ slotProps.message.summary }} <span class="font-bold font-italic">Harga Satuan Produk</span> up to date. Jika ingin update silahkan klik tombol dibawah ini:</div>
                    <div class="flex justify-content-between gap-3 w-full">
                        <Button size="small" class="text-xs p-2" severity="warning" label="Harga Satuan Produksi" @click="() => {router.push('/master-data/harga_satuan')}"/>
                    </div>
                </div>
            </template>
        </Toast>
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="flex justify-content-between align-items-center gap-2 w-full">
                <span class="font-medium text-xl uppercase">Form Detail Allocation </span>
                <div class="flex gap-2">
                    <Button label="Back" icon="pi pi-times" size="small" class="px-3 py-2" severity="danger" outlined @click="()=>{router.push('/det-alloc')}"/>
                    <Button label="Save" icon="pi pi-save" size="small" class="px-3 py-2" severity="success" @click="postData" :disabled="loadingSubmit == true ? true : false"/>
                </div>
            </div>
        </div>
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <form v-else class="flex flex-column gap-5">
            <div class="flex justify-content-end gap-1">
                <small class="font-medium">Note :</small>
                <small class="text-red-500">Apabila tidak ada nilai, bisa masukan nilai <span class="font-bold">0</span></small>
            </div>
            <div class="flex justify-content-between gap-3">
                <div class="flex flex-column gap-1 w-full">
                    <label for="tanggal" class="font-semibold">Tanggal <small class="text-red-500">*</small></label>
                    <InputText id="tanggal" v-model="form_tgl" type="date" class="flex-auto" autocomplete="off" :max="moment().format('YYYY-MM-DD')"/>
                </div>
                <div class="flex flex-column gap-1 w-full">
                    <label for="username" class="font-semibold">Category <small class="text-red-500">*</small></label>
                    <Dropdown v-model="form_category" showClear filter :options="list_category" optionLabel="nama" optionValue="id" placeholder="Select a Category" class="w-full" @change="loadFormList"/>
                </div>
            </div>
            <div class="flex flex-column gap-4" v-if="form_category != null">
                <div class="flex justify-content-between align-items-center gap-4" v-for="(data, index) in forms" :key="index">
                    <span class="font-medium text-300 text-xl">{{ index+1 }}</span>
                    <div class="flex flex-column gap-1 w-full">
                        <label for="username" class="font-semibold">Uraian <small class="text-red-500">*</small></label>
                        <Dropdown v-model="data.id_uraian" filter :options="list_uraian" optionLabel="nama" optionValue="id" placeholder="Select a Uraian" class="w-full" disabled/>
                    </div>
                    <div class="flex flex-column gap-1 w-full">
                        <label class="font-semibold">Plant </label>
                        <Dropdown v-model="data.id_plant" filter :options="list_plant" optionLabel="nama" optionValue="id" placeholder="Select a Plant" class="w-full" disabled/>
                    </div>
                    <div class="flex flex-column gap-1 w-full">
                        <label for="username" class="font-semibold">Qty <small class="text-red-500">*</small></label>
                        <InputNumber id="dmo" v-model="data.value" class="w-full" placeholder="Qty" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" />
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>