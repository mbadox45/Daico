<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';

    // Components
    import ChartEfisiensi from '@/views/finance/accounting/transform/component/ChartEfisiensi.vue'

    // API
    // import {loadDashByDate_DashboardController} from '@/controller/dashboard/DashboardController2.js';

    const toast = useToast();

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
        try {
            // const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${(Number(moment(now).format('D'))-1).toString().padStart(2, '0')}`;
            const dateString = `2024-04-01`;
            tanggal.value = dateString;
            // const response = await loadDashByDate_DashboardController(dateString)
            // if (response == null) {
            //     toast.add({ severity: 'error', summary: 'Error', detail: 'Load data failed, please try again.', life: 5000 });
            // } else {
            //     toast.add({ severity: 'success', summary: 'Success', detail: 'Load data success', life: 5000 });
            // }
            // load_data.value = response
            loadBulan();
            loadTahun();
            loadingData.value = false
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 5000 });
            const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${(Number(moment(now).format('D'))-1).toString().padStart(2, '0')}`;
            tanggal.value = dateString;
            loadBulan();
            loadTahun();
            load_data.value = null
            loadingData.value = false
        }
    }

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
    <div class="flex flex-column justify-content-between p-4 gap-5 bg-white border-round shadow-3">
        <div class="flex justify-content-between">
            <strong class="font-medium text-2xl text-700 flex justify-content-between align-items-center uppercase">Commercial Excellence<i class="pi pi-desktop text-2xl ml-3"></i></strong>
            <div class="flex align-items-center gap-3">
                <Button label="Select by Period" outlined severity="secondary" size="small" class="py-2" @click="opByPeriod"/>
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
                <span class="font-medium text-sm text-gray-400">{{ moment(tanggal).format('MMMM YYYY') }}</span>
            </div>
        </div>
        
            
            <!-- Inner Content with Inventory and Piutang stacked -->
            <div class="flex flex-column justify-content-center align-items-center mt-3">
                <!-- Piutang Label -->
                <div class="flex flex-column justify-content-center align-items-center p-3 bg-orange-100 border-round shadow-2 w-full mb-3">
                    <span class="font-medium text-md text-700 uppercase">Sourcing</span>
                </div>

                <div class="w-full mt-3">
                </div>

                <!-- Inventory Label -->
                <div class="flex flex-column justify-content-center align-items-center p-3 bg-orange-100 border-round shadow-2 w-full mb-3">
                    <span class="font-medium text-md text-700 uppercase">Efisiensi Biaya</span>
                </div>

                 <!-- Chart Section -->
                <div class="w-full mt-3">
                    <chart-efisiensi :chart="load_data"/>
                </div>
                
            </div>
        </div>
</template>