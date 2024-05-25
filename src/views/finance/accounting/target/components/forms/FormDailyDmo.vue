<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import moment from 'moment';

    // API
    import DailyDmo from '@/api/target/DailyDmo.js';

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
        value: null,
        harga: 50000,
    })

    const loadForms = async() => {
        if (status == 'add') {
            resetForm()
        } else {
            forms.value = {
                id: data_prop.id,
                tanggal: data_prop.tanggal,
                value: data_prop.value,
                harga: 50000
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
            harga: 50000,
        }
    }

    // Function
    const postData = async() => {
        try {
            if (status == 'add') {
                if (forms.value.tanggal != null && forms.value.value != null) {
                    const response = await DailyDmo.addPost(forms.value);
                    const load = response.data;
                    if (load.success == true) {
                        emit('submit','sukses');
                    } else {
                        emit('submit','error');
                    }
                } else {
                    emit('submit','gagal');
                }
            } else {
                if (forms.value.tanggal != null && forms.value.value != null && forms.value.harga != null) {
                    const response = await DailyDmo.updatePost(forms.value.id,forms.value);
                    const load = response.data;
                    if (load.success == true) {
                        emit('submit','sukses');
                    } else {
                        emit('submit','error');
                    }
                } else {
                    emit('submit','gagal');
                }
            }
        } catch (error) {
            emit('submit','error');
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
            <div class="flex flex-column gap-3 w-full">
                <label for="username" class="font-semibold">Nilai <small class="text-red-500">*</small></label>
                <InputNumber v-model="forms.value" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" />
            </div>
        </div>
        <div class="flex justify-content-end gap-3">
            <Button icon="pi pi-save" label="Save" severity="success" size="small" @click="postData"/>
            <Button icon="pi pi-times" label="Close" severity="secondary" size="small" @click="()=> {emit('submit','close')}"/>
        </div>
    </form>
</template>