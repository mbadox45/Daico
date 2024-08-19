<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps } from 'vue';

    // API ========================================================================================================================================================

    const props = defineProps({
        loads:{
            type:Array,
            default: () => []
        }
    });

    // VARIABLE
    const products = ref();


    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        const response = props.loads;
        products.value = response[0]
        console.log(products.value)
    }
</script>

<template>
    <div class="w-full flex flex-column gap-3">
        <div class="flex flex-column gap-3 border-1 border-round border-gray-300 p-3">
            <span class="text-yellow-800 uppercase font-semibold">Market Value</span>
            <div class="flex flex-column justify-content-between gap-3">
                <div class="flex gap-3">
                    <div class="flex flex-column w-full gap-2">
                        <span class="text-sm font-medium">Average Kurs Jisdor</span>
                        <span class="text-blue-600 text-xl">Rp. 0,00</span>
                    </div>
                    <div class="flex flex-column w-full gap-2">
                        <span class="text-sm font-medium">CPO KPBN</span>
                        <span class="text-blue-600 text-xl">Rp. 0,00</span>
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="flex flex-column w-full gap-2">
                        <span class="text-sm font-medium"><i class="pi pi-angle-double-right mr-2"></i>Market (USD)</span>
                        <div class="flex flex-column gap-1 border-bottom-1 border-gray-300 pb-2 w-full">
                            <div class="flex flex-column border-round w-full">
                                <span class="text-xs font-bold">PFAD</span>
                                <div class="flex justify-content-between align-items-center">
                                    <span class="text-xl font-normal">USD</span>
                                    <span class="text-xl font-normal">800,0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-column w-full gap-2">
                        <span class="text-sm font-medium"><i class="pi pi-angle-double-right mr-2"></i>Market (USD)</span>
                        <div class="flex flex-column gap-1 border-bottom-1 border-gray-300 pb-2 w-full">
                            <div class="flex flex-column border-round w-full">
                                <span class="text-xs font-bold">PFAD</span>
                                <div class="flex justify-content-between align-items-center">
                                    <span class="text-xl font-normal">USD</span>
                                    <span class="text-xl font-normal">800,0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>