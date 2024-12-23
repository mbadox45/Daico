<script setup>
    import { ref, watch, onMounted } from 'vue';
    import ApexCharts from 'vue3-apexcharts'
    import { stackedChartOptionsApexNew, stackedChartOptionsApex, barStackedChartOptionsApex } from "@/controller/dummy/func_dummy.js";
    import {volumeTon1, volumeTon2, rerataHarga1, rerataHarga2, kpbnMdex, kursUsdToRp, volumeLineBar} from '@/controller/dashboard/MockupSalesPerformance.js';

    // Varriable
    const selectRegion = ref();
    const startDate = ref('2024-12-01');
    const endDate = ref('2024-12-20');
    const region = ref([]);

    const listChart = ref([]);
    const listChart2 = ref([]);

    onMounted(() => {
        loadProduct()
    })

    const loadProduct = async () => {
        const dateString = `2024-04-01`;

        const listAll = []
        const listAll2 = []

        listAll.push(
            {type:'bar', sdhi: await volumeTon1(), sdbi: await volumeTon2(), title:'Volume (Ton)'},
            {type:'bar', sdhi: await rerataHarga1(), sdbi: await rerataHarga2(), title:'Rerata Harga (Rp)'},
            {
                type:'text', 
                data:[
                    {title:'Harga KPBN', date:'19/12/2024', nominal:'Rp 14.646', status:'turun', kondisi:'Rp -273'},
                    {title:'Harga MDEX', date:'18/12/2024', nominal:'RM 4.700', status:'turun', kondisi:'RM -189'},
                    {title:'Kurs USD to Rp', date:'19/12/2024', nominal:'Rp 16.220', status:'naik', kondisi:'Rp 137'},
                    {title:'Kurs RM to Rp', date:'18/12/2024', nominal:'Rp 3.590', status:'turun', kondisi:'RM -1'},
                ] 
            }
        )

        listAll2.push(
            await volumeLineBar(),
            await kpbnMdex(),
            await kursUsdToRp()
        )

        listChart.value = listAll;
        listChart2.value = listAll2;

    };
</script>

<template>
    <div class="grid">
        <div class="col-6 px-3 align-content-center">
            <h3 class="uppercase">Sales Performance</h3>
        </div>
        <div class="col-6 px-3 flex justify-content-end gap-4">
            <div class="w-6 p-3 shadow bg-white border-round-xl">
                <Dropdown v-model="selectRegion" :options="region" optionLabel="name" optionValue="code" placeholder="Region" class="w-full" />
            </div>
            <div class="w-full p-3 shadow bg-white flex gap-4 border-round-xl">
                <Calendar v-model="startDate" dateFormat="yy-dd-mm" showIcon :showOnFocus="false" />
                <Calendar v-model="endDate" dateFormat="yy-dd-mm" showIcon :showOnFocus="false" />
            </div>
        </div>
        <div class="col-5 flex flex-column gap-4 px-3">
            <div class="border-2 border-gray-300 w-full h-100 p-3 border-round-xl" v-for="(item, index) in listChart" :key="index">
                <div class="flex flex-column gap-2" v-if="item.type == 'bar'">
                    <span class="font-semibold text-xl">{{ item.title }}</span>
                    <div class="flex gap-3 w-full">
                        <div class="w-full flex flex-column gap-1 bg-gray-300 p-2 border-round-xl">
                            <ApexCharts
                                :type="item.sdhi.type"
                                :series="item.sdhi.series"
                                :options="item.sdhi.chartOptions" 
                                class="w-full"
                                height="300"
                                style="z-index: 1 !important;"
                            />
                            <span class="text-center w-full font-bold">SDHI</span>
                        </div>
                        <div class="w-full flex flex-column gap-1 bg-gray-300 p-2 border-round-xl">
                            <ApexCharts
                                :type="item.sdbi.type"
                                :series="item.sdbi.series"
                                :options="item.sdbi.chartOptions" 
                                class="w-full"
                                height="300"
                                style="z-index: 1 !important;"
                            />
                            <span class="text-center w-full font-bold">SDBI</span>
                        </div>
                    </div>
                </div>
                <div class="grid" v-else>
                    <div class="col-6 p-3 flex flex-column gap-1" v-for="(items, indexes) in item.data" :key="indexes">
                        <span class="w-full text-center font-bold text-xl">{{ items.title }}</span>
                        <span class="w-full text-center text-sm">{{ items.date }}</span>
                        <span class="w-full text-center text-xl">{{ items.nominal }}</span>
                        <span class="w-full text-center font-bold text-sm flex gap-2 justify-content-center align-items-center" :class="items.status == 'turun' ? 'text-red-500' : 'text-green-500'"><i :class="`pi ${items.status == 'turun' ? 'pi-caret-down' : 'pi-caret-up'}`"></i> <span>{{ items.kondisi }}</span></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-7 flex flex-column gap-4 px-3">
            <div class="border-2 border-gray-300 w-full h-100 p-5 border-round-xl" v-for="(item, index) in listChart2" :key="index">
                <span class="text-white">Chart Bar 3</span>
                <ApexCharts
                    :type="item.type"
                    :series="item.series"
                    :options="item.chartOptions" 
                    class="w-full"
                    height="380"
                    style="z-index: 1 !important;"
                />
            </div>
        </div>
    </div>
</template>