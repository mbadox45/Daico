<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps } from 'vue';

    // Components
    import MarketProp from '@/views/finance/accounting/propcost/component/PropComponents/MarketProp.vue'

    // API ========================================================================================================================================================
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

    const props = defineProps({
        datas:{
            type:Array,
            default: () => {}
        }
    });

    // VARIABLE
    const market = ref([]);
    const production = ref([]);
    const options = ref([
        {id: 0, name:'Market Value'},
        {id: 1, name:'Produksi Refinery'},
        {id: 2, name:'Produksi Fraksinasi (IV-56)'},
        {id: 3, name:'Produksi Fraksinasi (IV-57)'},
        {id: 4, name:'Produksi Fraksinasi (IV-58)'},
        {id: 5, name:'Produksi Fraksinasi (IV-60)'},
    ])

    const active = ref(0)


    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        const response = props.datas;
        const load_market = response[0]
        const produksi = response[1]
        market.value = load_market;
        production.value = produksi;
    }

    const onClicks = (e) => {
        active.value = e.value
    }
</script>

<template>
    <div class="flex flex-column gap-3 w-full">
        <div class="flex flex-column-reverse md:flex-row justify-content-between align-items-center gap-5">
            <div class="w-full md:w-21rem flex gap-2">
                <Dropdown v-model="active" :options="options" optionLabel="name" optionValue="id" placeholder="Select a Proportion Cost" class="w-full" @change="onClicks"/>
            </div>
            <div class="w-full flex justify-content-end gap-2">
                <span class="uppercase text-xl text-cyan-700 font-medium">Proportion Cost</span>
            </div>
        </div>

        <!-- Table -->
        <!-- Market -->
        <div class="w-full">
            <div v-if="active == 0" class="w-full flex flex-column gap-3" >
                <div class="flex flex-column gap-3 border-1 border-round border-gray-300 p-3">
                    <span class="text-yellow-800 uppercase font-semibold">Market Value</span>
                    <div class="flex flex-column justify-content-between gap-5">
                        <div class="flex gap-7">
                            <div class="flex flex-column w-full gap-2 p-3 border-round shadow-3 bg-gray-800">
                                <div class="flex justify-content-between align-items-center text-white">
                                    <span class="text-sm font-medium uppercase">Average Kurs Jisdor</span>
                                    <i class="pi pi-dollar text-3xl"></i>
                                </div>
                                <div class="text-gray-300 text-xl flex justify-content-between">
                                    <span>Rp.</span> 
                                    <span>{{formatCurrency(Number(market.jisdor).toFixed(2))}}</span>
                                </div>
                            </div>
                            <div class="flex flex-column w-full gap-2 p-3 border-round shadow-3 bg-bluegray-800">
                                <div class="flex justify-content-between align-items-center text-white">
                                    <span class="text-sm font-medium uppercase text-white">Average CPO KPBN</span>
                                    <i class="pi pi-dollar text-3xl"></i>
                                </div>
                                <div class="text-bluegray-300 text-xl flex justify-content-between">
                                    <span>Rp.</span> 
                                    <span>{{formatCurrency(Number(market.cpokpbn).toFixed(2))}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-7">
                            <div class="flex flex-column w-full gap-2 border-round shadow-3 p-4 bg-teal-900 text-white">
                                <span class="text-sm font-medium uppercase w-full flex justify-content-center mb-3">Market (USD) Excluded Tax</span>
                                <div class="flex flex-column gap-1 border-bottom-1 border-gray-300 pb-2 w-full" v-for="(item, index) in market.usd" :key="index">
                                    <div class="flex flex-column border-round w-full">
                                        <span class="text-xs font-bold">{{item.name}}</span>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="text-xl font-normal">USD</span>
                                            <span class="text-xl font-normal">{{formatCurrency(Number(item.value).toFixed(2))}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-column w-full gap-2 border-round shadow-3 p-4 bg-yellow-900 text-white">
                                <span class="text-sm font-medium uppercase w-full flex justify-content-center mb-3">Market (IDR) Excluded Tax</span>
                                <div class="flex flex-column gap-1 border-bottom-1 border-gray-300 pb-2 w-full" v-for="(item, index) in market.idr" :key="index">
                                    <div class="flex flex-column border-round w-full">
                                        <span class="text-xs font-bold">{{item.name}}</span>
                                        <div class="flex justify-content-between align-items-center">
                                            <span class="text-xl font-normal">Rp.</span>
                                            <span class="text-xl font-normal">{{formatCurrency(Number(item.value).toFixed(2))}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="(item, index) in production.items" class="w-full flex flex-column gap-3" :key="index">
                <div v-if="active == item.id" class="flex flex-column gap-3 border-1 border-round border-gray-300 p-3">
                    <span class="text-yellow-800 uppercase font-semibold">Produksi {{item.name}}</span>
                    <div class="flex flex-column justify-content-between gap-5">
                        <div class="grid">
                            <div class="col-7 p-3">
                                <div class="w-full flex flex-column gap-3 border-round bg-white p-3 border-3 border-gray-900">
                                    <span class="font-italic font-semibold text-gray-900">Produksi {{item.name}}</span>
                                    <div class="flex gap-3 justify-content-between align-items-center">
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-gray-900 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium">{{ item.name1 }}</span>
                                            <span class="text-xl flex justify-content-end">{{ formatCurrency(Number(item.olah1).toFixed(0)) }}</span>
                                        </div>
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-gray-900 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium flex gap-1"><span>{{ item.name2 }}</span> <span>{{item.tipe}}</span></span>
                                            <span class="text-xl flex justify-content-end">{{ formatCurrency(Number(item.olah2).toFixed(0)) }}</span>
                                        </div>
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-gray-900 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium">{{ item.name3 }}</span>
                                            <span class="text-xl flex justify-content-end">{{ formatCurrency(Number(item.olah3).toFixed(0)) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-5 p-3">
                                <div class="w-full flex flex-column gap-3 border-round bg-white p-3 border-3 border-yellow-700">
                                    <span class="font-italic font-semibold text-yellow-700">Rendement {{item.name}}</span>
                                    <div class="flex gap-3 justify-content-between align-items-center">
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-yellow-700 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium"><span>{{ item.name2 }}</span> <span>{{item.tipe}}</span></span>
                                            <span class="text-xl flex justify-content-end">{{ formatCurrency(Number(item.rend1).toFixed(1)) }} %</span>
                                        </div>
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-yellow-700 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium">{{ item.name3 }}</span>
                                            <span class="text-xl flex justify-content-end">{{ formatCurrency(Number(item.rend2).toFixed(1)) }} %</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="grid">
                            <div class="col-5 p-3">
                                <div class="w-full flex flex-column gap-3 border-round bg-white p-3 border-3 border-green-700">
                                    <span class="font-italic font-semibold text-green-700">Proporsi Biaya (Rp/Kg)</span>
                                    <div class="flex gap-3 justify-content-between align-items-center">
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-green-700 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium"><span>{{ item.name2 }}</span> <span>{{item.tipe}}</span></span>
                                            <span class="text-xl flex justify-content-between"><span>Rp.</span> <span>{{ formatCurrency(Number(item.rp1).toFixed(0)) }}</span></span>
                                        </div>
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-green-700 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium">{{ item.name3 }}</span>
                                            <span class="text-xl flex justify-content-between"><span>Rp.</span> <span>{{ formatCurrency(Number(item.rp2).toFixed(0)) }}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-7 p-3">
                                <div class="w-full flex flex-column gap-3 border-round bg-white p-3 border-3 border-red-700">
                                    <span class="font-italic font-semibold text-red-700">Proporsi Biaya (%)</span>
                                    <div class="flex gap-3 justify-content-between align-items-center">
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-red-700 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium"><span>{{ item.name2 }}</span> <span>{{item.tipe}}</span></span>
                                            <span class="text-xl flex justify-content-end">{{ formatCurrency(Number(item.persen1).toFixed(1)) }} %</span>
                                        </div>
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-red-700 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium">{{ item.name3 }}</span>
                                            <span class="text-xl flex justify-content-end">{{ formatCurrency(Number(item.persen2).toFixed(1)) }} %</span>
                                        </div>
                                        <div class="w-full p-3 shadow-3 hover:shadow-0 bg-red-700 text-white border-round flex flex-column">
                                            <span class="text-xs font-medium uppercase">Total</span>
                                            <span class="text-xl flex justify-content-end">{{ formatCurrency(Number(item.total).toFixed(1)) }} %</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>