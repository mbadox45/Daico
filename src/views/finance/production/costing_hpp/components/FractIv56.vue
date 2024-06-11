<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import DailyDmo from '@/api/target/DailyDmo.js';
    import {loadFrakIv56} from '@/views/load_data/hpp.js'
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

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            const refi = response.find(item => item.name == 'Fraksinasi (IV-56)')
            const data = await loadFrakIv56(refi)
            load.value = data
            console.log(load.value)
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
            <span class="w-full font-bold font-italic text-2xl text-center">FRAKSINASI IV 56</span>
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
                    <span class="w-full font-medium">RBD Olein IV-56</span>
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
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">Minyakita - 1L</span>
                    <span class="w-full text-right font-bold gap-2 flex justify-content-between"><small>{{ load.prop1 }}</small> <small>{{ load.prop1L }}%</small></span>
                    <small class="w-full text-right font-bold">{{ load.qty_1L }}</small>
                    <small class="w-full text-right font-bold">{{ load.rend_1L }}%</small>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">Minyakita - 2L</span>
                    <span class="w-full text-right font-bold gap-2 flex justify-content-between"><small>{{ load.prop1 }}</small> <small>{{ load.prop2L }}%</small></span>
                    <small class="w-full text-right font-bold">{{ load.qty_2L }}</small>
                    <small class="w-full text-right font-bold">{{ load.rend_2L }}%</small>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-bold font-italic">Additional</span>
                    <span class="w-full text-right font-bold gap-2 flex justify-content-between"></span>
                    <small class="w-full text-right font-bold">{{ load.additional }}</small>
                    <span class="w-full text-right font-bold"></span>
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
                    <tr>
                        <td>Bahan Baku</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Bahan Bakar</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Others</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Biaya Analisa & Laboratorium</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Biaya Listrik</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Biaya Air</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead class="text-sm font-medium">
                    <tr >
                        <th class="underline font-italic text-left" style="width: 50%;">In-Direct Cost :</th>
                        <th class="underline font-italic text-left" colspan="2"></th>
                        <th class="" style="width: 15%;"></th>
                        <th class="" style="width: 15%;"></th>
                    </tr>
                </thead>
                <tbody class="text-sm font-medium">
                    <tr>
                        <td>Gaji, Tunjangan & Biaya Sosial Karyawan Pimpinan</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Gaji, Tunjangan & Biaya Sosial Karyawan Pelaksana</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Biaya Assuransi Pabrik</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Biaya Bengkel & Pemeliharaan</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Depresiasi</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead class="text-sm font-medium bg-gray-300">
                    <tr >
                        <th class="underline font-italic text-left" style="width: 50%;">Total Cost Fractionation IV-56</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
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
                    <tr>
                        <td>Gaji & Tunjangan</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Minyakita - 1L</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Minyakita - 2L</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Bahan Kimia</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Pengangkutan / Langsir</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Bahan Pengepakan Lainnya</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Biaya Asuransi Gudang & Filling</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                    <tr>
                        <td>Depresiasi (Packaging)</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">0%</td>
                        <td class="text-right">-</td>
                        <td class="text-right">-</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead class="text-sm font-medium bg-gray-300">
                    <tr>
                        <th class="underline font-italic text-left" colspan="3" style="width: 50%;">Total Cost Fractionation IV-56 + Packaging</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
                    </tr>
                </thead>
            </table>
            <table>
                <thead class="text-sm font-medium">
                    <tr>
                        <th class="underline font-italic text-right font-normal" colspan="3" style="width: 50%;">Allocation Cost :</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
                    </tr>
                    <tr>
                        <th class=" font-italic text-right" colspan="3" style="width: 50%;">RBD Olein IV-56</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
                    </tr>
                    <tr>
                        <th class=" font-italic text-right" colspan="3" style="width: 50%;">RBD Stearin</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
                    </tr>
                    <tr>
                        <th class=" font-italic text-right" colspan="3" style="width: 50%;">Minyakita - 1L</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
                    </tr>
                    <tr>
                        <th class=" font-italic text-right" colspan="3" style="width: 50%;">Minyakita - 2L</th>
                        <th class="" colspan="2"></th>
                        <th class="text-right" style="width: 15%;"></th>
                        <th class="text-right" style="width: 15%;"></th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</template>