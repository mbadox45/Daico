<script setup>
import { ref, defineProps, watch, onMounted } from 'vue';
import {revenueYtd, grossProfit, ebitda, netProfit, cashBalance, cffPayment, cashFlow, cfiPayment} from '@/controller/dashboard/FinancialDashController.js';
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
        await revenueYtd(), 
        await grossProfit(), 
        await ebitda(),
        await netProfit(),
        await cashBalance(),
        await cashFlow(),
        await cfiPayment(),
        await cffPayment(),
    )

    console.log(listAll)

    listChart.value = listAll;

};

</script>

<template>
    <div class="grid">
        <div v-for="(item, index) in listChart" :key="index" :class="index == (listChart.length - 1) && listChart.length % 2 !== 0 ? 'col-12' : 'col-6'">
            <div class="bg-white p-4 border-round shadow-3 flex flex-column gap-4 w-full">
                <div class="flex justify-content-between border-bottom-1 border-gray-300 pb-1">
                    <span class="font-medium text-xl uppercase">{{ item.name }}</span>
                    <i class="pi pi-chart-pie text-xl"></i>
                      
                </div>
                <div class="flex justify-content-between border-bottom-1 border-gray-300 pb-1">
                    <span v-if="item.total !== null && item.total !== undefined" class="font-medium text-xs uppercase">
                        {{ item.total }}
                    </span>
                    <span v-else class="font-medium text-xs uppercase">
                        *
                    </span>
                </div>
                <div class="flex flex-column gap-5">
                    <div class="w-full md:w-full flex flex-column gap-3">
                        <div class="w-full md:w-full flex flex-column gap-3">
                            <!-- <ProgressBar v-if="loadingData" mode="indeterminate" style="height: 6px"></ProgressBar> -->
                            <Chart 
                                :data="item.chartData" 
                                :options="item.chartOptions" 
                                class="w-full"
                                :height="item.type == 'bar' ? '133' : '300'"
                            />
                            <!-- <ApexCharts
                                type="bar"
                                :series="item.chartData.series"
                                :options="item.chartOptions" 
                                class="w-full"
                                :height="item.type == 'bar' ? '280' : '300'"
                            /> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
