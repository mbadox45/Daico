<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';

    // Components
    import CardDashAvg from '@/views/finance/dashboard/components/CardDashAvg.vue'
    import CardCashPage from '@/views/finance/dashboard/components/CardCashPage.vue'
    import CardMinimumSellingPage from '@/views/finance/dashboard/components/CardMinimumSellingPage.vue'
    import CardPotensiPage from '@/views/finance/dashboard/components/CardPotensiPage.vue'
    import CardSellingPrice from '@/views/finance/dashboard/components/CardSellingPrice.vue'
    import ChartDougnutPage from '@/views/finance/dashboard/components/ChartDougnutPage2.vue'
    import CardStockInventory from '@/views/finance/dashboard/components/CardStockInventory.vue';
    import CardCpoPage from '@/views/finance/dashboard/components/CardCPOPage.vue'
    import CpoAndRoutersPage from '@/views/finance/dashboard/components/CpoAndRoutersPage.vue'

    // API
    import {loadDashByDate_DashboardController} from '@/controller/dashboard/DashboardController2.js';

    // Variable
    const now = moment().format('YYYY-MM-DD');
    const userName = ref(JSON.parse(localStorage.getItem('payload')))
    const bulan = ref(Number(moment().format('M')) );
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const list_tahun = ref([]);
    const tanggal = ref(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`)
    // const tanggal = ref(`${moment(now).format('YYYY-MM')}-${(Number(moment(now).format('D'))-1).toString().padStart(2, '0')}`)
    const load_data = ref()
    const loadingData = ref(false)

    const op = ref()

    onMounted(() => {
        loadData();
    })

    const loadData = async() => {
        loadingData.value = true
        // const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${(Number(moment(now).format('D'))-1).toString().padStart(2, '0')}`;
        const dateString = `2024-05-31`;
        tanggal.value = dateString;
        const response = await loadDashByDate_DashboardController(dateString)
        load_data.value = response
        loadingData.value = false
        loadBulan();
        loadTahun()
    }

    // const onSubmit = async(date, data) => {
    //     // tanggal.value = '2024-05-31';
    //     console.log(loadingData.value);
    //     try {
    //         tanggal.value = date;
    //         load_data.value = data
    //     } finally {
    //         loadingData.value = false
    //     }
    // }

    const loadBulan = () => {
        list_bulan.value = []
        if (tahun.value >= Number(moment().format('yyyy'))) {
            const month = Number(moment().format('M'))
            for (let i = 1; i <= month; i++) {
                const dateString = `2024-${i.toString().padStart(2, '0')}-01`;
                const monthName = moment(dateString, 'YYYY-MM-DD').format('MMMM');
                list_bulan.value.push({ id: i, name: monthName });
            }
        } else {
            for (let i = 1; i <= 12; i++) {
                const dateString = `2024-${i.toString().padStart(2, '0')}-01`;
                const monthName = moment(dateString, 'YYYY-MM-DD').format('MMMM');
                list_bulan.value.push({ id: i, name: monthName });
            }
        }
    }

    const loadTahun = () => {
        const year = Number(moment().format('yyyy'))
        list_tahun.value = []
        for (let i = 2020; i <= year; i++) {
            list_tahun.value.push({ id: i, name: i });
        }
    }

    const opByPeriod = (event) => {
        op.value.toggle(event);
    }

    const loadByPeriod = () => {
        op.value.toggle();
        loadData()
    }

</script>

<template>
    <div class="flex flex-column gap-5 mt-5 md:mt-0">
        <div v-if="loadingData == true" class="w-full bg-white p-5 flex flex-column justify-content-center align-items-center gap-4" style="height: 70vh;">
            <div class="w-full flex flex-column gap-4">
                <span>Loading data....</span>
                <ProgressBar mode="indeterminate"  />
            </div>
        </div>
        <div v-else class="flex flex-column gap-4 w-full">
            <div class="bg-white p-4 border-round shadow-3 gap-5 flex flex-column md:flex-row justify-content-between w-full">
                <div :class="loadingData == true ? 'flex' : 'hidden'" class="flex-column gap-2 w-full md:w-5 h-full md:h-8rem">
                    <strong class="font-medium text-2xl text-700 flex justify-content-between align-items-center uppercase">Dashboard Trading <i class="pi pi-desktop text-2xl ml-3"></i></strong>
                    <div class="flex justify-content-center align-items-center h-full w-full">
                        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                    </div>
                </div>
                <div :class="loadingData == true ? 'hidden' : 'flex'" class="flex-column gap-2 w-full md:w-5 h-full md:h-8rem">
                    <strong class="font-medium text-2xl text-700 flex justify-content-between align-items-center uppercase">Dashboard Trading <i class="pi pi-desktop text-2xl ml-3"></i></strong>
                    <span class="font-normal text-400">Update data <strong class="">s.d</strong> <span class="text-red-500">{{ moment(tanggal).format('DD MMMM YYYY') }}</span> </span>
                    <Button label="Change Month" severity="info" size="small" class="mt-3" @click="opByPeriod"/>
                    <OverlayPanel ref="op" :style="{ width: '25rem' }">
                        <div class="flex flex-column gap-3">
                            <span class="font-light text-sm">Please select a period</span>
                            <div class="p-inputgroup p-fluid">
                                <span class="p-inputgroup-addon bg-white">
                                    <i class="pi pi-calendar"></i>
                                </span>
                                <Dropdown v-model="tahun" :options="list_tahun" optionLabel="name" optionValue="id" placeholder="Tahun" @change="loadBulan" checkmark :highlightOnSelect="false" class="w-full" />
                                <Dropdown v-model="bulan" :options="list_bulan" optionLabel="name" optionValue="id" placeholder="Bulan" checkmark :highlightOnSelect="false" class="w-full" />
                            </div>
                            <Button icon="pi pi-check" label="Submit" severity="success" class="w-auto" @click="loadByPeriod"/>
                        </div>
                    </OverlayPanel>
                </div>
                <card-dash-avg :kurs="load_data"/>
            </div>
            <card-minimum-selling-page :sell="load_data"/>
            <div class="flex md:flex-row flex-column gap-5 align-items-center md:align-items-start">
                <card-cpo-page :cpo="load_data"/>
                <card-cash-page :cash="load_data"/>
            </div>
            <cpo-and-routers-page :tanggal="tanggal" :rout="load_data"/>
            <card-stock-inventory :stock="load_data"/>
            <chart-dougnut-page :chart="load_data"/>
        </div>
    </div>
</template>