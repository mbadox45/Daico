<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import { useRouter, useRoute } from 'vue-router';
    import moment from 'moment';

    const route = useRoute();
    const router = useRouter();

    // API
    import {RekeningUnitKerja} from '@/views/load_data/cash/rekening.js'
    import {loadTypeRekening} from '@/views/load_data/master_config.js'

    // Components
    import ListCash from '@/views/finance/accounting/cash/components/List.vue'

    // VARIABLE
    const type = ref(route.query.active);
    const active = ref(0);
    const loadingTable = ref(false);
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const periods = ref('')
    const list_tahun = ref([]);
    const tanggal = ref(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`)
    const op = ref();

    const data_refinery = ref([])
    const datas = ref({})
    
    const tombol_add = ref(false) 
    const tombol_update = ref(false) 
    const rute = ref({})

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        const response = await RekeningUnitKerja();
        tombol_add.value = false
        tombol_update.value = true
        rute.value = {name:'form cash', params:{status:'update', data:response}}
        datas.value = response
        loadingTable.value = false
    }
</script>

<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="flex gap-2">
                <Button label="Tambah Data" v-show="tombol_add == true" severity="info" size="small" class="py-2" @click="()=>{router.push(rute)}"/>
                <Button label="Update Data" v-show="tombol_update == true" severity="warning" size="small" class="py-2" @click="()=>{router.push(rute)}"/>
            </div>
        </div>

        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <div v-else>
            <!-- Table -->
            <list-cash :datas="datas"/>
        </div>

    </div>
</template>