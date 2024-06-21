<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import DailyDmo from '@/api/target/DailyDmo.js';
    import {loadFrakIv60} from '@/views/load_data/hpp.js'
    import {formatCurrency} from '@/views/load_data/func_dummy.js'

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
    const total = ref({})

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            const refi = response.find(item => item.name == 'Control')
            load.value = refi.items
            total.value = refi.total
            // console.log(load.value)
            loadingTable.value = false
        } catch (error) {
            load.value = {}
            loadingTable.value = false
        }
    }

    watch(() => props.datas, loadData, { immediate: true });

</script>

<template>
    <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
        <div>
            <span class="text-xl font-normal">Loading...</span>
        </div>
        <div>
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
        </div>
    </div>
    <div v-else class="flex-auto flex flex-column gap-3 border-1 border-round border-cyan-300 p-3">
        <div class="flex align-items-center justify-content-between gap-5">
            <span class="w-full font-bold font-italic text-2xl text-center">CONTROL</span>
        </div>
        <Divider/>
        <div class="flex flex-column gap-5">
            <table>
                <thead class="text-sm font-medium">
                    <tr >
                        <th class="underline font-italic text-left" style="width: 50%;">Direct Cost :</th>
                        <th class="bg-gray-100" >Costing</th>
                        <th class="bg-gray-100" style="width: 15%;">Actual</th>
                        <th class="bg-gray-100" style="width: 15%;">Selisih</th>
                    </tr>
                </thead>
                <tbody class="text-sm font-medium">
                    <tr v-for="(items, index) in load" :key="index">
                        <td>{{items.name}}</td>
                        <td class="text-right">{{items.value1 == null ? null : Number(items.value1) >= 0 ? formatCurrency(Number(items.value1).toFixed(2)) : `(${formatCurrency((Number(items.value1)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{items.value2 == null ? null : Number(items.value2) >= 0 ? formatCurrency(Number(items.value2).toFixed(2)) : `(${formatCurrency((Number(items.value2)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{items.harga == null ? null : Number(items.harga) >= 0 ? formatCurrency(Number(items.harga).toFixed(2)) : `(${formatCurrency((Number(items.harga)*-1).toFixed(2))})`}}</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead class="text-sm font-medium bg-gray-300">
                    <tr>
                        <th class="underline font-italic text-left" style="width: 50%;">Total</th>
                        <th class="text-right">{{total.costing == null ? null : Number(total.costing) >= 0 ? formatCurrency(Number(total.costing).toFixed(2)) : `(${formatCurrency((Number(total.costing)*-1).toFixed(2))})`}}</th>
                        <th class="text-right" style="width: 15%;">{{total.actual == null ? null : Number(total.actual) >= 0 ? formatCurrency(Number(total.actual).toFixed(2)) : `(${formatCurrency((Number(total.actual)*-1).toFixed(2))})`}}</th>
                        <th class="text-right" style="width: 15%;">{{total.selisih == null ? null : Number(total.selisih) >= 0 ? formatCurrency(Number(total.selisih).toFixed(2)) : `(${formatCurrency((Number(total.selisih)*-1).toFixed(2))})`}}</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</template>