<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';

    // API
    import {loadCPOOutstanding} from '@/views/load_data/cpo.js'
    import {loadUpdateOutstandingCPO} from '@/views/load_data/dashboard.js'
    import {formatCurrency} from '@/views/load_data/func_dummy.js'

    // Variable
    const props = defineProps({
        tanggal:{
            type:String
        }
    });

    const days = props.tanggal
    const list_market = ref([]);
    const list_cpo = ref([]);
    const loadingData = ref(false)
    const loadingData2 = ref(false)
    const dates = ref(props.tanggal)

    // Function
    const date = computed(()=> moment(props.tanggal).format('DD MMMM YYYY'))
    watch(() => props.tanggal, (newVal) => {
        loadCpoAndRouters(newVal)
        dates.value = newVal
    });

    onMounted(() => {
        loadCpoAndRouters(props.tanggal)
    });

    const loadCpoAndRouters = async(tgl) => {
        loadingData.value = true
        loadingData2.value = true
        const load_cpo = await loadCPOOutstanding();
        list_cpo.value = load_cpo
        const load_market = await loadUpdateOutstandingCPO(tgl);
        list_market.value = load_market
        loadingData.value = false
        loadingData2.value = false
    }

    const loadOutsandingCPO = async() => {
        loadingData2.value = true
        const load_market = await loadUpdateOutstandingCPO(dates.value);
        list_market.value = load_market
        loadingData2.value = false
    }

    const totalDataCPO = (ket) => {
        const list = list_cpo.value
        let total = 0;
        if (list == null) {
            total = 0
        } else {
            for (let i = 0; i < list.length; i++) {
                if (ket == 'harga') {
                    total += Number(list[i].harga);
                } else if (ket == 'qty') {
                    total += Number(list[i].qty);
                } else if (ket == 'value') {
                    total += Number(list[i].value);
                } else {
                    continue;
                }
            }
        }
        return formatCurrency(Number(total).toFixed(0));
    }
</script>
<template>
    <div class="flex gap-5">
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
                        <span class="font-medium text-xs flex w-full justify-content-end">{{formatCurrency(Number(data.qty).toFixed(2))}}</span>
                    </template>
                    <template #footer>
                        <span class="font-medium text-xs flex w-full justify-content-end">{{totalDataCPO('qty')}}</span>
                    </template>
                </Column>
                <Column field="harga">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">harga</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-normal text-xs flex w-full justify-content-end">Rp. {{formatCurrency(Number(data.harga).toFixed(2))}}</span>
                    </template>
                    <template #footer>
                        <span class="font-medium text-xs flex w-full justify-content-end">{{totalDataCPO('harga')}}</span>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <span class="font-medium text-xs capitalize font-italic">value</span>
                    </template>
                    <template #body="{data}">
                        <span class="font-normal text-xs flex w-full justify-content-end">{{formatCurrency(Number(data.value).toFixed(2))}}</span>
                    </template>
                    <template #footer>
                        <span class="font-medium text-xs flex w-full justify-content-end">{{totalDataCPO('value')}}</span>
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
                    <InputText v-model="dates" type="date" :min="moment(props.tanggal).format('YYYY-MM-01')" :max="moment(props.tanggal).format('YYYY-MM-DD')" placeholder="Search by date" @change="loadOutsandingCPO"/>
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