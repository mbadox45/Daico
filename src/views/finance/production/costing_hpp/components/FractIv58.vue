<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import DailyDmo from '@/api/target/DailyDmo.js';
    import {loadFrakIv58} from '@/views/load_data/hpp.js'
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
    const load = ref({})
    const proportion1 = ref({})
    const proportion_packing = ref({})
    const direct = ref([])
    const in_direct = ref([])
    const allocation = ref([])
    const total = ref({})

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            const refi = response.find(item => item.name == 'Fraksinasi (IV-58)')
            const data = await loadFrakIv58(refi)
            load.value = data
            proportion1.value = refi.proportion1
            proportion_packing.value = refi.proportion_packing
            direct.value = refi.direct
            in_direct.value = refi.in_direct
            allocation.value = refi.allocation
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
            <span class="w-full font-bold font-italic text-2xl text-center">FRAKSINASI IV 58</span>
            <div class="w-full flex flex-column gap-2 text-xs bg-yellow-100">
                <div class="flex justify-content-between gap-3 font-bold border-top-1 border-bottom-1 py-1">
                    <span class="w-full"></span>
                    <span class="w-full text-center">Proportion</span>
                    <span class="w-full text-center">Total QTY</span>
                    <span class="w-full text-center">Rendement (%)</span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">RBDPO Consume</span>
                    <span class="w-full text-right font-bold"></span>
                    <small class="w-full text-right font-bold">{{ load.rbdpo }}</small>
                    <span class="w-full text-right font-bold"></span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">RBD Olein IV-58</span>
                    <span class="w-full text-right font-bold"></span>
                    <small class="w-full text-right font-bold">{{ load.rbdo }}</small>
                    <small class="w-full text-right font-bold">{{ load.rend_rbdo }}%</small>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">RBD Stearin</span>
                    <span class="w-full text-right font-bold"></span>
                    <small class="w-full text-right font-bold">{{ load.rbds }}</small>
                    <small class="w-full text-right font-bold">{{ load.rend_rbds }}%</small>
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
                        <th class="underline font-italic text-left" style="width: 50%;">Packaging Cost :</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
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
            </table>
            <table>
                <thead class="text-sm font-medium bg-gray-300">
                    <tr >
                        <th class="underline font-italic text-left" style="width: 50%;">Total Cost Fractionation IV-58</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;">{{total.cost == null ? null : Number(total.cost) >= 0 ? formatCurrency(Number(total.cost).toFixed(2)) : `(${formatCurrency((Number(total.cost)*-1).toFixed(2))})`}}</th>
                        <th class="text-right" style="width: 15%;">{{total.harga == null ? null : Number(total.harga) >= 0 ? formatCurrency(Number(total.harga).toFixed(2)) : `(${formatCurrency((Number(total.harga)*-1).toFixed(2))})`}}</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead class="text-sm font-medium">
                    <tr>
                        <th class="underline font-italic text-right font-normal" style="width: 50%;">Allocation Cost :</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
                    </tr>
                    <tr v-for="(items, index) in allocation" :key="index">
                        <th class=" font-italic text-right" style="width: 50%;">{{items.name}}</th>
                        <th class="text-right">{{items.prop_1 == null ? null : formatCurrency(Number(items.prop_1).toFixed(2))+'%'}}</th>
                        <th class="text-right">{{items.prop_2 == null ? null : formatCurrency(Number(items.prop_2).toFixed(2))+'%'}}</th>
                        <th class="text-right">{{items.value == null ? null : Number(items.value) >= 0 ? formatCurrency(Number(items.value).toFixed(2)) : `(${formatCurrency((Number(items.value)*-1).toFixed(2))})`}}</th>
                        <th class="text-right">{{items.harga == null ? null : Number(items.harga) >= 0 ? formatCurrency(Number(items.harga).toFixed(2)) : `(${formatCurrency((Number(items.harga)*-1).toFixed(2))})`}}</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</template>