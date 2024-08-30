<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import { useRouter, useRoute } from 'vue-router';
    import moment from 'moment';

    const route = useRoute();
    const router = useRouter();

    // API
    // import {loadDataCostHpp, loadRefinery} from '@/views/load_data/produksi/costing_hpp.js'
    import {loadCostingHpp_CostingHppController} from '@/controller/production/CostingHppController.js'
    import { dummy } from "@/controller/production/TestDummy.js";

    // Components
    import FractIv60 from '@/views/finance/production/costing_hpp/components/FractIv60.vue'
    import FractIv58 from '@/views/finance/production/costing_hpp/components/FractIv58.vue'
    import FractIv57 from '@/views/finance/production/costing_hpp/components/FractIv57.vue'
    import FractIv56 from '@/views/finance/production/costing_hpp/components/FractIv56.vue'
    import RefineryCost from '@/views/finance/production/costing_hpp/components/RefineryCost.vue'
    import ControlCost from '@/views/finance/production/costing_hpp/components/ControlCost.vue'

    // VARIABLE
    const type = ref(route.query.active);
    const active = ref(0);
    const loadingTable = ref(false);
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const periods = ref('')
    const list_tahun = ref([]);
    const tanggal = ref(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`)
    const op = ref();

    const data_refinery = ref({})

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
        // const dateString = `2024-05-31`;
        tanggal.value = dateString;
        const response = await loadCostingHpp_CostingHppController(dateString);
        // const response = dummy;
        data_refinery.value = response;
        periods.value = moment(dateString).format('MMMM YYYY')
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
    <div class="card shadow-3 flex flex-column gap-3">
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
                <div class="flex justify-content-end gap-1 p-2 border-1 border-gray-500 border-round">
                    <Button label="Refinery" @click="active = 0" class="py-2 text-xs" severity="secondary" :text="active !== 0" size="small"/>
                    <Button label="Frak IV 56" @click="active = 1" class="py-2 text-xs" severity="secondary" :text="active !== 1" size="small"/>
                    <Button label="Frak IV 57" @click="active = 2" class="py-2 text-xs" severity="secondary" :text="active !== 2" size="small"/>
                    <Button label="Frak IV 58" @click="active = 3" class="py-2 text-xs" severity="secondary" :text="active !== 3" size="small"/>
                    <Button label="Frak IV 60" @click="active = 4" class="py-2 text-xs" severity="secondary" :text="active !== 4" size="small"/>
                    <Button label="Control" @click="active = 5" class="py-2 text-xs" severity="secondary" :text="active !== 5" size="small"/>
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
            <!-- Table -->
            <div v-show="active == 0">
                <refinery-cost :dummy_ref="data_refinery"/>
            </div>
            <div v-show="active == 1">
                <fract-iv-56 :dummy56="data_refinery"/>
            </div>
            <div v-show="active == 2">
                <fract-iv-57 :dummy57="data_refinery"/>
            </div>
            <div v-show="active == 3">
                <fract-iv-58 :dummy58="data_refinery"/>
            </div>
            <div v-show="active == 4">
                <fract-iv-60 :dummy60="data_refinery"/>
            </div>
            <div v-show="active == 5">
                <control-cost :control="data_refinery"/>
            </div>
        </div>

    </div>
</template>