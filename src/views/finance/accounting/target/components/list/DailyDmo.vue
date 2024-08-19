<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import DailyDmo from '@/api/target/DailyDmo.js';
    import { loadDailyDmoByDate_TargetController } from '@/controller/retail/TargetController.js'
    import { cek_token } from "@/api/DataVariable.js";
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

    const props = defineProps({
        tanggal:{
            type:String
        }
    });

    watch(() => props.tanggal, (newVal) => {loadData(newVal)});

    // VARIABLE
    const products = ref([]);
    const loadingTable = ref(false)
    
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const data_form = ref();
    const title_dialog = ref('');

    // Message Configure
    const messages = ref([]);
    let count = ref(0);
    const time = ref(3000)

    // Components
    import FormDailyDmo from '@/views/finance/accounting/target/components/forms/FormDailyDmo.vue'

    // Function ===================================================================================================================================================
    // onMounted(() => {
    //     loadData(props.tanggal)
    // });

    const loadData = async(tgl) => {
        loadingTable.value = true
        try {
            const data = await loadDailyDmoByDate_TargetController(tgl);
            const list = [];
            if (data != null) {
                for (let a = 0; a < data.length; a++) {
                    list[a] = {
                        id:data[a].id,
                        tanggal:data[a].tanggal,
                        value:data[a].value,
                        created_at:data[a].created_at,
                        updated_at:data[a].updated_at,
                    };
                }
            }
            products.value = list;
            loadingTable.value = false
        } catch (error) {
            products.value = []
            loadingTable.value = false
        }
    }

    const formDatabase = (cond, data) => {
        visible.value = true;
        messages.value = [];
        status_form.value = cond;
        console.log(cond)
        data_form.value = data;
        title_dialog.value = cond == 'add' ? 'Daily DMO - Tambah Data' : cond == 'edit' ? 'Daily DMO - Edit Data' : 'Daily DMO - Hapus Data' ;
    }

    const saveData = async (ket) => {
        if (ket == 'sukses') {
            messages.value = [
                { severity: 'success', content: 'Data berhasil disimpan', id: count.value++ }
            ];
            setTimeout(function() {
                loadData(props.tanggal)
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
    <div class="flex-auto flex flex-column gap-3">
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '50rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <form-daily-dmo :status_request="status_form" :data_dialog="data_form" @submit="saveData"/>
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
        <DataTable v-else :value="products" paginator :rows="5" dataKey="id" :globalFilterFields="['tanggal']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="tanggal" style="min-width: 8rem;" sortable>
                <template #header>
                    <small class="font-medium uppercase">Date</small>
                </template>
                <template #body="{ data }">
                    <small class="font-medium">{{ moment(data.tanggal).format('DD MMMM YYYY') }}</small>
                </template>
            </Column>
            <Column field="value" style="min-width: 8rem;" sortable>
                <template #header>
                    <small class="font-medium uppercase">Value</small>
                </template>
                <template #body="{ data }">
                    <small class="font-normal">{{ formatCurrency(Number(data.value).toFixed(2)) }}</small>
                </template>
            </Column>
            <Column field="value" style="min-width: 8rem;">
                <template #header>
                    <small class="font-medium uppercase">Created At</small>
                </template>
                <template #body="{ data }">
                    <small class="font-normal">{{ moment(data.created_at).format('DD MMMM YYYY  HH:mm:ss') }}</small>
                </template>
            </Column>
            <Column field="value" style="min-width: 8rem;">
                <template #header>
                    <small class="font-medium uppercase">Updated At</small>
                </template>
                <template #body="{ data }">
                    <small class="font-normal">{{ moment(data.updated_at).format('DD MMMM YYYY  HH:mm:ss') }}</small>
                </template>
            </Column>
            <Column field="value" style="width: 3rem;" v-if="cek_token != null">
                <template #header>
                    <Button icon="pi pi-plus" label="Add" severity="info" class="py-2" size="small" @click="formDatabase('add', null)"/>
                </template>
                <template #body="{ data }">
                    <div class="flex justify-content-center">
                        <Button icon="pi pi-pencil" @click="formDatabase('edit', data)" size="small" severity="warning" text class="py-2"/>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>