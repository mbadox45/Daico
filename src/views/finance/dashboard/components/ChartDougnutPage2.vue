<script setup>
    // Vue Component
    import { ref, computed } from 'vue';

    // API
    import {listKinerjaProduksi, listRealisasiRkapSales} from '@/api/DummyData.js'

    // Variable
    const produksi = ref([])
    const sales = ref([])
    const list_sales = listRealisasiRkapSales
    const list_produksi = listKinerjaProduksi

    // Function
    const loadProduct = () => {

        sales.value = []
        for (let a = 0; a < list_sales.length; a++) {
            const persen_real = ((list_sales[a].real/list_sales[a].rkap)*100).toFixed(1);
            const persen_rkap = (100 - persen_real).toFixed(1);
            sales.value.push({
                real: formatCurrency(list_sales[a].real),
                rkap: formatCurrency(list_sales[a].rkap),
                jenis: list_sales[a].jenis,
                persen_real: persen_real,
                name_real: list_sales[a].name_real,
                name_rkap: list_sales[a].name_rkap,
                chartData: setChartData(persen_real, persen_rkap , [list_sales[a].name_real, list_sales[a].name_rkap]),
                chartOptions: setChartOptions(),
            })
        }

        produksi.value = []
        for (let a = 0; a < list_produksi.length; a++) {
            const persen_real = ((list_produksi[a].real/list_produksi[a].rkap)*100).toFixed(1);
            const persen_rkap = (100 - persen_real).toFixed(1);
            produksi.value.push({
                real: formatCurrency(list_produksi[a].real),
                rkap: formatCurrency(list_produksi[a].rkap),
                jenis: list_produksi[a].jenis,
                persen_real: persen_real,
                name_real: list_produksi[a].name_real,
                name_rkap: list_produksi[a].name_rkap,
                chartData: setChartData(persen_real, persen_rkap, [list_produksi[a].name_real, list_produksi[a].name_rkap]),
                chartOptions: setChartOptions(),
            })
        }
    }

    const setChartData = (real, rkap, label) => {
        const documentStyle = getComputedStyle(document.body);
        
        return {
            labels: label,
            datasets: [
                {
                    data: [real, rkap],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--orange-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--orange-400')],
                    borderWidth: 0,
                    borderRadius: 5,
                }
            ],
        };
    }

    const setChartOptions = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        return {
            plugins: {
                legend: {
                    labels: {
                        cutout: '60%',
                        color: textColor,
                        rotation: 0,
                        // circumference: 180
                    },
                    display: false,
                },
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                rotation: -0.5 * Math.PI, // 180 degrees
            }
        };
    };

    function formatCurrency(amount) {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return parts.join(',');
    }

    loadProduct()
</script>

