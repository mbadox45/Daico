<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';

    // API
    import {nilaiCpoOutstanding_DashboardController, loadUpdateMarket_DashboardController} from '@/controller/dashboard/DashboardController2.js';
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

    // Variable
    const props = defineProps({
        tanggal:{
            type:String
        },
        rout:{
            type:Array,
            default: () => {}
        }
    });

    const list_market = ref([]);
    const load_market = ref([]);
    const list_cpo = ref([]);
    const tot_harga = ref(0)
    const tot_qty = ref(0)
    const tot_value = ref(0)
    const loadingData = ref(false)
    const loadingData2 = ref(false)
    const dates = ref(props.tanggal)

    // Function
    
    onMounted(() => {
        loadCpoAndRouters()
    });

    const loadCpoAndRouters = async() => {
        const response = props.rout;
        const outStanding = await nilaiCpoOutstanding_DashboardController(response)
        tot_harga.value = outStanding.tot_harga;
        tot_qty.value = outStanding.tot_qty;
        tot_value.value = outStanding.tot_value;
        list_cpo.value = outStanding.list;
        // list_market.value =  market
        
        // Market
        const market = await loadUpdateMarket_DashboardController(response, dates.value)
        // const market = response.market;
        load_market.value = market
        const market_value = market.find(item => item.tanggal == dates.value)
        const list = []
        if (market_value != null) {
            list.push(
                {name: 'RBDPO', levy: market_value.rbdpo.levy, routers: market_value.rbdpo.routers, excid: market_value.rbdpo.excld},
                {name: 'PFAD', levy: market_value.pfad.levy, routers: market_value.pfad.routers, excid: market_value.pfad.excld},
                {name: 'RBD Olein', levy: market_value.rbdo.levy, routers: market_value.rbdo.routers, excid: market_value.rbdo.excld},
                {name: 'RBD Stearin', levy: market_value.rbds.levy, routers: market_value.rbds.routers, excid: market_value.rbds.excld},
            )
        }
        list_market.value = list;
    }

    const loadRouters = async() => {
        loadingData2.value = true
        const market_value = load_market.value.find(item => item.tanggal == dates.value)
        const list = [
            {name: 'RBDPO', levy: market_value.rbdpo.levy, routers: market_value.rbdpo.routers, excid: market_value.rbdpo.excld},
            {name: 'PFAD', levy: market_value.pfad.levy, routers: market_value.pfad.routers, excid: market_value.pfad.excld},
            {name: 'RBD Olein', levy: market_value.rbdo.levy, routers: market_value.rbdo.routers, excid: market_value.rbdo.excld},
            {name: 'RBD Stearin', levy: market_value.rbds.levy, routers: market_value.rbds.routers, excid: market_value.rbds.excld},
        ]
        list_market.value = list;
        loadingData2.value = false
    }
    
    watch(() => props.rout, props.tanggal, loadCpoAndRouters, { immediate: true });

</script>
<template>
    <div class="flex md:flex-row flex-column md:align-items-start align-items-center gap-5">
        <div class="flex flex-column w-full p-4 bg-white border-round shadow-3 border-1 border-gray-300 gap-3">
            <span class="font-bold w-full">Update Outstanding CPO :</span>
            <ProgressBar v-if="loadingData == true" mode="indeterminate" style="height: 6px"></ProgressBar>
            <DataTable v-else :value="list_cpo">
                <Column field="supplier">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">Entitas</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-normal text-xs">{{data.supplier}}</span>
                    </template>
                    <template #footer>
                        <span class="font-medium text-xs font-italic">Total Outstanding</span>
                    </template>
                </Column>
                <Column field="qty">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">qty(kg)</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-medium text-xs flex w-full justify-content-end">{{data.qty}}</span>
                    </template>
                    <template #footer>
                        <span class="font-medium text-xs flex w-full justify-content-end">{{tot_qty}}</span>
                    </template>
                </Column>
                <Column field="harga">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">harga</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-normal text-xs flex w-full justify-content-end">{{data.harga}}</span>
                    </template>
                    <template #footer>
                        <span class="font-medium text-xs flex w-full justify-content-end">{{tot_harga}}</span>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">value</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-normal text-xs flex w-full justify-content-end">{{data.value}}</span>
                    </template>
                    <template #footer>
                        <span class="font-medium text-xs flex w-full justify-content-end">{{tot_value}}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
        <div class="flex flex-column w-full p-4 bg-white border-round shadow-3 border-1 border-gray-300 gap-3">
            <div class="flex align-items-center gap-5">
                <span class="font-bold capitalize w-full">market price routers & levy duty :</span>
                <div class="p-inputgroup p-fluid">
                    <span class="p-inputgroup-addon bg-white">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText v-model="dates" type="date" :min="moment(props.tanggal).format('YYYY-MM-01')" :max="moment(props.tanggal).format('YYYY-MM-DD')" placeholder="Search by date" @change="loadRouters"/>
                </div>
            </div>
            <ProgressBar v-if="loadingData2 == true" mode="indeterminate" style="height: 6px"></ProgressBar>
            <DataTable v-else :value="list_market">
                <Column field="name">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">Product</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-normal text-xs">{{data.name}}</span>
                    </template>
                </Column>
                <Column field="routers">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">Market routers</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-medium text-xs flex w-full justify-content-between"><span>USD</span> <span>{{data.routers == 0 ? '-' : data.routers < 0 ? '('+formatCurrency((Number(data.routers)*-1).toFixed(2))+')': formatCurrency(Number(data.routers).toFixed(2))}}</span></span>
                    </template>
                </Column>
                <Column field="levy">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">levy + duty</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-medium text-xs flex w-full justify-content-between"><span>USD</span> <span>{{data.levy == 0 ? '-' : data.levy < 0 ? '('+formatCurrency((Number(data.levy)*-1).toFixed(2))+')': formatCurrency(Number(data.levy).toFixed(2))}}</span></span>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">Market Excld Levy Duty</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-medium text-xs flex w-full justify-content-between"><span>USD</span> <span>{{data.excid == 0 ? '-' : data.excid < 0 ? '('+formatCurrency((Number(data.excid)*-1).toFixed(2))+')': formatCurrency(Number(data.excid).toFixed(2))}}</span></span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>