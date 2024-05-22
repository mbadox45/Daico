<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import moment from 'moment';

    // API
    import MonthlyDmo from '@/api/target/MonthlyDmo.js';

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

    const forms = ref({
        id: null,
        tanggal: moment().format('YYYY-MM-DD'),
        dmo: null,
        cpo_olah_rkap: null,
        kapasitas_utility: null,
        pengali_kapasitas_utility: null,
    })

    // Function
    const postData = async() => {
        try {
            if (status == 'add_daily') {
                const response = await MonthlyDmo.addPost(forms.value);
                const load = response.data;
                if (load.success == true) {
                    emit('submit','add_daily_success');
                } else {
                    emit('submit','add_daily_error');
                }
            } else {
                const response = await MonthlyDmo.updatePost(forms.value.id,forms.value);
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
            <InputText id="tanggal" v-model="forms.tanggal" type="date" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex gap-4">
            <div class="flex flex-column gap-3 w-full">
                <label for="dmo" class="font-semibold">DMO <small class="text-red-500">*</small></label>
                <InputNumber id="dmo" v-model="forms.dmo" :maxFractionDigits="2" />
            </div>
            <div class="flex flex-column gap-3 w-full">
                <label for="cpo" class="font-semibold">CPO Olah (RKAP) <small class="text-red-500">*</small></label>
                <InputNumber id="cpo" v-model="forms.cpo_olah_rkap" :maxFractionDigits="2" />
            </div>
        </div>
        <div class="flex gap-4">
            <div class="flex flex-column gap-3 w-full">
                <label for="dmo" class="font-semibold">Kapasitas Utility <small class="text-red-500">*</small></label>
                <InputNumber id="dmo" v-model="forms.kapasitas_utility" :maxFractionDigits="2" />
            </div>
            <div class="flex flex-column gap-3 w-full">
                <label for="cpo" class="font-semibold">Pengali Kapasitas Utility <small class="text-red-500">*</small></label>
                <InputNumber id="cpo" v-model="forms.pengali_kapasitas_utility" :maxFractionDigits="2" />
            </div>
        </div>
        <div class="flex justify-content-end gap-3 mt-4">
            <Button icon="pi pi-save" label="Save" severity="success" size="small" @click="postData"/>
            <Button icon="pi pi-times" label="Close" severity="secondary" size="small"/>
        </div>
    </form>
</template>