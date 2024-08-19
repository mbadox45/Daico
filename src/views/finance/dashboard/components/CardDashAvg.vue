<script setup>
    // Vue Component
    import { ref, computed, defineEmits, onMounted } from 'vue';
    import moment from 'moment';
    import { useToast } from "primevue/usetoast";
    
    // API
    import RateOdoo from '@/api/odoo_api/currency/RateOdoo.js';
    
    // Controller
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import { loadAllData_DashboardController } from '@/controller/dashboard/DashboardController.js'
    
    const toast = useToast();

    // Variable
    const bulan = ref(Number(moment().format('M')) );
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const list_tahun = ref([]);
    const tanggal = ref(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`)

    const op = ref();
    const period = ref()
    const avg_jisdor = ref();
    const jisdor_lastday = ref();
    const kurs_mandiri = ref();
    const loadingData = ref(false)

    const tgls = ref(moment().format('DD'))

    // Emit
    const emit = defineEmits(['submit'])

    onMounted(() => {
        loadMonth()
        loadBulan()
        loadTahun()
    })

    const loadMonth = async() => {
        loadingData.value = true
        // let dateString = `2024-05-01`;
        let dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tgls.value}`;

        let days;
        if (moment(dateString).format('YYYY-MM') == moment().format('YYYY-MM') ) {
            const dates = Number(moment(dateString).format('D'));
            if (dates == 1) {
                const months = Number(moment(dateString).format('M'));
                if (months == 1) {
                    const years = Number(moment(dateString).format('YYYY')) - 1;
                    const tanggalan =  moment(`${years}-${(Number(months)-1).toString().padStart(2, '0')}-01`).endOf('month').format('DD')
                    dateString = `${years}-${(Number(months)-1).toString().padStart(2, '0')}-${tanggalan}`
                    days = Number(tanggalan);
                    
                } else {
                    dateString = `${tahun.value}-${months.toString().padStart(2, '0')}-${(dates - 1).toString().padStart(2, '0')}`;
                    days = Number(moment(dateString).format('D'));
                }
            } else {
                // dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tgls.value}`;
                dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${(Number(tgls.value)-1).toString().padStart(2, '0')}`;
                days = Number(moment(dateString).format('D'));
            }
        } else {
            const tanggalan =  moment(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`).endOf('month').format('DD')
            dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tanggalan}`;
            days = Number(tanggalan);
        }

        period.value = dateString;
        const response = await loadAllData_DashboardController(dateString)
        loadJisdor(response.kurs)

        emit('submit', dateString, response)
        loadingData.value = false
        toast.add({ severity: 'success', summary: `Update data untuk periode ${moment(dateString).format('MMMM YYYY')}`, group: 'bc' , life: 5000 });
    }

    const loadJisdor = async(data) => {
        avg_jisdor.value = data.find(item => item.name == 'avg_jisdor').value
        jisdor_lastday.value = data.find(item => item.name == 'latest_jisdor').value
        kurs_mandiri.value = data.find(item => item.name == 'kurs_mandiri').value
    }

    const opByPeriod = (event) => {
        op.value.toggle(event);
    }

    const loadByPeriod = () => {
        op.value.toggle();
        loadMonth()
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

</script>
<template>
    <div class="flex flex-column w-full gap-4">
        <Toast position="bottom-center" group="bc" @close="onClose">
            <template #message="slotProps">
                <div class="flex flex-column align-items-start" style="flex: 1">
                    <div class="flex align-items-center gap-2">
                        <span class="font-bold text-xl text-green-500 capitalize">request successful</span>
                    </div>
                    <div class="font-medium text-sm my-3 text-700">{{ slotProps.message.summary }}</div>
                </div>
            </template>
        </Toast>
        <!-- Cards Update Date & View Avg Kurs -->
        <div class="bg-white p-4 border-round shadow-3 gap-5 flex flex-column md:flex-row justify-content-between w-full">
            <div :class="loadingData == true ? 'flex' : 'hidden'" class="flex-column gap-2 w-full md:w-5 h-full md:h-8rem">
                <strong class="font-medium text-2xl text-700 flex justify-content-between align-items-center uppercase">Dashboard Trading <i class="pi pi-desktop text-2xl ml-3"></i></strong>
                <div class="flex justify-content-center align-items-center h-full w-full">
                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                </div>
            </div>
            <div :class="loadingData == true ? 'hidden' : 'flex'" class="flex-column gap-2 w-full md:w-5 h-full md:h-8rem">
                <strong class="font-medium text-2xl text-700 flex justify-content-between align-items-center uppercase">Dashboard Trading <i class="pi pi-desktop text-2xl ml-3"></i></strong>
                <span class="font-normal text-400">Update data <strong class="">s.d</strong> <span class="text-red-500">{{ moment(period).format('DD MMMM YYYY') }}</span> </span>
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
            <div class="w-full flex flex-column md:flex-row align-items-center gap-3 justify-content-end">
                <div class="flex align-items-center gap-2 p-3 bg-yellow-600 text-white border-round h-full w-full">
                    <i class="pi pi-dollar text-6xl font-bold"></i>
                    <div class="flex flex-column gap-3 border-left-1 pl-3 border-white w-full">
                        <span class="text-5xl flex gap-3 justify-content-between">
                            <span>Rp</span> 
                            <div>
                                <span v-if="loadingData == true">.....</span>
                                <span v-else>{{formatCurrency(Number(avg_jisdor).toFixed(0))}}</span>
                            </div>
                        </span>
                        <div class="font-medium border-round flex gap-2 w-auto">
                            <small class="flex gap-2 text-xs"><i class="pi pi-caret-right"></i> Avg Kurs Jisdor</small>
                        </div>
                    </div>
                </div>
                <div class="flex align-items-center gap-2 p-3 bg-cyan-600 text-white border-round h-full w-full">
                    <i class="pi pi-dollar text-6xl font-bold"></i>
                    <div class="flex flex-column gap-3 border-left-1 pl-3 border-white w-full">
                        <span class="text-5xl flex gap-3 justify-content-between">
                            <span>Rp</span>
                            <div>
                                <span v-if="loadingData == true">.....</span>
                                <span v-else>{{formatCurrency(Number(jisdor_lastday).toFixed(0))}}</span>
                            </div>
                        </span>
                        <div class="font-medium border-round flex gap-2 w-auto">
                            <small class="flex gap-2 text-xs"><i class="pi pi-caret-right"></i> Kurs Jisdor Last Day</small>
                        </div>
                    </div>
                </div>
                <div class="flex align-items-center gap-2 p-3 bg-indigo-600 text-white border-round h-full w-full">
                    <i class="pi pi-dollar text-6xl font-bold"></i>
                    <div class="flex flex-column gap-3 border-left-1 pl-3 border-white w-full">
                        <span class="text-5xl flex gap-3 justify-content-between">
                            <span>Rp</span>
                            <div>
                                <span v-if="loadingData == true">.....</span>
                                <span v-else>{{formatCurrency(Number(kurs_mandiri).toFixed(0))}}</span>
                            </div>
                        </span>
                        <div class="font-medium border-round flex gap-2 w-auto">
                            <small class="flex gap-2 text-xs"><i class="pi pi-caret-right"></i> Kurs Transaksi Bank Mandiri</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>