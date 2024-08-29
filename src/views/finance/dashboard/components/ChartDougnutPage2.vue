<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';

    // API
    import {loadForChartTarget} from '@/views/load_data/dashboard.js'
    import {formatCurrency, setChartOptions, setChartData} from '@/views/load_data/func_dummy.js'
    
    const props = defineProps({
        tanggal:{
            type:String
        },
        chart:{
            type:Array,
            default: () => {}
        }
    });

    // Variable
    const produksi = ref([])
    const sales = ref([])
    const loadingData = ref(false)
    const days = props.tanggal

    const date = computed(()=> moment(props.tanggal).format('DD MMMM YYYY'))
    watch(() => props.tanggal, (newVal) => {loadProduct(newVal)});
    
    onMounted(() => {
        loadProduct(props.tanggal)
    });

    // Function
    const loadProduct = async(tgl) => {
        loadingData.value = true
        // const data_target = await loadForChartTarget(tgl)
        // console.log(data_target)

        // sales.value = []
        // const list_sales = data_target.sales;
        // const list_produksi = data_target.produksi;
        // for (let a = 0; a < list_sales.length; a++) {
        //     const persen_real = ((list_sales[a].real/list_sales[a].rkap)*100).toFixed(1);
        //     const persen_rkap = (100 - persen_real).toFixed(1);
        //     sales.value.push({
        //         real: formatCurrency(list_sales[a].real),
        //         rkap: formatCurrency(list_sales[a].rkap),
        //         jenis: list_sales[a].jenis,
        //         persen_real: persen_real,
        //         name_real: list_sales[a].name_real,
        //         name_rkap: list_sales[a].name_rkap,
        //         chartData: setChartData(persen_real, persen_rkap , [list_sales[a].name_real, list_sales[a].name_rkap]),
        //         chartOptions: setChartOptions(),
        //     })
        // }

        // produksi.value = []
        // for (let a = 0; a < list_produksi.length; a++) {
        //     const persen_real = ((list_produksi[a].real/list_produksi[a].rkap)*100).toFixed(1);
        //     const persen_rkap = (100 - persen_real).toFixed(1);
        //     produksi.value.push({
        //         real: formatCurrency(list_produksi[a].real),
        //         rkap: formatCurrency(list_produksi[a].rkap),
        //         jenis: list_produksi[a].jenis,
        //         persen_real: persen_real,
        //         name_real: list_produksi[a].name_real,
        //         name_rkap: list_produksi[a].name_rkap,
        //         chartData: setChartData(persen_real, persen_rkap, [list_produksi[a].name_real, list_produksi[a].name_rkap]),
        //         chartOptions: setChartOptions(),
        //     })
        // }
        loadingData.value = false
    }
</script>

<template>
    <div class="bg-white p-4 border-round shadow-3 flex flex-column gap-4 w-full mt-4">
        <div class="flex justify-content-between border-bottom-1 border-gray-300 pb-3">
            <span class="font-medium text-xl">Statistics</span>
            <i class="pi pi-chart-pie text-xl"></i>
        </div>
        <div class="flex gap-5">
            <div class="w-9">
                <span class="font-medium text-teal-600">REALISASI VS RKAP SALES (Kg)</span>
                <ProgressBar v-if="loadingData == true" mode="indeterminate" style="height: 6px"></ProgressBar>
                <div v-else class="flex justify-content-between gap-3 mt-2 bg-gray-300 p-2 border-round">
                    <div v-for="(item, index) in sales" :key="index" class="w-full md:w-full flex flex-column justify-content-center align-items-center gap-2 py-3 px-3">
                        <div class="flex flex-column w-full align-items-center">
                            <span class="uppercase font-semibold text-600 text-xl">{{item.jenis}}</span>
                            <small class="text-500">{{item.persen_real}}%</small>
                        </div>
                        <Chart type="doughnut" :data="item.chartData" :options="item.chartOptions" class="w-7" />
                        <div class="flex flex-column gap- justify-content-center w-full">
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold text-blue-500">{{item.name_real}}</span>
                                <span class="text-md text-500 font-medium text-blue-500">{{item.real}}</span>
                            </div>
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold text-orange-500">{{item.name_rkap}}</span>
                                <span class="text-md text-500 font-medium text-orange-500">{{item.rkap}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-6">
                <span class="font-medium text-teal-600 uppercase">Kinerja Produksi</span>
                <ProgressBar v-if="loadingData == true" mode="indeterminate" style="height: 6px"></ProgressBar>
                <div v-else class="flex justify-content-between gap-3 mt-2 bg-gray-300 p-2 border-round">
                    <div v-for="(item, index) in produksi" :key="index" class="w-full md:w-full flex flex-column justify-content-center align-items-center gap-2 py-3 px-3">
                        <div class="flex flex-column w-full align-items-center">
                            <span class="uppercase font-semibold text-600 text-xl">{{item.jenis}}</span>
                            <small class="text-500">{{item.persen_real}}%</small>
                        </div>
                        <Chart type="doughnut" :data="item.chartData" :options="item.chartOptions" class="w-7" />
                        <div class="flex flex-column gap- justify-content-center w-full">
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold text-blue-500">{{item.name_real}}</span>
                                <span class="text-md text-500 font-medium text-blue-500">{{item.real}}</span>
                            </div>
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold text-orange-500">{{item.name_rkap}}</span>
                                <span class="text-md text-500 font-medium text-orange-500">{{item.rkap}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>