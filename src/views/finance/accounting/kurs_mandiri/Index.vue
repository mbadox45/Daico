<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import moment from 'moment';
    import {formatCurrency} from '@/views/load_data/func_dummy.js'
    import { useToast } from "primevue/usetoast";

    // API ========================================================================================================================================================
    import {loadLatestKursMandiri, addKursMandiri, updateKursMandiri} from '@/views/load_data/accounting.js';

    // VARIABLE
    const searchKeyword = ref('');
    const val_now = ref({});
    const val_before = ref({});
    const forms = ref({
        id: null,
        tanggal: moment().format('YYYY-MM-DD'),
        value: null,
        status: 'add',
    })
    const loadingTable = ref(false)
    
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const title_dialog = ref('');

    // Message Configure
    const messages = ref([]);
    let count = ref(0);
    const time = ref(3000)
    const toast = useToast();

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        try {
            loadingTable.value = true
            const kurs = await loadLatestKursMandiri();
            kurs.sort((a, b) => b.id - a.id);
            const value_now = kurs[0] == null ? { id: null, tanggal: null, value: null} : { id: kurs[0].id, tanggal: kurs[0].tanggal, value: kurs[0].value}
            const value_before = kurs[1] == null ? { id: null, tanggal: null, value: null} : { id: kurs[1].id, tanggal: kurs[1].tanggal, value: kurs[1].value}
            let status = 'add';
            if (value_now.tanggal == moment().format('YYYY-MM-DD')) {
                status = 'update';
            }
            forms.value = {
                id: value_now.id,
                tanggal: value_now.tanggal,
                value: null,
                status: status,
            }
            val_now.value = value_now;
            val_before.value = value_before;
            loadingTable.value = false
        } catch (error) {
            products.value = []
            loadingTable.value = false
        }
    }

    const resetForm = () => {
        forms.value = {
            id: null,
            tanggal: moment().format('YYYY-MM-DD'),
            value: null,
            status: null,
        }
    }

    const saveData = async () => {
        // status_form.value
        if (forms.value.value == null) {
            toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'Harap data diisi dengan lengkap.', life: 3000 });
        } else {
            let response
            if (forms.value.status == 'add') {
                response = await addKursMandiri(forms.value)
            } else {
                response = await updateKursMandiri(forms.value.id, forms.value)
            }
            
            if (response.success == true) {
                toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
                loadData()
            } else {
                toast.add({ severity: 'error', summary: 'Proses Input Error', detail: 'Data sudah ada', life: 3000 });
            }
        }
    }
</script>

<template>
    <div class="flex-auto flex flex-column gap-3 p-3 bg-white shadow-3">
        <Toast />
        <span class="font-medium text-xl">Kurs Mandiri</span>

        <!-- Table -->
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <div v-else class="flex gap-5">
            <div class="w-full flex flex-column gap-3">
                <span class="font-medium text-3xl text-green-700">Rp. {{ formatCurrency(Number(val_now.value).toFixed(2)) }} <small class="text-gray-500 text-xs font-medium">Latest</small></span>
                <span class="font-medium text-md text-red-500">Rp. {{ formatCurrency(Number(val_now.value).toFixed(2)) }} <small class="text-gray-500 text-xs font-medium">Before</small></span>
            </div>
            <div class="w-full flex gap-3 align-items-center">
                <InputText type="text" placeholder="Update Nilai Kurs" class="w-full" v-model="forms.value"/>
                <Button icon="pi pi-save" severity="info" size="small" @click="saveData"/>
            </div>
        </div>
    </div>
</template>