<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API ========================================================================================================================================================
    import { loadRkapByDate_TargetController } from '@/controller/retail/TargetController.js'
    import { cek_token } from "@/api/DataVariable.js";
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

    const props = defineProps({
        tanggal:{
            type:String
        }
    });
    
    const route = useRoute();
    const router = useRouter();

    watch(() => props.tanggal, (newVal) => {loadData(newVal)});

    // VARIABLE
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
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
    import FormTargetRkap from '@/views/finance/accounting/target/components/forms/FormTargetRkap.vue'

    // Function ===================================================================================================================================================
    // onMounted(() => {
    //     loadData(props.tanggal)
    // });

    const loadData = async(tgl) => {
        loadingTable.value = true
        try {
            const data = await loadRkapByDate_TargetController(tgl);
            const list = [];
            if (data != null) {
                for (let a = 0; a < data.length; a++) {
                    const type = data[a].productable_type.split('\\').pop();
    
                    list[a] = {
                        id:data[a].id,
                        tanggal:data[a].tanggal,
                        value:data[a].value,
                        productable_id:data[a].productable_id,
                        productable_type:type == 'MasterBulkProduksi' ? 'bulk' : 'retail',
                        productable:data[a].productable != null ? data[a].productable.name : null,
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
        if (cond == 'add') {
            router.push('/form-target?type=rkap')
        } else {
            visible.value = true;
        }
        messages.value = [];
        status_form.value = cond;
        console.log(cond)
        data_form.value = data;
        title_dialog.value = cond == 'add' ? 'Target RKAP - Tambah Data' : cond == 'edit' ? 'Target RKAP - Edit Data' : 'Target RKAP - Hapus Data' ;
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
        <div class="flex justify-content-between align-items-center gap-3">
            <span class="text-xl font-bold font-italic w-full">Target RKAP</span>
            <div class="p-inputgroup">
                <Button  v-if="cek_token != null" icon="pi pi-plus" class="py-2 text-xs" severity="info" size="small" @click="formDatabase('add', null)"/>
                <span class="p-inputgroup-addon bg-white">
                    <i class="pi pi-search"></i>
                </span>
                <InputText type="text" placeholder="Search" class="flex-auto" v-model="filters['global'].value"/>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '70rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <form-target-rkap :status_request="status_form" :data_dialog="data_form" @submit="saveData"/>
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
        <DataTable v-else v-model:filters="filters" :value="products" showGridlines rowGroupMode="subheader" groupRowsBy="tanggal" sortMode="single" sortField="tanggal" scrollable scrollHeight="395px" :sortOrder="1" :rows="5" dataKey="id" :globalFilterFields="['tanggal', 'productable_type', 'productable', 'value']">
            <template #empty> No target rkap found. </template>
            <template #loading> Loading target rkap data. Please wait. </template>
            <template #groupheader="{data}">
                <div class="flex align-items-center gap-2">
                    <span class="uppercase font-bold capitalize text-sm">{{ moment(data.tanggal).format('DD MMMM YYYY') }}</span>
                </div>
            </template>
            <Column field="tanggal" style="min-width: 8rem;" sortable></Column>
            <Column field="productable_type" style="min-width: 8rem;" sortable>
                <template #header>
                    <small class="font-medium uppercase">Type</small>
                </template>
                <template #body="{ data }">
                    <small class="font-medium capitalize">{{ data.productable_type }}</small>
                </template>
            </Column>
            <Column field="type" style="min-width: 8rem;" sortable>
                <template #header>
                    <small class="font-medium uppercase flex justify-content-center w-full">Product Name</small>
                </template>
                <template #body="{ data }">
                    <small class="font-normal flex justify-content-center w-full">{{ data.productable }}</small>
                </template>
            </Column>
            <Column field="value" style="min-width: 8rem;" sortable>
                <template #header>
                            <small class="font-medium uppercase flex justify-content-center w-full">Value</small>
                        </template>
                <template #body="{ data }">
                    <small class="font-normal flex justify-content-end">{{ formatCurrency(Number(data.value).toFixed(2)) }}</small>
                </template>
            </Column>
            <Column field="value" style="width: 3rem;" v-if="cek_token != null">
                <template #body="{ data }">
                    <div class="flex justify-content-center">
                        <Button icon="pi pi-pencil" @click="formDatabase('edit', data)" size="small" severity="warning" text class="py-2"/>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>