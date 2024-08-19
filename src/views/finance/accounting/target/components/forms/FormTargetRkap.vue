<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import moment from 'moment';

    // API
    import {list_product_type} from '@/api/DummyData.js';
    import { addRkap_TargetController, updateRkap_TargetController } from '@/controller/retail/TargetController.js'
    import { loadAll_BulkyProduksiMaster } from '@/controller/master_data/BulkyProduksiController.js'
    import { loadAll_RetailProdMaster } from '@/controller/master_data/RetailProduksiController.js'

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
        status_request:{
            type:String
        },
    });
    const status = props.status_request
    const data_prop = props.data_dialog
    const product_type = ref(list_product_type)
    const list_product = ref([])

    const emit = defineEmits(['submit'])

    const forms = ref({
        id: null,
        tanggal: moment().format('YYYY-MM-DD'),
        value: null,
        product_type: null,
        productable_id: null,
    })

    const loadForms = async() => {
        if (status == 'add') {
            resetForm()
        } else {
            if (data_prop.productable_type == 'bulk') {
                list_product.value = await loadAll_BulkyProduksiMaster();
            } else {
                list_product.value = await loadAll_RetailProdMaster();
            }
            forms.value = {
                id: data_prop.id,
                tanggal: data_prop.tanggal,
                value: data_prop.value,
                product_type: data_prop.productable_type,
                productable_id: data_prop.productable_id,
            }
        }
    }

    onMounted(()=> {
        loadForms();
    })

    const resetForm = () => {
        forms.value = {
            id: null,
            tanggal: moment().format('YYYY-MM-DD'),
            value: null,
            product_type: null,
            productable_id: null,
        }
    }

    // Function
    const postData = async() => {
        try {
            if (forms.value.tanggal != null && forms.value.value != null && forms.value.product_type != null && forms.value.productable_id != null) {
                if (status == 'add') {
                    const response = await addRkap_TargetController(forms.value);
                    if (response.status == true) {
                        emit('submit','sukses');
                    } else {
                        emit('submit','sudah_ada');
                    }
                    
                } else {
                    const response = await updateRkap_TargetController(forms.value.id,forms.value);
                    if (response.status == true) {
                        emit('submit','sukses');
                    } else {
                        emit('submit','error');
                    }
                }
            } else {
                emit('submit','gagal');
            }
        } catch (error) {
            emit('submit','sudah_ada');
        }
    }
</script>

<template>
    <form class="flex flex-column gap-5" @submit="postData">
        <div class="flex gap-4">
            <div class="flex flex-column gap-3 w-full">
                <label for="tanggal" class="font-semibold">Tanggal <small class="text-red-500">*</small></label>
                <InputText id="tanggal" v-model="forms.tanggal" type="date" class="flex-auto" autocomplete="off" :max="moment().format('YYYY-MM-DD')" disabled/>
            </div>
        </div>
        <div class="flex gap-4">
            <div class="flex flex-column gap-3 w-full">
                <label for="username" class="font-semibold">Type <small class="text-red-500">*</small></label>
                <Dropdown v-model="forms.product_type" :options="product_type" optionLabel="name" optionValue="id" placeholder="Select a Product Type" class="w-full" disabled/>
            </div>
            <div class="flex flex-column gap-3 w-full">
                <label for="username" class="font-semibold">Product <small class="text-red-500">*</small></label>
                <Dropdown v-model="forms.productable_id" :options="list_product" optionLabel="name" optionValue="id" placeholder="Select a Product Name" class="w-full" disabled/>
            </div>
            <div class="flex flex-column gap-3 w-full">
                <label for="username" class="font-semibold">Value <small class="text-red-500">*</small></label>
                <InputNumber v-model="forms.value" :maxFractionDigits="2" inputId="locale-german" placeholder="Value" locale="de-DE" class="w-full" />
            </div>
        </div>
        <div class="flex justify-content-end gap-3">
            <Button icon="pi pi-save" label="Save" severity="success" size="small" @click="postData"/>
            <Button icon="pi pi-times" label="Close" severity="secondary" size="small" @click="()=> {emit('submit','close')}"/>
        </div>
    </form>
</template>