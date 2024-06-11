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
            // console.log(props.datas);
            const refi = response.find(item => item.name == 'Refinery')
            const data = await loadRefinery(refi)
            refinery.value = data;
            console.log(refinery.value)
            loadingTable.value = false
        } catch (error) {
            refinery.value = {}
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
                    <span class="w-full text-right font-bold">{{ formatCurrency(Number(refinery.cpo).toFixed(2)) }}</span>
                    <span class="w-full text-right font-bold"></span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">RBDPO</span>
                    <span class="w-full text-right font-bold">{{ formatCurrency(Number(refinery.rbdpo).toFixed(2)) }}</span>
                    <span class="w-full text-right font-bold">{{ formatCurrency(Number(refinery.rend_rbdpo).toFixed(2)) }}%</span>
                </div>
                <div class="flex justify-content-between gap-3 px-2 pb-2 border-bottom-1">
                    <span class="w-full font-medium">PFAD</span>
                    <span class="w-full text-right font-bold">{{ formatCurrency(Number(refinery.pfad).toFixed(2)) }}</span>
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
                    <tr>
                        <td>Bahan Baku</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.bahan_baku_value) >= 0 ? formatCurrency(Number(refinery.bahan_baku_value).toFixed(2)) : `(${formatCurrency((Number(refinery.bahan_baku_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.bahan_baku_rp_kg) >= 0 ? formatCurrency(Number(refinery.bahan_baku_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.bahan_baku_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Bahan Bakar</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.bahan_bakar_value) >= 0 ? formatCurrency(Number(refinery.bahan_bakar_value).toFixed(2)) : `(${formatCurrency((Number(refinery.bahan_bakar_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.bahan_bakar_rp_kg) >= 0 ? formatCurrency(Number(refinery.bahan_bakar_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.bahan_bakar_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Bleaching Earth (BE)</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.be_value) >= 0 ? formatCurrency(Number(refinery.be_value).toFixed(2)) : `(${formatCurrency((Number(refinery.be_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.be_rp_kg) >= 0 ? formatCurrency(Number(refinery.be_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.be_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Phosporic Acid (PA)</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.pa_value) >= 0 ? formatCurrency(Number(refinery.pa_value).toFixed(2)) : `(${formatCurrency((Number(refinery.pa_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.pa_rp_kg) >= 0 ? formatCurrency(Number(refinery.pa_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.pa_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Others</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{0}}</td>
                        <td class="text-right">{{0}}</td>
                    </tr>
                    <tr>
                        <td>Biaya Analisa & Laboratorium</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.analisa_lab_value) >= 0 ? formatCurrency(Number(refinery.analisa_lab_value).toFixed(2)) : `(${formatCurrency((Number(refinery.analisa_lab_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.analisa_lab_rp_kg) >= 0 ? formatCurrency(Number(refinery.analisa_lab_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.analisa_lab_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Biaya Listrik</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.listrik_value) >= 0 ? formatCurrency(Number(refinery.listrik_value).toFixed(2)) : `(${formatCurrency((Number(refinery.listrik_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.listrik_rp_kg) >= 0 ? formatCurrency(Number(refinery.listrik_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.listrik_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Biaya Air</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.air_value) >= 0 ? formatCurrency(Number(refinery.air_value).toFixed(2)) : `(${formatCurrency((Number(refinery.air_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.air_rp_kg) >= 0 ? formatCurrency(Number(refinery.air_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.air_rp_kg)*-1).toFixed(2))})`}}</td>
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
                    <tr>
                        <td>Gaji, Tunjangan & Biaya Sosial Karyawan Pimpinan</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.gaji_pimpinan_value) >= 0 ? formatCurrency(Number(refinery.gaji_pimpinan_value).toFixed(2)) : `(${formatCurrency((Number(refinery.gaji_pimpinan_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.gaji_pimpinan_rp_kg) >= 0 ? formatCurrency(Number(refinery.gaji_pimpinan_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.gaji_pimpinan_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Gaji, Tunjangan & Biaya Sosial Karyawan Pelaksana</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.gaji_pelaksana_value) >= 0 ? formatCurrency(Number(refinery.gaji_pelaksana_value).toFixed(2)) : `(${formatCurrency((Number(refinery.gaji_pelaksana_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.gaji_pelaksana_rp_kg) >= 0 ? formatCurrency(Number(refinery.gaji_pelaksana_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.gaji_pelaksana_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Biaya Assuransi Pabrik</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.asuransi_value) >= 0 ? formatCurrency(Number(refinery.asuransi_value).toFixed(2)) : `(${formatCurrency((Number(refinery.asuransi_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.asuransi_rp_kg) >= 0 ? formatCurrency(Number(refinery.asuransi_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.asuransi_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Pengelolaan Limbah Pabrik Oleh Pihak Ketiga</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.limbah_value) >= 0 ? formatCurrency(Number(refinery.limbah_value).toFixed(2)) : `(${formatCurrency((Number(refinery.limbah_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.limbah_rp_kg) >= 0 ? formatCurrency(Number(refinery.limbah_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.limbah_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Biaya Bengkel & Pemeliharaan</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.bengkel_value) >= 0 ? formatCurrency(Number(refinery.bengkel_value).toFixed(2)) : `(${formatCurrency((Number(refinery.bengkel_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.bengkel_rp_kg) >= 0 ? formatCurrency(Number(refinery.bengkel_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.bengkel_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                    <tr>
                        <td>Depresiasi</td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{Number(refinery.depresiasi_value) >= 0 ? formatCurrency(Number(refinery.depresiasi_value).toFixed(2)) : `(${formatCurrency((Number(refinery.depresiasi_value)*-1).toFixed(2))})`}}</td>
                        <td class="text-right">{{Number(refinery.depresiasi_rp_kg) >= 0 ? formatCurrency(Number(refinery.depresiasi_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.depresiasi_rp_kg)*-1).toFixed(2))})`}}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="mt-3 text-sm">
                        <th class="text-left font-italic">Total Cost Refinery</th>
                        <th></th>
                        <th></th>
                        <th class="text-right">{{Number(refinery.total_cont_refinery_value) >= 0 ? formatCurrency(Number(refinery.total_cont_refinery_value).toFixed(2)) : `(${formatCurrency((Number(refinery.total_cont_refinery_value)*-1).toFixed(2))})`}}</th>
                        <th class="text-right">{{Number(refinery.total_cont_refinery_rp_kg) >= 0 ? formatCurrency(Number(refinery.total_cont_refinery_rp_kg).toFixed(2)) : `(${formatCurrency((Number(refinery.total_cont_refinery_rp_kg)*-1).toFixed(2))})`}}</th>
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
                        <th class="text-right font-medium font-italic">{{formatCurrency(Number(refinery.alloc_cost_rbdpo).toFixed(2))}}%</th>
                        <th class="text-right font-medium">{{(Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_rbdpo) / 100) >= 0 ? formatCurrency((Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_rbdpo) / 100).toFixed(2)) : `(${formatCurrency((Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_rbdpo) / 100).toFixed(2))})`}}</th>
                        <th class="text-right font-medium">{{(Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_rbdpo) / Number(refinery.rend_rbdpo) / 100) >= 0 ? formatCurrency((Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_rbdpo) / Number(refinery.rend_rbdpo) / 100).toFixed(2)) : `(${formatCurrency((Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_rbdpo) / Number(refinery.rend_rbdpo) / 100).toFixed(2))})`}}</th>
                    </tr>
                    <tr class="mt-3 text-sm">
                        <th class="text-right font-medium font-italic">PFAD</th>
                        <th></th>
                        <th class="text-right font-medium font-italic">{{formatCurrency(Number(refinery.alloc_cost_pfad).toFixed(2))}}%</th>
                        <th class="text-right font-medium">{{(Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_pfad) / 100) >= 0 ? formatCurrency((Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_pfad) / 100).toFixed(2)) : `(${formatCurrency((Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_pfad) / 100).toFixed(2))})`}}</th>
                        <th class="text-right font-medium">{{(Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_pfad) / Number(refinery.rend_pfad) / 100) >= 0 ? formatCurrency((Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_pfad) / Number(refinery.rend_pfad) / 100).toFixed(2)) : `(${formatCurrency((Number(refinery.total_cont_refinery_value) * Number(refinery.alloc_cost_pfad) / Number(refinery.rend_pfad) / 100).toFixed(2))})`}}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>