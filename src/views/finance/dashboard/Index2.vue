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
    import CardCpoPage from '@/views/finance/dashboard/components/CardCPOPage.vue'
    import CpoAndRoutersPage from '@/views/finance/dashboard/components/CpoAndRoutersPage.vue'

    // API

    // Variable
    const now = moment().format('YYYY-MM-DD');
    const userName = ref(JSON.parse(localStorage.getItem('payload')))
    const tanggal = ref(`${moment(now).format('YYYY-MM')}-${(Number(moment(now).format('D'))-1).toString().padStart(2, '0')}`)
    const load_data = ref()
    const loadingData = ref(false)


    const onSubmit = async(date, data) => {
        // tanggal.value = '2024-05-31';
        console.log(loadingData.value);
        try {
            tanggal.value = date;
            load_data.value = data
        } finally {
            loadingData.value = false
        }
    }

</script>

<template>
    <div class="flex flex-column gap-5 mt-5 md:mt-0 ">
        <div class="flex flex-column gap-4 w-full">
            <card-dash-avg @submit="onSubmit"/>
            <card-minimum-selling-page :tanggal="tanggal" :datas="load_data"/>
            <!-- <card-selling-price :tanggal="tanggal"/> -->
            <div class="flex md:flex-row flex-column gap-5 align-items-center md:align-items-start">
                <card-cpo-page :tanggal="tanggal" :datas="load_data"/>
                <card-cash-page :tanggal="tanggal" :datas="load_data"/>
            </div>
            <!-- Cards Statistics -->
            <cpo-and-routers-page :tanggal="tanggal" :datas="load_data"/>
            <!-- <chart-dougnut-page :tanggal="tanggal"/> -->
        </div>
        <!-- <card-potensi-page/> -->
    </div>
</template>