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
                real: list_sales[a].real.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }).replace('Rp', 'Rp ').replace(/,00$/, ''),
                rkap: list_sales[a].rkap.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }).replace('Rp', 'Rp ').replace(/,00$/, ''),
                jenis: list_sales[a].jenis,
                persen_real: persen_real,
                chartData: setChartData(persen_real, persen_rkap),
                chartOptions: setChartOptions(),
            })
        }

        produksi.value = []
        for (let a = 0; a < list_produksi.length; a++) {
            const persen_real = ((list_produksi[a].real/list_produksi[a].rkap)*100).toFixed(1);
            const persen_rkap = (100 - persen_real).toFixed(1);
            produksi.value.push({
                real: list_produksi[a].real.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }).replace('Rp', 'Rp ').replace(/,00$/, ''),
                rkap: list_produksi[a].rkap.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }).replace('Rp', 'Rp ').replace(/,00$/, ''),
                jenis: list_produksi[a].jenis,
                persen_real: persen_real,
                chartData: setChartData(persen_real, persen_rkap),
                chartOptions: setChartOptions(),
            })
        }
    }

    const setChartData = (real, rkap) => {
        const documentStyle = getComputedStyle(document.body);
        
        return {
            labels: ['Real', 'RKAP PMG-1'],
            datasets: [
                {
                    data: [real, rkap],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--orange-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--orange-400')]
                }
            ]
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
                        color: textColor
                    }
                }
            }
        };
    };

    loadProduct()
</script>

<template>
    <div class="flex flex-column gap-2">
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
    </div>
</template>