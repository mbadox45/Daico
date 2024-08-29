<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import DailyDmo from '@/api/target/DailyDmo.js';
    import {loadRefinery_CostingHppController} from '@/controller/production/CostingHppController.js'
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

    const props = defineProps({
        dummy_ref:{
            type:Array,
            default: () => {}
        }
    });

    // watch(() => props.datas, loadData(), { immediate: true });

    // VARIABLE
    const loadingTable = ref(false)
    const list_main = ref([])
    const list_direct = ref([])
    const list_indirect = ref([])
    const total = ref()
    const list_allocation = ref([])

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        const tgl = '2024-05-31'
        loadingTable.value = true
        try {
            const response = props.dummy_ref;
            const ref = await loadRefinery_CostingHppController(response);
            list_main.value = ref.main
            list_direct.value = ref.direct
            list_indirect.value = ref.indirect
            list_allocation.value = ref.allocation
            total.value = ref.total
            loadingTable.value = false
        } catch (error) {
            list_main.value = []
            list_direct.value = []
            list_indirect.value = []
            list_allocation.value = []
            total.value = {}
            loadingTable.value = false
        }
    }

    watch(() => props.dummy_ref, loadData, { immediate: true });

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
            <span class="w-full font-bold font-italic text-2xl text-center">Refinery</span>
            <div class="w-full flex flex-column gap-2 text-xs bg-yellow-100">
                <div class="flex justify-content-between gap-3 font-bold border-top-1 border-bottom-1 py-1">
                    <span class="w-full"></span>
                    <span class="w-full text-center">Total QTY</span>
                    <span class="w-full text-center">Rendement (%)</span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1" v-for="(item, index) in list_main" :key="index">
                    <span class="w-full font-medium">{{item.name}}</span>
                    <span class="w-full text-right font-bold">{{ item.qty }}</span>
                    <span class="w-full text-right font-bold">{{ item.rendement }}</span>
                </div>
            </div>
        </div>
        <Divider/>
        <div class="flex flex-column gap-5">
            <table>
                <thead class="text-sm font-medium">
                    <tr >
                        <th class="underline font-italic text-left" style="width: 50%;">Direct Cost :</th>
                        <th class="bg-gray-100" colspan="2">Proportion</th>
                        <th class="bg-gray-100" style="width: 15%;">Total Value</th>
                        <th class="bg-gray-100" style="width: 15%;">Rp/Kg</th>
                    </tr>
                </thead>
                <tbody class="text-sm font-medium">
                    <tr v-for="(items, index) in list_direct" :key="index">
                        <td>{{items.name}}</td>
                        <td class="text-right">{{items.proportion}}</td>
                        <td class="text-right">{{items.proportion2}}</td>
                        <td class="text-right">{{items.total_value}}</td>
                        <td class="text-right">{{items.rp_kg}}</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead class="text-sm font-medium">
                    <tr >
                        <th class="underline font-italic text-left" style="width: 50%;">In-Direct Cost :</th>
                        <th class="bg-gray-100" colspan="2">Proportion</th>
                        <th class="bg-gray-100" style="width: 15%;">Total Value</th>
                        <th class="bg-gray-100" style="width: 15%;">Rp/Kg</th>
                    </tr>
                </thead>
                <tbody class="text-sm font-medium">
                    <tr v-for="(items, index) in list_indirect" :key="index">
                        <td>{{items.name}}</td>
                        <td class="text-right">{{items.proportion}}</td>
                        <td class="text-right">{{items.proportion2}}</td>
                        <td class="text-right">{{items.total_value}}</td>
                        <td class="text-right">{{items.rp_kg}}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="mt-3 text-sm">
                        <th class="text-left font-italic">Total Cost Refinery</th>
                        <th></th>
                        <th></th>
                        <th class="text-right">{{total.total_value}}</th>
                        <th class="text-right">{{total.rp_kg}}</th>
                    </tr>
                    <tr>
                        <th class="text-left font-italic"></th>
                        <th></th>
                        <th></th>
                        <th class="text-right"></th>
                        <th class="text-right"></th>
                    </tr>
                    <tr class="mt-3 text-sm">
                        <th class="text-right font-medium underline font-italic">Allocation Cost:</th>
                        <th></th>
                        <th class="text-right font-medium font-italic"></th>
                        <th class="text-right"></th>
                        <th class="text-right"></th>
                    </tr>
                    <tr class="mt-3 text-sm" v-for="(item, index) in list_allocation" :key="index">
                        <th class="text-right font-medium font-italic">{{item.name}}</th>
                        <th></th>
                        <th class="text-right font-medium font-italic">{{item.proportion}}</th>
                        <th class="text-right font-medium">{{item.total_value}}</th>
                        <th class="text-right font-medium">{{item.rp_kg}}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>