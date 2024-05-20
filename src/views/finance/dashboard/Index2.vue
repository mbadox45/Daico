<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';

    // Components
    import CardDashAvg from '@/views/finance/dashboard/components/CardDashAvg.vue'
    import CardPotensiPage from '@/views/finance/dashboard/components/CardPotensiPage.vue'
    import CardSellingPrice from '@/views/finance/dashboard/components/CardSellingPrice.vue'
    import ChartDougnutPage from '@/views/finance/dashboard/components/ChartDougnutPage2.vue'
    import ChartLinePage from '@/views/finance/dashboard/components/ChartLinePage.vue'

    // API

    // Variable
    const now = moment().format('YYYY-MM-DD');
    const userName = ref(JSON.parse(localStorage.getItem('payload')))
    const tanggal = ref(`${moment(now).format('YYYY-MM')}-${(Number(moment(now).format('D'))-1).toString().padStart(2, '0')}`)

    // Function
    onMounted(() => {
        // loadProduct()
    })

    const onSubmit = (date) => {
        tanggal.value = date;
        console.log(tanggal.value)
    }

</script>

<template>
    <div class="flex flex-column gap-5 mt-5 md:mt-0 ">
        <div class="flex flex-column gap-4 w-full">
            <card-dash-avg @submit="onSubmit"/>
            <card-selling-price :tanggal="tanggal"/>
            <!-- Cards Statistics -->
            <chart-dougnut-page/>
        </div>
        <card-potensi-page/>
    </div>
</template>