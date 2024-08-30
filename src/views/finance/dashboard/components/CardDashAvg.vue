<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';
    import { useToast } from "primevue/usetoast";
    
    // Controller
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import {nilaiKurs_DashboardController} from '@/controller/dashboard/DashboardController2.js';
    // import { loadAllData_DashboardController } from '@/controller/dashboard/DashboardController.js'
    
    const toast = useToast();

    // Variable
    const avg_jisdor = ref(0);
    const jisdor_lastday = ref(0);
    const kurs_mandiri = ref(0);
    const loadingData = ref(false)
    const dataLoaded = ref(false);  // Flag to prevent multiple requests

    const props = defineProps({
        kurs:{
            type:Array,
            default: () => {}
        }
    });

    const loadData = async() => {
        if (loadingData.value || dataLoaded.value) return;  // Prevent multiple requests
        loadingData.value = true;
        try {
            const response = props.kurs;
            const kurs = await nilaiKurs_DashboardController(response);
            avg_jisdor.value = formatCurrency(Number(kurs.avg_jisdor).toFixed(0))
            jisdor_lastday.value = formatCurrency(Number(kurs.last_jisdor).toFixed(0))
            kurs_mandiri.value = formatCurrency(Number(kurs.mandiri).toFixed(0))
            dataLoaded.value = true;  // Set flag to true after successful data load
        } catch (error) {
            console.log(error)
        } finally {
            loadingData.value = false;
        }
    }

    watch(() => props.kurs, loadData, { immediate: true });

    // onMounted(() => {
    //     loadData();  // Ensure data is loaded if props.kurs is available on mount
    //     // if (props.kurs.length > 0) {
    //     // }
    // })

</script>
<template>
    <div class="w-full flex flex-column md:flex-row align-items-center gap-3 justify-content-end">
        <div class="flex align-items-center gap-2 p-3 bg-yellow-600 text-white border-round h-full w-full">
            <i class="pi pi-dollar text-6xl font-bold"></i>
            <div class="flex flex-column gap-3 border-left-1 pl-3 border-white w-full">
                <span class="text-5xl flex gap-3 justify-content-between">
                    <span>Rp</span> 
                    <div>
                        <span v-if="loadingData == true">.....</span>
                        <span v-else>{{avg_jisdor}}</span>
                    </div>
                </span>
                <div class="font-medium border-round flex gap-2 w-auto">
                    <small class="flex gap-2 text-xs"><i class="pi pi-caret-right"></i> Avg Kurs Jisdor</small>
                </div>
            </div>
        </div>
        <div class="flex align-items-center gap-2 p-3 bg-cyan-600 text-white border-round h-full w-full">
            <i class="pi pi-dollar text-6xl font-bold"></i>
            <div class="flex flex-column gap-3 border-left-1 pl-3 border-white w-full">
                <span class="text-5xl flex gap-3 justify-content-between">
                    <span>Rp</span>
                    <div>
                        <span v-if="loadingData == true">.....</span>
                        <span v-else>{{jisdor_lastday}}</span>
                    </div>
                </span>
                <div class="font-medium border-round flex gap-2 w-auto">
                    <small class="flex gap-2 text-xs"><i class="pi pi-caret-right"></i> Kurs Jisdor Last Day</small>
                </div>
            </div>
        </div>
        <div class="flex align-items-center gap-2 p-3 bg-indigo-600 text-white border-round h-full w-full">
            <i class="pi pi-dollar text-6xl font-bold"></i>
            <div class="flex flex-column gap-3 border-left-1 pl-3 border-white w-full">
                <span class="text-5xl flex gap-3 justify-content-between">
                    <span>Rp</span>
                    <div>
                        <span v-if="loadingData == true">.....</span>
                        <span v-else>{{kurs_mandiri}}</span>
                    </div>
                </span>
                <div class="font-medium border-round flex gap-2 w-auto">
                    <small class="flex gap-2 text-xs"><i class="pi pi-caret-right"></i> Kurs Transaksi Bank Mandiri</small>
                </div>
            </div>
        </div>
    </div>
</template>