<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import { loadMonthlyDmoByDate_TargetController } from '@/controller/retail/TargetController.js'
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
    import FormMonthlyDmo from '@/views/finance/accounting/target/components/forms/FormMonthlyDmo.vue'

    // Function ===================================================================================================================================================
    // onMounted(() => {
    //     loadData(props.tanggal)
    // });

    const loadData = async(tgl) => {
        loadingTable.value = true
        try {
            const data = await loadMonthlyDmoByDate_TargetController(tgl);
            const list = [];
            if (data != null) {
                for (let a = 0; a < data.length; a++) {
                    list[a] = {
                        id:data[a].id,
                        tanggal:data[a].tanggal,
                        dmo:data[a].dmo,
                        cpo_olah_rkap:data[a].cpo_olah_rkap,
                        kapasitas_utility:data[a].kapasitas_utility,
                        pengali_kapasitas_utility:data[a].pengali_kapasitas_utility,
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
        title_dialog.value = cond == 'add' ? 'Monthly DMO - Tambah Data' : cond == 'edit' ? 'Monthly DMO - Edit Data' : 'Monthly DMO - Hapus Data' ;
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
        } else if (ket == 'sudah_ada') {
            messages.value = [
                { severity: 'warn', content: 'Data bulan tersebut sudah tersedia', id: count.value++ }
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
    <div class="flex flex-column gap-3 p-3 border-round border-3 border-cyan-100">
        <div class="flex justify-content-between gap-4">
            <span class="text-xl font-bold font-italic">Monthly DMO</span>
            <Button v-if="cek_token != null" icon="pi pi-plus" label="Add" severity="info" class="py-2" size="small" @click="formDatabase('add', null)"/>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '70rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <form-monthly-dmo :status_request="status_form" :data_dialog="data_form" @submit="saveData"/>
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
        <DataTable v-else :value="products" showGridlines :globalFilterFields="['tanggal']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <ColumnGroup type="header">
                <Row>
                    <Column :rowspan="3" sortable headerStyle="background-color:#d5d8dc;">
                        <template #header>
                            <small class="font-medium uppercase">Period</small>
                        </template>
                    </Column>
                </Row>
                <Row>
                    <Column :colspan="3" headerStyle="background-color:#2c3e50; color:white;">
                        <template #header>
                            <small class="font-medium uppercase flex justify-content-center w-full">CPO Olah</small>
                        </template>
                    </Column>
                </Row>
                <Row>
                    <Column headerStyle="background-color:#2c3e50; color:white;">
                        <template #header>
                            <small class="font-medium uppercase flex justify-content-center w-full">DMO</small>
                        </template>
                    </Column>
                    <Column headerStyle="background-color:#2c3e50; color:white;">
                        <template #header>
                            <small class="font-medium uppercase flex justify-content-center w-full">RKAP (Produksi)</small>
                        </template>
                    </Column>
                    <Column headerStyle="background-color:#2c3e50; color:white;">
                        <template #header>
                            <small class="font-medium uppercase flex justify-content-center w-full">Kapasitas Terpasang (Utility)</small>
                        </template>
                    </Column>
                </Row>
            </ColumnGroup>
            <Column field="tanggal" style="min-width: 8rem;" sortable>
                <template #body="{ data }">
                    <div class="flex justify-content-between gap-5">
                        <small class="font-medium">{{ moment(data.tanggal).format('MMMM YYYY') }}</small>
                        <Button icon="pi pi-pencil" @click="formDatabase('edit', data)" size="small" severity="warning" text class="py-2"/>
                    </div>
                </template>
            </Column>
            <Column field="dmo" style="min-width: 8rem;" sortable>
                <template #body="{ data }">
                    <small class="font-normal flex justify-content-end">{{ formatCurrency(Number(data.dmo).toFixed(2)) }}</small>
                </template>
            </Column>
            <Column field="dmo" style="min-width: 8rem;" sortable>
                <template #body="{ data }">
                    <small class="font-normal flex justify-content-end">{{ formatCurrency(Number(data.cpo_olah_rkap).toFixed(2)) }}</small>
                </template>
            </Column>
            <Column field="dmo" style="min-width: 8rem;" sortable>
                <template #body="{ data }">
                    <small class="font-normal flex justify-content-end">{{ formatCurrency((Number(data.kapasitas_utility)*Number(data.pengali_kapasitas_utility)).toFixed(2)) }}</small>
                </template>
            </Column>
        </DataTable>
    </div>
</template>