<template>
    <div class="bg-white p-4 border-round shadow-3 flex flex-column gap-4 w-full">
        <div class="flex justify-content-between border-bottom-1 border-gray-300 pb-3">
            <span class="font-medium text-xl">Statistics</span>
            <i class="pi pi-chart-pie text-xl"></i>
        </div>
        <div>
            <span class="font-medium text-teal-600">REALISASI VS RKAP SALES (Kg)</span>
            <div class="flex flex-column justify-content-between gap-3 mt-2">
                <div v-for="(item, index) in sales" :key="index" class="w-full md:w-full flex justify-content-between align-items-center gap-2 py-3">
                    <Chart type="doughnut" :data="item.chartData" :options="item.chartOptions" class="w-1 p-1" />
                    <div class="flex flex-column w-full">
                        <span class="uppercase font-semibold text-600 text-xl">{{item.jenis}}</span>
                        <small class="text-500">{{item.persen_real}}%</small>
                    </div>
                    <div class="flex gap-3 justify-content-end w-full">
                        <div class="flex flex-column text-right w-4">
                            <span class="text-xs font-bold text-blue-500">{{item.name_real}}</span>
                            <span class="text-md text-500 font-medium text-blue-500">{{item.real}}</span>
                        </div>
                        <div class="w-2 text-center">
                            <i class="pi pi-caret-left text-400"></i>
                            <i class="pi pi-caret-right text-400"></i>
                        </div>
                        <div class="flex flex-column w-4">
                            <span class="text-xs font-bold text-orange-500">{{item.name_rkap}}</span>
                            <span class="text-md text-500 font-medium text-orange-500">{{item.rkap}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <span class="font-medium text-teal-600">Kinerja Produksi</span>
            <div class="flex flex-column justify-content-between gap-3 mt-2">
                <div v-for="(item, index) in produksi" :key="index" class="w-full md:w-full flex justify-content-between align-items-center gap-2 py-3">
                    <Chart type="doughnut" :data="item.chartData" :options="item.chartOptions" class="w-1 p-1" />
                    <div class="flex flex-column w-full">
                        <span class="uppercase font-semibold text-600 text-xl">{{item.jenis}}</span>
                        <small class="text-500">{{item.persen_real}}%</small>
                    </div>
                    <div class="flex gap-3 justify-content-end w-full">
                        <div class="flex flex-column text-right w-4">
                            <span class="text-xs font-bold text-blue-500">{{item.name_real}}</span>
                            <span class="text-md text-500 font-medium text-blue-500">{{item.real}}</span>
                        </div>
                        <div class="w-2 text-center">
                            <i class="pi pi-caret-left text-400"></i>
                            <i class="pi pi-caret-right text-400"></i>
                        </div>
                        <div class="flex flex-column w-4">
                            <span class="text-xs font-bold text-orange-500">{{item.name_rkap}}</span>
                            <span class="text-md text-500 font-medium text-orange-500">{{item.rkap}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="flex flex-column gap-2">
        <div class="gap-7 flex align-items-start">
            <div class="card flex flex-wrap w-full border-round shadow-3">
                <div class="w-full bg-white text-center border-bottom-1 pb-3 border-gray-300">
                    <span class="text-sm font-bold">REALISASI VS RKAP SALES (Kg)</span>
                </div>
                <Card v-for="(item, index) in sales" :key="index" class="w-4 border-noround shadow-none" :class="`${index <= (sales.length - 1) && index > 0 ? 'border-left-1 border-gray-200' : ''}`">
                    <template #content>
                        <div class="py-0 px-0 gap-2 flex flex-column justify-content-center align-items-center w-full relative">
                            <strong class="text-xl text-cyan-700">{{item.jenis}}</strong>
                            <Chart type="doughnut" :data="item.chartData" :options="item.chartOptions" class="w-full" />
                            <span class="absolute mb-3 font-bold">{{item.persen_real}}%</span>
                            <Divider/>
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold">Real</span>
                                <span class="text-xs font-semibold">{{item.real}}</span>
                            </div>
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold">RKAP PMG-1</span>
                                <span class="text-xs font-semibold">{{item.rkap}}</span>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <div class="card flex flex-wrap w-8 border-round shadow-3">
                <div class="w-full bg-white text-center border-bottom-1 pb-3 border-gray-300">
                    <span class="text-sm font-bold uppercase">Kinerja Produksi</span>
                </div>
                <Card v-for="(item, index) in produksi" :key="index" class="w-6 border-noround shadow-none" :class="`${index <= (produksi.length - 1) && index > 0 ? 'border-left-1 border-gray-200' : ''}`">
                    <template #content>
                        <div class="py-0 px-0 gap-2 flex flex-column justify-content-center align-items-center w-full relative">
                            <strong class="text-xl text-cyan-700">{{item.jenis}}</strong>
                            <Chart type="doughnut" :data="item.chartData" :options="item.chartOptions" class="w-full" />
                            <span class="absolute mb-3 font-bold">{{item.persen_real}}%</span>
                            <Divider/>
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold">Real</span>
                                <span class="text-xs font-semibold">{{item.real}}</span>
                            </div>
                            <div class="flex justify-content-between w-full">
                                <span class="text-xs font-bold">RKAP PMG-1</span>
                                <span class="text-xs font-semibold">{{item.rkap}}</span>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div> -->
</template>