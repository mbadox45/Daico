<script setup>
    // Vue Component
    import { ref, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // Components
    import MainTarget from '@/views/finance/accounting/target/components/list/MainTarget.vue';
    import DailyDmo from '@/views/finance/accounting/target/components/list/DailyDmo.vue';
    import MonthlyDmo from '@/views/finance/accounting/target/components/list/MonthlyDmo.vue';
    import TargetReal from '@/views/finance/accounting/target/components/list/TargetReal.vue';
    import TargetRkap from '@/views/finance/accounting/target/components/list/TargetRkap.vue';
    
    const route = useRoute();
    const router = useRouter();

    // VARIABLE
    const type = ref(route.query.active);
    const active = ref(0);
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const list_tahun = ref([]);
    const tanggal = ref(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`)
    const tgls = ref(moment().format('DD'))
    const op = ref();


    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

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

    const loadData = async() => {
        // let dateString = `2024-05-01`;
        let dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tgls.value}`;
        tanggal.value = dateString;
        if (type.value != null) {
            active.value = Number(type.value);
        } else {
            active.value = 0
        }
        loadTahun();
        loadBulan();
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
            <div class="flex justify-content-end gap-1 p-2 border-1 border-gray-500 border-round">
                <Button label="Report" @click="active = 0" class="py-2 text-xs" severity="secondary" :text="active !== 0" size="small"/>
                <Button label="Daily DMO" @click="active = 1" class="py-2 text-xs" severity="secondary" :text="active !== 1" size="small"/>
                <Button label="Mothly DMO" @click="active = 2" class="py-2 text-xs" severity="secondary" :text="active !== 2" size="small"/>
                <Button label="Target (Real)" @click="active = 3" class="py-2 text-xs" severity="secondary" :text="active !== 3" size="small"/>
                <Button label="Target (RKAP)" @click="active = 4" class="py-2 text-xs" severity="secondary" :text="active !== 4" size="small"/>
            </div>
        </div>

        <!-- Table -->
        <div v-show="active == 0">
            <main-target :tanggal="tanggal"/>
            <!-- <h3 class="text-center text-red-400 uppercase text-lg">- Mohon maaf, Sedang Dalam Pengembangan -</h3> -->
        </div>
        <div v-show="active == 1">
            <daily-dmo :tanggal="tanggal"/>
        </div>
        <div v-show="active == 2">
            <monthly-dmo :tanggal="tanggal"/>
        </div>
        <div v-show="active == 3">
            <target-real :tanggal="tanggal"/>
            <!-- <h3 class="text-center text-red-400 uppercase text-lg">- Mohon maaf, Sedang Dalam Pengembangan -</h3> -->
        </div>
        <div v-show="active == 4">
            <target-rkap :tanggal="tanggal"/>
            <!-- <h3 class="text-center text-red-400 uppercase text-lg">- Mohon maaf, Sedang Dalam Pengembangan -</h3> -->
        </div>
    </div>
</template>