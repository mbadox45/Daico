<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';

    // API
    // import {loadForChartTarget} from '@/views/load_data/dashboard.js'
    import { formatCurrency, setChartOptions, setChartData } from "@/controller/dummy/func_dummy.js";
    import {statistikKinerja__DashboardController} from '@/controller/dashboard/DashboardController2.js';
    
    const props = defineProps({
        chart:{
            type:Array,
            default: () => {}
        }
    });

    // Variable
    const produksi = ref([])
    const sales = ref([])
    const loadingData = ref(false)

    
    // onMounted(() => {
    //     loadProduct()
    // });

    // Function
    const loadProduct = async() => {
        loadingData.value = true
        
        const response = props.chart;
        const data = await statistikKinerja__DashboardController(response)
        console.log(data)
        produksi.value = data.kinerja_produksi
        
        const sal = data.kinerja_sales
        const list_sales = []
        for (let i = 0; i < sal.length; i++) {
            const persen_real = ((sal[i].real/sal[i].rkap)*100).toFixed(0);
            // const persen_real = 40;
            const persen_rkap = persen_real > 100 ? 0 : (100 - persen_real).toFixed(0);
            list_sales.push({
                real: formatCurrency(Number(sal[i].real).toFixed(0)),
                rkap: formatCurrency(Number(sal[i].rkap).toFixed(0)),
                name: sal[i].name,
                persen_real: persen_real,
                persen_rkap: persen_rkap,
                chartData: setChartData(persen_real, persen_rkap , ['Real', 'RKAP']),
                chartOptions: setChartOptions(),
            })
        }
        sales.value = list_sales

        const prod = data.kinerja_produksi
        const list_prod = []
        for (let i = 0; i < prod.length; i++) {
            const persen_real = ((prod[i].real/prod[i].rkap)*100).toFixed(1);
            // const persen_real = 40;
            const persen_rkap = persen_real > 100 ? 0 : (100 - persen_real).toFixed(1);
            list_prod.push({
                real: formatCurrency(Number(prod[i].real).toFixed(0)),
                rkap: formatCurrency(Number(prod[i].rkap).toFixed(0)),
                name: prod[i].name,
                persen_real: persen_real,
                persen_rkap: persen_rkap,
                name_real: prod[i].name_real,
                name_rkap: prod[i].name_rkap,
                chartData: setChartData(persen_real, persen_rkap , [prod[i].name_real, prod[i].name_rkap]),
                chartOptions: setChartOptions(),
            })
        }
        produksi.value = list_prod
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

    watch(() => props.chart, loadProduct, { immediate: true });

</script>

<template>
    <div class="bg-white p-4 border-round shadow-3 flex flex-column gap-4 w-full ">
        <div class="flex justify-content-between border-bottom-1 border-gray-300 pb-3">
            <span class="font-medium text-xl uppercase">Statistics</span>
            <i class="pi pi-chart-pie text-xl"></i>
        </div>
        <div class="flex flex-column gap-5">
            <div class="w-full md:w-full flex flex-column gap-3">
                <ProgressBar v-if="loadingData == true" mode="indeterminate" style="height: 6px"></ProgressBar>
                <div v-else class="flex flex-column justify-content-between gap-3">
                    <div class="grid p-3">
                        <div class="col-12 text-center text-sm bg-green-500 border-round-top text-white border-bottom-2 border-white">
                            <span class="font-bold">REALISASI VS RKAP SALES (Kg)</span>
                        </div>
                        <div class="col-12 pb-0">
                            <div class="grid font-bold bg-green-500 text-white text-sm">
                                <div class="col-4 text-center">Product</div>
                                <div class="col-4 text-center">Real</div>
                                <div class="col-4 text-center">RKAP</div>
                            </div>
                        </div>
                        <div class="col-12 pb-0 pt-2 border-bottom-2 border-right-2 border-left-2 border-green-100" v-for="(item, index) in sales" :key="index">
                            <div class="grid align-items-center px-3">
                                <div class="col-4 flex flex-column align-items-center gap-2">
                                    <span class="uppercase font-semibold text-600 text-md">{{item.name}}</span>
                                    <Chart type="pie" :data="item.chartData" :options="item.chartOptions" class="w-7" />
                                    <small class="font-medium">{{item.persen_real}}%</small>
                                </div>
                                <div class="col-4 text-xs font-medium flex flex-column gap-2 text-right bg-blue-100">
                                    <div class="flex justify-content-between gap-2 text-blue-500">
                                        <span>Qty</span>
                                        <span>{{item.real}}</span>
                                    </div>
                                    <div class="flex justify-content-between gap-2 text-bluegray-700">
                                        <span>Persentage</span>
                                        <span>{{item.persen_real}}%</span>
                                    </div>
                                </div>
                                <div class="col-4 text-xs font-medium flex flex-column gap-2 text-right bg-yellow-100">
                                    <div class="flex justify-content-between gap-2 text-orange-500">
                                        <span>Qty</span>
                                        <span>{{item.rkap}}</span>
                                    </div>
                                    <div class="flex justify-content-between gap-2 text-bluegray-700">
                                        <span>Persentage</span>
                                        <span>{{item.persen_rkap}}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid p-3">
                        <div class="col-12 text-center text-sm bg-green-500 border-round-top text-white border-bottom-2 border-white">
                            <span class="font-bold uppercase">Kinerja Produksi</span>
                        </div>
                        <div class="col-12 pb-0">
                            <div class="grid font-bold bg-green-500 text-white text-sm">
                                <div class="col-4 text-center">Product</div>
                                <div class="col-4 text-center">Real</div>
                                <div class="col-4 text-center">RKAP</div>
                            </div>
                        </div>
                        <div class="col-12 pb-0 pt-2 border-bottom-2 border-right-2 border-left-2 border-green-100" v-for="(item, index) in produksi" :key="index">
                            <div class="grid align-items-center px-3">
                                <div class="col-4 flex flex-column align-items-center gap-2">
                                    <span class="uppercase font-semibold text-600 text-md">{{item.name}}</span>
                                    <Chart type="pie" :data="item.chartData" :options="item.chartOptions" class="w-7" />
                                    <small class="font-medium">{{item.persen_real}}%</small>
                                </div>
                                <div class="col-4 text-xs font-medium flex flex-column gap-2 text-right bg-blue-100">
                                    <div class="flex justify-content-between gap-2 text-blue-500">
                                        <span>Qty</span>
                                        <span>{{item.real}}</span>
                                    </div>
                                    <div class="flex justify-content-between gap-2 text-bluegray-700">
                                        <span>Persentage</span>
                                        <span>{{item.persen_real}}%</span>
                                    </div>
                                </div>
                                <div class="col-4 text-xs font-medium flex flex-column gap-2 text-right bg-yellow-100">
                                    <div class="flex justify-content-between gap-2 text-orange-500">
                                        <span>Qty</span>
                                        <span>{{item.rkap}}</span>
                                    </div>
                                    <div class="flex justify-content-between gap-2 text-bluegray-700">
                                        <span>Persentage</span>
                                        <span>{{item.persen_rkap}}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--<div v-for="(item, index) in sales" :key="index" class="w-full md:w-full flex flex-column justify-content-center align-items-center gap-2 py-3 px-3">
                        <div class="flex flex-column w-full align-items-center">
                            <span class="uppercase font-semibold text-600 text-xl">{{item.name}}</span>
                            <small class="text-500">{{item.persen_real}}%</small>
                        </div>
                        <Chart type="pie" :data="item.chartData" :options="item.chartOptions" class="w-7" />
                        <div class="flex flex-column gap- justify-content-center w-full">
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold text-blue-500">Real</span>
                                <span class="text-md text-500 font-medium text-blue-500">{{item.real}}</span>
                            </div>
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold text-orange-500">RKAP</span>
                                <span class="text-md text-500 font-medium text-orange-500">{{item.rkap}}</span>
                            </div>
                        </div>
                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>