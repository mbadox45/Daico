<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import DailyDmo from '@/api/target/DailyDmo.js';
    // import {} from '@/'

    const props = defineProps({
        tanggal:{
            type:String
        }
    });

    watch(() => props.tanggal, (newVal) => {loadData(newVal)});

    // VARIABLE
    const products = ref([]);
    const loadingTable = ref(false)

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData(props.tanggal)
    });

    const loadData = async(tgl) => {
        loadingTable.value = true
        try {
            // const response = await DailyDmo.getByDate({tanggal: tgl});
            // const load = response.data;
            // const data = load.data;
            // const list = [];
            // for (let a = 0; a < data.length; a++) {
            //     list[a] = {
            //         id:data[a].id,
            //         tanggal:data[a].tanggal,
            //         value:data[a].value,
            //         created_at:data[a].created_at,
            //         updated_at:data[a].updated_at,
            //     };
            // }
            products.value = [];
            loadingTable.value = false
        } catch (error) {
            products.value = []
            loadingTable.value = false
        }
    }

</script>

<template>
    <div class="flex-auto flex flex-column gap-3 border-1 border-round border-cyan-300 p-3">
        <div class="flex align-items-center justify-content-between gap-5">
            <span class="w-full font-bold font-italic text-2xl text-center">Refinery</span>
            <div class="w-full flex flex-column gap-2 text-xs bg-yellow-100">
                <div class="flex justify-content-between gap-3 font-bold border-top-1 border-bottom-1 py-1">
                    <span class="w-full"></span>
                    <span class="w-full">QTY</span>
                    <span class="w-full">Rendement (%)</span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">CPO Consume</span>
                    <span class="w-full">0</span>
                    <span class="w-full"></span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">RBDPO</span>
                    <span class="w-full">0</span>
                    <span class="w-full"></span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">PFAD</span>
                    <span class="w-full">0</span>
                    <span class="w-full"></span>
                </div>
            </div>
        </div>
        <div class="flex flex-column gap-3">
            <div class="flex justify-content-between gap-3 font-bold py-1">
                <span class="w-full">Direct Cost :</span>
                <span class="w-3">QTY</span>
                <span class="w-3">Rendement (%)</span>
            </div>
        </div>
    </div>
</template>