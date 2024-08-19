<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

    const props = defineProps({
        // tanggal:{
        //     type:String
        // },
        datas:{
            type:Array,
            default: () => {}
        }
    });

    // VARIABLE
    const loadingTable = ref(false)
    const load = ref([])

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            const refi = response[2].item
            load.value = refi
            loadingTable.value = false
        } catch (error) {
            load.value = {}
            loadingTable.value = false
        }
    }

    watch(() => props.datas, loadData, { immediate: true });

</script>

<template>
    <div class="w-full">
        <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-3 py-5 border-round border-bottom-3 border-blue-300" v-for="(item, index) in load" :key="index">
                <div class="flex align-items-center justify-content-between w-full">
                    <span class="font-italic font-medium">Total Pemakaian {{ item.name }}</span>
                </div>
                <div class="flex flex-column gap-3">
                    <div class="flex justify-content-between text-lg font-medium uppercase py-2 border-bottom-2"><span class="">Uraian</span> <span class="font-medium">Qty</span></div>
                    <div class="flex flex-column gap-2 border-bottom-1 pb-1" v-for="(item2, index2) in item.items" :key="index2">
                        <div class="flex justify-content-between text-sm font-normal"><span class="underline font-italic font-medium">{{ item2.name }}</span> <span class="font-medium">{{ item2.value == null || item2.value == 0 ? '-' : formatCurrency(Number(item2.value).toFixed(0)) }}</span></div>
                        <div v-show="item2.items.length > 0">
                            <div class="py-1 flex justify-content-between text-sm" v-for="(item3, index3) in item2.items" :key="index3">
                                <span>{{ item3.name }}</span>
                                <span>{{ item3.value == null || item3.value == 0 ? '-' : formatCurrency(Number(item3.value).toFixed(0)) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>