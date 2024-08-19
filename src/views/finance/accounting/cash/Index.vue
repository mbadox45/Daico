<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import { useRouter, useRoute } from 'vue-router';
    import moment from 'moment';

    const route = useRoute();
    const router = useRouter();

    // API
    import { cek_token } from "@/api/DataVariable.js";
    import {RekeningUnitKerja} from '@/controller/accounting/RekeningUnitController.js'

    // Components
    import ListCash from '@/views/finance/accounting/cash/components/List.vue'

    // VARIABLE
    const type = ref(route.query.active);
    const active = ref(0);
    const loadingTable = ref(false);
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
        <div class="flex align-items-center gap-3">
            <div class="w-full">
                <span class="font-semibold uppercase text-xl">Cash</span>
            </div>
            <div :class="cek_token == null ? 'hidden' : 'flex'" class="w-full justify-content-end align-items-center gap-5">
                <div class="flex gap-2">
                    <Button label="Tambah Data" v-show="tombol_add == true" severity="info" size="small" class="py-2" @click="()=>{router.push(rute)}"/>
                    <Button label="Update Data" v-show="tombol_update == true" severity="warning" size="small" class="py-2" @click="()=>{router.push(rute)}"/>
                </div>
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
        <div v-else class="p-3 border-1 border-round border-gray-300">
            <!-- Table -->
            <list-cash :datas="datas"/>
        </div>

    </div>
</template>