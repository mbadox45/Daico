<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import DailyDmo from '@/api/target/DailyDmo.js';
    import {loadFrakIv60} from '@/views/load_data/hpp.js'
    import {loadFrakIV60_CostingHppController} from '@/controller/production/CostingHppController.js'
    import {formatCurrency} from '@/views/load_data/func_dummy.js'

    const props = defineProps({
        // tanggal:{
        //     type:String
        // },
        dummy60:{
            type:Array,
            default: () => {}
        }
    });

    // VARIABLE
    const loadingTable = ref(false)
    const list_main = ref([])
    const list_direct = ref([])
    const list_indirect = ref([])
    const list_packaging = ref([])
    const list_allocation = ref([])
    const total_frak = ref({
        total_value: 0,
        rp_kg: 0,
    })
    const total_pack = ref({
        total_value: 0,
        rp_kg: 0,
    })
    const stearin = ref({
        nama: "RBD Stearin Total", total_value: null, rp_kg: null
    })

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.dummy60;
            const frak = await loadFrakIV60_CostingHppController(response);
            list_main.value = frak.main
            list_direct.value = frak.direct
            list_indirect.value = frak.indirect
            list_allocation.value = frak.allocation
            list_packaging.value = frak.packaging
            total_frak.value = frak.total_frak
            total_pack.value = frak.total_pack
            stearin.value = frak.stearin
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
        }
    }

    watch(() => props.dummy60, loadData, { immediate: true });

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
            <span class="w-full font-bold font-italic text-2xl text-center">FRAKSINASI IV 60        </span>
            <div class="w-full flex flex-column gap-2 text-xs bg-yellow-100">
                <div class="flex justify-content-between gap-3 font-bold border-top-1 border-bottom-1 py-1">
                    <span class="w-full"></span>
                    <span class="w-full text-center">Proportion</span>
                    <span class="w-full text-center">Total QTY</span>
                    <span class="w-full text-center">Rendement (%)</span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1" v-for="(item, index) in list_main" :key="index">
                    <span class="w-full font-medium">{{item.name}}</span>
                    <span class="w-full text-right font-bold gap-2 flex justify-content-between"><small>{{ item.proportion }}</small> <small>{{ item.proportion2 }}</small></span>
                    <small class="w-full text-right font-bold">{{ item.qty }}</small>
                    <small class="w-full text-right font-bold">{{ item.rendement }}</small>
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
                        <th class="underline font-italic text-left" style="width: 50%;">Packaging Cost :</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
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
            </table>
            <table>
                <thead class="text-sm font-medium bg-gray-300">
                    <tr >
                        <th class="underline font-italic text-left" style="width: 50%;">Total Cost Fractionation IV-60</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;">{{total_frak.total_value}}</th>
                        <th class="text-right" style="width: 15%;">{{total_frak.rp_kg}}</th>
                    </tr>
                </thead>
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
                    <tr v-for="(items, index) in list_packaging" :key="index">
                        <td>{{items.name}}</td>
                        <td class="text-right">{{items.proportion}}</td>
                        <td class="text-right">{{items.proportion2}}</td>
                        <td class="text-right">{{items.total_value}}</td>
                        <td class="text-right">{{items.rp_kg}}</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead class="text-sm font-medium bg-gray-300">
                    <tr>
                        <th class="underline font-italic text-left" style="width: 50%;">Total Cost Fractionation IV-60 + Packaging</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;">{{total_pack.total_value}}</th>
                        <th class="text-right" style="width: 15%;">{{total_pack.rp_kg}}</th>
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
                    <tr v-for="(items, index) in list_allocation" :key="index">
                        <th class="text-right font-medium font-italic">{{items.name}}</th>
                        <th></th>
                        <th class="text-right font-medium font-italic">{{items.proportion}}</th>
                        <th class="text-right font-medium">{{items.total_value}}</th>
                        <th class="text-right font-medium">{{items.rp_kg}}</th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead class="text-sm font-medium">
                    <tr>
                        <th class=" font-italic text-right" colspan="3" style="width: 50%;">{{ stearin.nama }}</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;">{{ stearin.total_value }}</th>
                        <th class="text-right" style="width: 15%;">{{ stearin.rp_kg }}</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</template>