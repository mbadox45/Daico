<script setup>
    // Vue Component
    import { ref, computed, defineEmits, onMounted } from 'vue';
    import moment from 'moment';

    // API
    import RateOdoo from '@/api/odoo_api/currency/RateOdoo.js';

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
        loadBulan()
        loadTahun()
        loadMonth()
    })

    const loadMonth = () => {
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
        emit('submit', dateString)
        loadJisdor()
    }

    const loadJisdor = async() => {
        loadingData.value = true
        try {
            const respose = await RateOdoo.postRate({tanggal: period.value, mata_uang:'USD'});
            const load = respose.data;
            const data = load.data
    
            // Avg Kurs Monthly
            const get_avg = data;
            let val_tot = 0;
            for (let i = 0; i < get_avg.length; i++) {
                val_tot = val_tot + Number(get_avg[i].rate)
            }
            const avg = val_tot / get_avg.length;
    
            const data_last = data.sort((a, b) => new Date(b.name) - new Date(a.name))

            avg_jisdor.value = formatCurrency(avg.toFixed(0));
            jisdor_lastday.value = formatCurrency(Number(data_last[0].rate))
            kurs_mandiri.value = 0
            loadingData.value = false
        } catch (error) {
            avg_jisdor.value = 0
            jisdor_lastday.value = 0
            kurs_mandiri.value = 0
            loadingData.value = false
        }
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

    const formatCurrency = (amount) =>  {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return parts.join(',');
    }

</script>
<template>
    <div class="flex flex-column w-full gap-4">
        <!-- Cards Update Date & View Avg Kurs -->
        <div class="bg-white p-4 border-round shadow-3 gap-5 flex justify-content-between w-full">
            <div class="flex flex-column gap-2 w-5">
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
            <div class="w-full flex align-items-center gap-3 justify-content-end">
                <div class="flex align-items-center gap-2 p-3 bg-yellow-600 text-white border-round h-full w-auto">
                    <i class="pi pi-dollar text-6xl font-bold"></i>
                    <div class="flex flex-column gap-3 border-left-1 pl-3 border-white">
                        <span class="text-5xl flex gap-3 justify-content-between">
                            <span>Rp</span> 
                            <div>
                                <span v-if="loadingData == true">.....</span>
                                <span v-else>{{avg_jisdor}}</span>
                            </div>
                        </span>
                        <div class="font-medium border-round flex gap-2 w-auto">
                            <small class="flex gap-2 text-xs"><i class="pi pi-caret-right"></i> Avg Kurs Jisdor</small>
                        </div>
                    </div>
                </div>
                <div class="flex align-items-center gap-2 p-3 bg-cyan-600 text-white border-round h-full">
                    <i class="pi pi-dollar text-6xl font-bold"></i>
                    <div class="flex flex-column gap-3 border-left-1 pl-3 border-white">
                        <span class="text-5xl flex gap-3 justify-content-between">
                            <span>Rp</span>
                            <div>
                                <span v-if="loadingData == true">.....</span>
                                <span v-else>{{jisdor_lastday}}</span>
                            </div>
                        </span>
                        <div class="font-medium border-round flex gap-2 w-auto">
                            <small class="flex gap-2 text-xs"><i class="pi pi-caret-right"></i> Kurs Jisdor Last Day</small>
                        </div>
                    </div>
                </div>
                <div class="flex align-items-center gap-2 p-3 bg-indigo-600 text-white border-round h-full">
                    <i class="pi pi-dollar text-6xl font-bold"></i>
                    <div class="flex flex-column gap-3 border-left-1 pl-3 border-white">
                        <span class="text-5xl flex gap-3 justify-content-between">
                            <span>Rp</span>
                            <div>
                                <span v-if="loadingData == true">.....</span>
                                <span v-else>{{kurs_mandiri}}</span>
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