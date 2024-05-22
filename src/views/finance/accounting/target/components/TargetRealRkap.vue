<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import moment from 'moment';

    // API
    import {list_product_type} from '@/api/DummyData.js';
    import TargetReal from '@/api/target/TargetReal.js';
    import TargetRkap from '@/api/target/TargetRkap.js';
    import BulkyProdMaster from '@/api/master/BulkyProdMaster.js';
    import RetailProdMaster from '@/api/master/RetailProdMaster.js';

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

    const emit = defineEmits(['submit'])

    const product_type = ref(list_product_type)
    const forms_real = ref({
        id: null,
        tanggal: moment().format('YYYY-MM-DD'),
        value: null,
        product_type: null,
        productable_id: null,
    })

    const forms_rkap = ref({
        id: null,
        tanggal: moment().format('YYYY-MM-DD'),
        value: null,
        product_type: null,
        productable_id: null,
    })

    // Function
    const loadProduct = async() => {
        forms_real.value.product_type
        if (forms_real.value.product_type == 'bulk') {
            // const response = await 
        } else {
            
        }
    }

    const loadRetailProd = async() => {
        try {
            const response = await RetailProdMaster.getAll()
            // const load = 
        } catch (error) {
            
        }

    }
    const postData = async() => {
        try {
            if (status == 'add_daily') {
                const response = await TargetReal.addPost(forms.value);
                const load = response.data;
                if (load.success == true) {
                    emit('submit','add_daily_success');
                } else {
                    emit('submit','add_daily_error');
                }
            } else {
                const response = await TargetReal.updatePost(forms.value.id,forms.value);
                const load = response.data;
                if (load.success == true) {
                    emit('submit','edit_daily_success');
                } else {
                    emit('submit','edit_daily_error');
                }
            }
        } catch (error) {
            emit('submit','close');
        }
    }
</script>

<template>
    <form class="flex flex-column gap-4" @submit="postData">
        <div class="flex flex-column gap-3 w-full">
            <label for="tanggal" class="font-semibold">Tanggal <small class="text-red-500">*</small></label>
            <InputText id="tanggal" v-model="forms_real.tanggal" type="date" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex gap-4">
            <div class="flex flex-column gap-3 w-full">
                <label for="cpo" class="font-semibold">Product Type <small class="text-red-500">*</small></label>
                <Dropdown v-model="forms_real.product_type" :options="product_type" optionLabel="name" optionValue="id" placeholder="Select a City" class="flex-auto" />
            </div>
            <div class="flex flex-column gap-3 w-full">
                <label for="cpo" class="font-semibold">Product <small class="text-red-500">*</small></label>
                <Dropdown v-model="forms_real.productable_id" :options="product_type" optionLabel="name" optionValue="id" placeholder="Select a City" class="flex-auto" />
            </div>
            <div class="flex flex-column gap-3 w-full">
                <label for="dmo" class="font-semibold">Value <small class="text-red-500">*</small></label>
                <InputNumber id="dmo" v-model="forms_real.value" class="flex-auto" :maxFractionDigits="2" />
            </div>
        </div>
        <div class="flex justify-content-end gap-3 mt-4">
            <Button icon="pi pi-save" label="Save" severity="success" size="small" @click="postData"/>
            <Button icon="pi pi-times" label="Close" severity="secondary" size="small"/>
        </div>
    </form>
</template>