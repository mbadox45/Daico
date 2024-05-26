<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import moment from 'moment';

    // API
    import PlantMaster from '@/api/master/PlantMaster.js';
    import CategoryProdMaster from '@/api/master/CategoryProdMaster.js';
    import Laporan_Produksi from '@/api/det_alloc/Laporan_Produksi.js';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
        status_request:{
            type:String
        },
    });
    const loadingTable = ref(false)
    const status = props.status_request
    const data_prop = props.data_dialog
    const list_category = ref([])
    const list_plant = ref([])

    const emit = defineEmits(['submit'])

    const forms = ref({
        id: null,
        tanggal: moment().format('YYYY-MM-DD'),
        value: null,
        id_plant: null,
        id_uraian: null,
    })

    const loadForms = async() => {
        loadingTable.value = true;
        list_plant.value = await loadPlant();
        list_category.value = await loadListCategory();
        if (status == 'add') {
            resetForm()
        } else {
            forms.value = {
                id: data_prop.id,
                tanggal: data_prop.tanggal,
                value: data_prop.value,
                id_plant: data_prop.id_plant,
                id_uraian: data_prop.id_uraian,
            }
        }
        loadingTable.value = false;

    }

    onMounted(()=> {
        loadForms();
    })

    const resetForm = () => {
        forms.value = {
            id: null,
            tanggal: moment().format('YYYY-MM-DD'),
            value: null,
            id_plant: null,
            id_uraian: null,
        }
    }

    const loadListCategory = async() => {
        const category = await loadCategory();
        const list = []
        for (let i = 0; i < category.length; i++) {
            const uraian = category[i].uraian;
            for (let u = 0; u < uraian.length; u++) {
                list.push({
                    id: uraian[u].id,
                    nama: `${uraian[u].nama} - ${category[i].nama}`,
                })
            }
        }
        return list
    }

    const loadCategory = async() => {
        try {
            const response = await CategoryProdMaster.getAll();
            const load = response.data;
            const data = load.data;
            return data;
        } catch (error) {
            return null;
        }
    }
    
    const loadPlant = async() => {
        try {
            const response = await PlantMaster.getAll();
            const load = response.data;
            const data = load.Plant;
            return data;
        } catch (error) {
            return null;
        }
    }

    // Function
    const postData = async() => {
        loadingTable.value = true;
        try {
            if (forms.value.tanggal != null && forms.value.value != null && forms.value.id_plant != null && forms.value.id_uraian != null) {
                if (status == 'add') {
                    const response = await Laporan_Produksi.addPost(forms.value);
                    const load = response.data;
                    if (load.success == true) {
                        emit('submit','sukses');
                    } else {
                        emit('submit','sudah_ada');
                    }
                    loadingTable.value = false;
                } else {
                    const response = await Laporan_Produksi.updatePost(forms.value.id,forms.value);
                    const load = response.data;
                    if (load.success == true) {
                        emit('submit','sukses');
                    } else {
                        emit('submit','error');
                    }
                    loadingTable.value = false;
                }
            } else {
                loadingTable.value = false;
                emit('submit','gagal');
            }
        } catch (error) {
            loadingTable.value = false;
            emit('submit','sudah_ada');
        }
    }
</script>

<template>
    <form class="flex flex-column gap-5" @submit="postData">
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <div v-else class="w-full flex flex-column gap-5">
            <div class="flex gap-4">
                <div class="flex flex-column gap-3 w-full">
                    <label for="tanggal" class="font-semibold">Tanggal <small class="text-red-500">*</small></label>
                    <InputText id="tanggal" v-model="forms.tanggal" type="date" class="flex-auto" autocomplete="off" :max="moment().format('YYYY-MM-DD')"/>
                </div>
            </div>
            <div class="flex gap-4">
                <div class="flex flex-column gap-3 w-full">
                    <label for="username" class="font-semibold">Type <small class="text-red-500">*</small></label>
                    <Dropdown v-model="forms.id_uraian" filter :options="list_category" optionLabel="nama" optionValue="id" placeholder="Select a Category" class="w-full"/>
                </div>
                <div class="flex flex-column gap-3 w-full">
                    <label for="username" class="font-semibold">Plant</label>
                    <Dropdown v-model="forms.id_plant" :options="list_plant" optionLabel="nama" optionValue="id" placeholder="Select a Plant" class="w-full"/>
                </div>
                <div class="flex flex-column gap-3 w-full">
                    <label for="username" class="font-semibold">Value <small class="text-red-500">*</small></label>
                    <InputNumber v-model="forms.value" :maxFractionDigits="2" inputId="locale-german" placeholder="Value" locale="de-DE" class="w-full" />
                </div>
            </div>
        </div>
        <div class="flex justify-content-end gap-3">
            <Button icon="pi pi-save" label="Save" severity="success" size="small" @click="postData"/>
            <Button icon="pi pi-times" label="Close" severity="secondary" size="small" @click="()=> {emit('submit','close')}"/>
        </div>
    </form>
</template>