<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';

    // API
    import KpbnCpo from '@/api/cpo/KpbnCpo.js';
    import CostProd from '@/api/market_value/CostProd.js'

    // Variable
    const props = defineProps({
        tanggal:{
            type:String
        }
    });

    const days = props.tanggal
    const avg_actual_price = ref()
    const avg_cpo_kpbn_this_month = ref()
    const avg_cpo_kpbn_mtd = ref()
    const loadingData = ref(false)

    // Function
    const date = computed(()=> moment(props.tanggal).format('DD MMMM YYYY'))
    watch(() => props.tanggal, (newVal) => {loadProduct(newVal)});


    const loadProduct = async(tanggal) => {
        loadingData.value = true
        try {
            // CPO KPBN This Month
            const get_avg = await loadCPOKPBNMonth(tanggal);
            let avg_this_month = 0;
            if (get_avg != null) {
                let val_tot = 0
                for (let i = 0; i < get_avg.length; i++) {
                    val_tot = val_tot + Number(get_avg[i].avg);
                }
                avg_this_month = val_tot / get_avg.length;
            } else {
                avg_this_month = 0
            }
            avg_cpo_kpbn_this_month.value = formatCurrency(avg_this_month.toFixed(0))

            // Avg Actual Price
            const act_price = await loadAvgActualPrice(tanggal);
            if (act_price != null) {
                avg_actual_price.value = formatCurrency(act_price)
            } else {
                avg_actual_price.value = 0
            }

            // Value Average
            const get_cpo = await loadCpoKpbnYearly();
            let avg_this_year = 0;
            if (get_cpo != null) {
                const load_by_filter = get_cpo.filter(item => moment(item.tanggal).format('YYYY') == moment(tanggal).format('YYYY'))
                if (load_by_filter.length > 0 ) {
                    let val_cpo_tot = 0
                    for (let i = 0; i < load_by_filter.length; i++) {
                        val_cpo_tot = val_cpo_tot + Number(load_by_filter[i].avg);
                    }
                    avg_this_year = val_cpo_tot / load_by_filter.length;
                } else {
                    avg_this_year = 0
                }
            } else {
                avg_this_year = 0
            }
            avg_cpo_kpbn_mtd.value = formatCurrency(avg_this_year.toFixed(0))
            loadingData.value = false
        } catch (error) {
            avg_cpo_kpbn_this_month.value = 0
            avg_actual_price.value = 0
            avg_cpo_kpbn_mtd.value = 0
            loadingData.value = false
            
        }
    }

    const loadCPOKPBNMonth = async(tanggal) => {
        try {
            const respose = await KpbnCpo.getByDate({tanggal:tanggal});
            const load = respose.data;
            const data = load.data;
            return data;
        } catch (error) {
            return null;
        }
    }

    const loadCpoKpbnYearly = async() => {
        try {
            const respose = await KpbnCpo.getAll();
            const load = respose.data;
            const data = load.data;
            return data;
        } catch (error) {
            return null;
        }
    }

    const loadAvgActualPrice = async(tanggal) => {
        try {
            // const respose = await CostProd.getByDate({tanggal:tanggal, setting_name:'coa_bahan_baku'});
            // const load = respose.data;
            // return load.totalDifference;
            return null;
        } catch (error) {
            return null;
        }
    }

    onMounted(() => {
        loadProduct(props.tanggal);
    });

    const formatCurrency = (amount) =>  {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return parts.join(',');
    }

</script>
<template>
    <div class="flex gap-5">
        <div class="flex flex-column w-6 bg-green-700 p-2 border-round shadow-4 gap-3">
            <span class="text-center text-white font-bold">CPO Olah INL</span>
            <div class="flex gap-3">
                <div class="w-full flex flex-column gap-2 bg-white text-center border-round border-white p-3">
                    <span class="font-semibold text-green-600 border-bottom-1 pb-2">Avg Actual Price</span>
                    <span class="font-semibold text-red-600 text-5xl">
                        <span v-if="loadingData == true">.....</span>
                        <span v-else>{{avg_actual_price}}</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="flex flex-column w-full bg-green-700 p-2 border-round shadow-4 gap-3">
            <span class="text-center text-white font-bold">AVG CPO KPBN</span>
            <div class="flex gap-3">
                <div class="w-full flex flex-column gap-2 bg-white text-center border-round border-white p-3">
                    <span class="font-semibold text-green-600 border-bottom-1 pb-2">This Month</span>
                    <span class="font-semibold text-red-600 text-5xl">
                        <span v-if="loadingData == true">.....</span>
                        <span v-else>{{avg_cpo_kpbn_this_month}}</span>
                    </span>
                </div>
                <div class="w-full flex flex-column gap-2 bg-white text-center border-round border-white p-3">
                    <span class="font-semibold text-green-600 border-bottom-1 pb-2">MTD</span>
                    <span class="font-semibold text-red-600 text-5xl">
                        <span v-if="loadingData == true">.....</span>
                        <span v-else>{{avg_cpo_kpbn_mtd}}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>