<script setup>
    import { ref, defineProps, watch, onMounted } from 'vue';
    import moment from "moment";
    import { cpoKpbYear } from '@/controller/dashboard/DashboardController2.js';
    import { setChartOptionsCpoKpbn } from "@/controller/dummy/func_dummy.js";
    import ApexCharts from 'vue3-apexcharts';
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

    const props = defineProps({
        chart: {
            type: Array,
            default: () => []
        },
        year: {
            type: Number,
            default: new Date().getFullYear()
        }
    });

    onMounted(() => {
        loadProduct();
    });

    const optionView = ref({});
    const dataView = ref({
        series: [],
    });
    const monthName = ref('');
    const yearName = ref('');
    const loadingData = ref(false);
    const showDialog = ref(false);
    const chartOptions = ref({});
    const chartSeries = ref([]);

    const loadProduct = async () => {
        loadingData.value = true;

        const response = props.chart;
        const data = await cpoKpbYear(response);
        const labels = [];
        const dataChart = [];
        const records = [];
        for (let i = 0; i < data.length; i++) {
            labels.push(moment(data[i].month, 'MMMM').format('MMM'));
            dataChart.push(formatCurrency(Number(data[i].avg).toFixed(2)));
            records.push({
                id: i,
                name: data[i].month,
                records: data[i].records
            });
        }
        chartOptions.value = {
            chart: {
                events: {
                    click: function(event, chartContext, opts) {
                        const index = opts.dataPointIndex;
                        if (index != null && index >= 0) {
                            const loadRecord = records.find(item => item.id === index);
                            handleChartClick(loadRecord);
                        }
                    }
                },
                id: 'cpoKPBNChart',
                toolbar: {
                    show: true // menu button
                }
            },
            xaxis: {
                categories: labels
            },
            title: {
                text: `CPO KPBN ${props.year}`
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        position: 'top' // position labels inside the bars
                    }
                }
            },
            dataLabels: {
                enabled: false // labels inside the bars
            },
            colors:['rgba(249, 115, 22, 0.2)'],
            stroke: {   //border
                show: true,
                width: 1,
                colors: ['rgb(249, 115, 22)'],
            }
        };
        chartSeries.value = [
            {
                name: 'CPO KPBN',
                data: dataChart
            }
        ];
        loadingData.value = false;
    };

    const handleChartClick = async (data) => {
        showDialog.value = true;
        const response = data.records;
        const labels = [];
        const dataChart = [];
        const label = 'CPO KPBN';

        for (let i = 0; i < response.length; i++) {
            labels.push(moment(response[i].tanggal).format('DD'));
            dataChart.push(formatCurrency(Number(response[i].avg).toFixed(2)));
        }

        monthName.value = data.name;
        optionView.value = setChartOptionsCpoKpbn(labels);
        dataView.value = {
            series: [
                {
                    name: label,
                    data: dataChart
                }
            ]
        };
    };

    watch(() => props.chart, loadProduct, { immediate: true });
</script>

<template>
    <div class="bg-white p-4 border-round shadow-3 flex flex-column gap-4 w-full">
        <div class="flex justify-content-between border-bottom-1 border-gray-300 pb-3">
            <i class="pi pi-chart-pie text-xl"></i>
        </div>
        <div class="flex flex-column gap-5">
            <div class="w-full md:w-full flex flex-column gap-3">
                <ProgressBar v-if="loadingData" mode="indeterminate" style="height: 6px"></ProgressBar>
                <div v-else class="flex flex-column justify-content-between gap-3">
                    <ApexCharts
                        type="bar"
                        :options="chartOptions"
                        :series="chartSeries"
                        class="w-full"
                        height="300"
                    />
                </div>
            </div>
        </div>
        <Dialog v-model:visible="showDialog" modal :header="`Detailed Records for ${monthName}`" :style="{ width: '80rem' }">
            <ApexCharts
                type="bar"
                :options="optionView"
                :series="dataView.series"
                class="w-full"
                height="300"
            />
        </Dialog>
    </div>
</template>