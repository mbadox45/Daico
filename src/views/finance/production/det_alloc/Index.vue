<script setup>
    import { ref, computed, onMounted } from 'vue';
    import moment from 'moment';

    // API
    import { loadByPeriod_DetAllocController, loadAllByPeriodRekap_DetAllocController, loadLaporanProduksi, } from '@/controller/production/DetAllocController.js'

    // Components
    import ReportProduction from '@/views/finance/production/det_alloc/components/ReportProduction.vue'
    import ListProduction from '@/views/finance/production/det_alloc/components/ListProduction.vue'
    import { cek_token } from "@/api/DataVariable.js";

    // Variable
    const active = ref(0);
    const loadingTable = ref(false);
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const periods = ref('')
    const list_tahun = ref([]);
    const tanggal = ref(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`)
    const op = ref();
    const load = ref([])
    const laporan = ref([])

    // Function
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        // const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
        const dateString = `2024-05-31`;
        tanggal.value = dateString;
        periods.value = moment(dateString).format('MMMM YYYY')
        const response = await loadAllByPeriodRekap_DetAllocController(dateString);
        const recap = await loadLaporanProduksi(response);

        const report = await loadByPeriod_DetAllocController(dateString)
        load.value = recap;
        laporan.value = report;
        loadingTable.value = false
        loadBulan()
        loadTahun()
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
    <div class="p-4 border-round bg-white shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
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
            <div class="">
                <div class="flex justify-content-end gap-1 p-2 border-1 border-blue-500 border-round">
                    <Button label="Data Recap" @click="active = 0" class="py-2 text-xs" severity="info" :text="active !== 0" size="small"/>
                    <Button label="Production Report" @click="active = 1" class="py-2 text-xs" severity="info" :text="active !== 1" size="small"/>
                </div>
            </div>
        </div>
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <div v-else>
            <div v-if="active == 0">
                <report-production :datas="load"/>
            </div>
            <div v-if="active == 1">
                <list-production :datas="laporan"/>
            </div>
        </div>
    </div>
</template>