<script setup>
import { ref, defineProps, watch, onMounted } from 'vue';
// import {revenueYtd, grossProfit, ebitda, netProfit, cashBalance, cffPayment, cashFlow, cfiPayment} from '@/controller/dashboard/TransDashController.js';
import {salesRevenue, salesVolumeBulk, salesVolumeRetail} from '@/controller/dashboard/TransDashController.js';
// import { Chart, registerables } from 'chart.js';
import ApexCharts from 'vue3-apexcharts'

onMounted(() => {
    loadProduct()
});

// const chartData = ref();
// const chartOptions = ref();
const listChart = ref([]);

const loadProduct = async () => {
    const dateString = `2024-04-01`;

    const listAll = []

    listAll.push(
        await salesRevenue(),
        await salesVolumeBulk(),
        await salesVolumeRetail(),
    )

    console.log(listAll)

    listChart.value = listAll;

};

</script>

<template>
    <div class="grid">
        <div v-for="(item, index) in listChart" :key="index" :class="index == (listChart.length - 1) && listChart.length % 3 !== 0 ? 'col-12' : 'col-4'">
            <div class="bg-white p-4 border-round border-2 border-gray-300 flex flex-column gap-4 w-full">
                <div class="flex justify-content-between border-bottom-1 border-gray-300 pb-1">
                    <span class="font-medium text-xl">{{ item.name }}</span>
                    <i class="pi pi-chart-pie text-xl"></i>
                      
                </div>
                <!-- <div class="flex justify-content-between border-bottom-1 border-gray-300 pb-1">
                    <span v-if="item.total !== null && item.total !== undefined" class="font-medium text-xs">
                        {{ item.total }}
                    </span>
                    <span v-else class="font-medium text-xs">
                        *
                    </span>
                </div> -->
                <div class="flex flex-column gap-5">
                    <div class="w-full md:w-full flex flex-column gap-3">
                        <div class="w-full md:w-full flex flex-column gap-3">
                            <!-- <ProgressBar v-if="loadingData" mode="indeterminate" style="height: 6px"></ProgressBar> -->
                            <!-- <Chart 
                                :data="item.chartData" 
                                :options="item.chartOptions" 
                                class="w-full"
                                :height="item.type == 'bar' ? '133' : '300'"
                            /> -->
                            <ApexCharts
                                :type="item.type"
                                :series="item.series"
                                :options="item.chartOptions" 
                                class="w-full"
                                height="330"
                                style="z-index: 1 !important;"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
