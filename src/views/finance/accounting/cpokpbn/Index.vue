<script setup>
    // Vue Component
    import { ref, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import moment from 'moment';

    // Components
    import AvgCpo from '@/views/finance/accounting/cpokpbn/component/AvgCpo.vue'
    import IncomingCpo from '@/views/finance/accounting/cpokpbn/component/IncomingCpo.vue'
    import OutstandingCpo from '@/views/finance/accounting/cpokpbn/component/OutstandingCpo.vue'

    // API
    import {loadCpoKpbnByDate_CpoController, loadCpoIncommingByDate_CpoController, loadCpoOutstandingAll_CpoController} from '@/controller/retail/CpoController.js'

    const route = useRoute()
    const active = ref(0);
    const loadingTable = ref(false);
    const loadCPOKpbn = ref([]);
    const loadIncomming = ref([]);
    const loadOutstanding = ref([]);

    // OP Show Date
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const periods = ref('')
    const list_tahun = ref([]);
    const tanggal = ref(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`)
    const op = ref();

    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true;
        const query = route.query.active
        active.value = query == null ? 0 : Number(query)
        // const tgl = '2024-05-02';
        const tgl = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`
        tanggal.value = tgl
        periods.value = moment(tgl).format('MMMM YYYY')
        const cpo_kpbn = await loadCpoKpbnByDate_CpoController(tgl)
        const incomming = await loadCpoIncommingByDate_CpoController(tgl)
        const outstanding = await loadCpoOutstandingAll_CpoController()
        loadCPOKpbn.value = cpo_kpbn
        loadIncomming.value = incomming
        loadOutstanding.value = outstanding
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
    <div class="flex flex-column justify-content-between gap-3 p-4 bg-white border-round shadow-3">
        <div class="flex justify-content-between">
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
            <div class="flex mb-2 gap-2 justify-content-end border-1 p-2 border-round border-gray-500">
                <Button @click="active = 0" label="CPO KPBN" severity="secondary" class="py-2 text-xs" :text="active !== 0" size="small"/>
                <Button @click="active = 1" label="Actual Incomming" severity="secondary" class="py-2 text-xs" :text="active !== 1" size="small"/>
                <Button @click="active = 2" label="Outstanding CPO" severity="secondary" class="py-2 text-xs" :text="active !== 2" size="small"/>
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
            <div v-show="active == 0">
                <div class="flex flex-column gap-3 p-3 border-round border-1 border-gray-300">
                    <avg-cpo :datas="loadCPOKpbn"/>
                </div>
            </div>
            <div v-show="active == 1">
                <div class="flex flex-column gap-3 p-3 border-round border-1 border-gray-300">
                    <incoming-cpo :datas="loadIncomming"/>
                </div>
            </div>
            <div v-show="active == 2">
                <div class="flex flex-column gap-3 p-3 border-round border-1 border-gray-300">
                    <outstanding-cpo :datas="loadOutstanding"/>
                </div>
            </div>
        </div>
        
    </div>
</template>