<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import DailyDmo from '@/api/target/DailyDmo.js';
    import {loadRefinery} from '@/views/load_data/hpp.js'
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

    // watch(() => props.datas, loadData(), { immediate: true });

    // VARIABLE
    const loadingTable = ref(false)
    const refinery = ref({})
    const proportion1 = ref({})
    const proportion_packing = ref({})
    const direct = ref([])
    const in_direct = ref([])
    const total_cont_refinery = ref({})
    const alloc_cost = ref({})
    const produk = ref({})
    // const data_ref

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        const tgl = '2024-05-31'
        loadingTable.value = true
        try {
            const response = props.datas;
            const refi = response.find(item => item.name == 'Refinery')
            refinery.value = refi.produk;
            alloc_cost.value = refi.alloc_cost
            proportion1.value = refi.proportion1
            proportion_packing.value = refi.proportion_packing
            direct.value = refi.direct
            in_direct.value = refi.in_direct
            total_cont_refinery.value = refi.total_cont_refinery
            // console.log(((Number(total_cont_refinery.value.value) * Number(alloc_cost.value.prop_rbdpo) / 100) / Number(refinery.value.qty_rbdpo)))
            loadingTable.value = false
        } catch (error) {
            refinery.value = {}
            direct.value = []
            in_direct.value = []
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
            <span class="w-full font-bold font-italic text-2xl text-center">Refinery</span>
            <div class="w-full flex flex-column gap-2 text-xs bg-yellow-100">
                <div class="flex justify-content-between gap-3 font-bold border-top-1 border-bottom-1 py-1">
                    <span class="w-full"></span>
                    <span class="w-full text-center">Total QTY</span>
                    <span class="w-full text-center">Rendement (%)</span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">CPO Consume</span>
                    <span class="w-full text-right font-bold">{{ formatCurrency(Number(refinery.qty_cpo_olah).toFixed(2)) }}</span>
                    <span class="w-full text-right font-bold"></span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">RBDPO</span>
                    <span class="w-full text-right font-bold">{{ formatCurrency(Number(refinery.qty_rbdpo).toFixed(2)) }}</span>
                    <span class="w-full text-right font-bold">{{ formatCurrency(Number(refinery.rend_rbdpo).toFixed(2)) }}%</span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">PFAD</span>
                    <span class="w-full text-right font-bold">{{ formatCurrency(Number(refinery.qty_pfad).toFixed(2)) }}</span>
                    <span class="w-full text-right font-bold">{{ formatCurrency(Number(refinery.rend_pfad).toFixed(2)) }}%</span>
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
                    <tr v-for="(items, index) in direct" :key="index">
                        <td>{{items.name}}</td>
                        <td class="text-right">{{items.prop_1 == null ? null : formatCurrency(Number(items.prop_1).toFixed(2))+'%'}}</td>
                        <td class="text-right">{{items.prop_2 == null ? null : formatCurrency(Number(items.prop_2).toFixed(2))+'%'}}</td>
                        <td class="text-right">{{items.value == null ? null : Number(items.value) >= 0 ? formatCurrency(Number(items.value).toFixed(2)) : `(${formatCurrency((Number(items.value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{items.harga == null ? null : Number(items.harga) >= 0 ? formatCurrency(Number(items.harga).toFixed(2)) : `(${formatCurrency((Number(items.harga)*-1).toFixed(2))})`}}</td>
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
                    <tr v-for="(items, index) in in_direct" :key="index">
                        <td>{{items.name}}</td>
                        <td class="text-right">{{items.prop_1 == null ? null : formatCurrency(Number(items.prop_1).toFixed(2))+'%'}}</td>
                        <td class="text-right">{{items.prop_2 == null ? null : formatCurrency(Number(items.prop_2).toFixed(2))+'%'}}</td>
                        <td class="text-right">{{items.value == null ? null : Number(items.value) >= 0 ? formatCurrency(Number(items.value).toFixed(2)) : `(${formatCurrency((Number(items.value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{items.harga == null ? null : Number(items.harga) >= 0 ? formatCurrency(Number(items.harga).toFixed(2)) : `(${formatCurrency((Number(items.harga)*-1).toFixed(2))})`}}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="mt-3 text-sm">
                        <th class="text-left font-italic">Total Cost Refinery</th>
                        <th></th>
                        <th></th>
                        <th class="text-right">{{Number(total_cont_refinery.value) >= 0 ? formatCurrency(Number(total_cont_refinery.value).toFixed(2)) : `(${formatCurrency((Number(total_cont_refinery.value)*-1).toFixed(2))})`}}</th>
                        <th class="text-right">{{Number(total_cont_refinery.rp_kg) >= 0 ? formatCurrency(Number(total_cont_refinery.rp_kg).toFixed(2)) : `(${formatCurrency((Number(total_cont_refinery.rp_kg)*-1).toFixed(2))})`}}</th>
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
                    <tr class="mt-3 text-sm">
                        <th class="text-right font-medium font-italic">RBDPO</th>
                        <th></th>
                        <th class="text-right font-medium font-italic">{{formatCurrency(Number(alloc_cost.prop_rbdpo).toFixed(2))}}%</th>
                        <th class="text-right font-medium">{{(Number(total_cont_refinery.value) * Number(alloc_cost.prop_rbdpo) / 100) >= 0 ? formatCurrency((Number(total_cont_refinery.value) * Number(alloc_cost.prop_rbdpo) / 100).toFixed(2)) : `(${formatCurrency((Number(total_cont_refinery.value) * Number(alloc_cost.prop_rbdpo) / 100 * -1).toFixed(2))})`}}</th>
                        <th class="text-right font-medium">{{((Number(total_cont_refinery.value) * Number(alloc_cost.prop_rbdpo) / 100) / Number(refinery.qty_rbdpo)) >= 0 ? formatCurrency(((Number(total_cont_refinery.value) * Number(alloc_cost.prop_rbdpo) / 100) / Number(refinery.qty_rbdpo)).toFixed(2)) : `(${formatCurrency(((Number(total_cont_refinery.value) * Number(alloc_cost.prop_rbdpo) / 100) / Number(refinery.qty_rbdpo) * -1).toFixed(2))})`}}</th>
                    </tr>
                    <tr class="mt-3 text-sm">
                        <th class="text-right font-medium font-italic">PFAD</th>
                        <th></th>
                        <th class="text-right font-medium font-italic">{{formatCurrency(Number(alloc_cost.prop_pfad).toFixed(2))}}%</th>
                        <th class="text-right font-medium">{{(Number(total_cont_refinery.value) * Number(alloc_cost.prop_pfad) / 100) >= 0 ? formatCurrency((Number(total_cont_refinery.value) * Number(alloc_cost.prop_pfad) / 100).toFixed(2)) : `(${formatCurrency((Number(total_cont_refinery.value) * Number(alloc_cost.prop_pfad) / 100 * -1).toFixed(2))})`}}</th>
                        <th class="text-right font-medium">{{((Number(total_cont_refinery.value) * Number(alloc_cost.prop_pfad) / 100) / Number(refinery.qty_pfad)) >= 0 ? formatCurrency(((Number(total_cont_refinery.value) * Number(alloc_cost.prop_pfad) / 100) / Number(refinery.qty_pfad)).toFixed(2)) : `(${formatCurrency(((Number(total_cont_refinery.value) * Number(alloc_cost.prop_pfad) / 100) / Number(refinery.qty_pfad) *-1).toFixed(2))})`}}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>