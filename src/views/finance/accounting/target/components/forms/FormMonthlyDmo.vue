<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import moment from 'moment';

    // API
    import { addMonthlyDmo_TargetController, updateMonthlyDmo_TargetController } from '@/controller/retail/TargetController.js'

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

    const emit = defineEmits(['submit'])

    const forms = ref({
        id: null,
        tanggal: moment().format('YYYY-MM-DD'),
        dmo: null,
        cpo_olah_rkap: null,
        kapasitas_utility: null,
        pengali_kapasitas_utility: null,
    })

    const loadForms = async() => {
        if (status == 'add') {
            resetForm()
        } else {
            forms.value = {
                id: data_prop.id,
                tanggal: data_prop.tanggal,
                dmo: data_prop.dmo,
                cpo_olah_rkap: data_prop.cpo_olah_rkap,
                kapasitas_utility: data_prop.kapasitas_utility,
                pengali_kapasitas_utility: data_prop.pengali_kapasitas_utility,
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
            dmo: null,
            cpo_olah_rkap: null,
            kapasitas_utility: null,
            pengali_kapasitas_utility: null,
        }
    }

    // Function
    const postData = async() => {
        try {
            if (forms.value.tanggal != null && forms.value.dmo != null && forms.value.cpo_olah_rkap != null && forms.value.kapasitas_utility != null && forms.value.pengali_kapasitas_utility != null) {
                if (status == 'add') {
                    const response = await addMonthlyDmo_TargetController(forms.value);
                    if (response.status == true) {
                        emit('submit','sukses');
                    } else {
                        emit('submit','sudah_ada');
                    }
                    
                } else {
                    const response = await updateMonthlyDmo_TargetController(forms.value.id,forms.value);
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
                <InputText id="tanggal" v-model="forms.tanggal" type="date" class="flex-auto" autocomplete="off" :max="moment().format('YYYY-MM-DD')"/>
            </div>
        </div>
        <div class="flex gap-4">
            <div class="flex flex-column gap-3 w-full">
                <label for="username" class="font-semibold">DMO <small class="text-red-500">*</small></label>
                <InputNumber v-model="forms.dmo" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" />
            </div>
            <div class="flex flex-column gap-3 w-full">
                <label for="username" class="font-semibold">RKAP <small class="text-red-500">*</small></label>
                <InputNumber v-model="forms.cpo_olah_rkap" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" />
            </div>
            <div class="flex flex-column gap-3 w-full">
                <label for="username" class="font-semibold">Kapasitas Utility <small class="text-red-500">*</small></label>
                <div class="flex flex-column">
                    <div class="p-inputgroup p-fluid">
                        <InputNumber v-model="forms.kapasitas_utility" :maxFractionDigits="2" inputId="locale-german" placeholder="Kapasitas Utility" locale="de-DE" class="w-full" />
                        <span class="p-inputgroup-addon bg-gray-500 text-white align-items-center">
                            <i class="pi pi-times"></i>
                        </span>
                        <InputNumber v-model="forms.pengali_kapasitas_utility" :maxFractionDigits="2" placeholder="Pengali" inputId="locale-german" locale="de-DE" class="w-6" />
                    </div>
                    <small class="text-red-400">Exp : (1.000 * 30)</small>
                </div>
            </div>
        </div>
        <div class="flex justify-content-end gap-3">
            <Button icon="pi pi-save" label="Save" severity="success" size="small" @click="postData"/>
            <Button icon="pi pi-times" label="Close" severity="secondary" size="small" @click="()=> {emit('submit','close')}"/>
        </div>
    </form>
</template>