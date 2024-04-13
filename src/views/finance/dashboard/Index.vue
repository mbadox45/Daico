<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // Components
    import FooterPage from '@/views/finance/dashboard/components/FooterPage.vue'
    import CardProductPage from '@/views/finance/dashboard/components/CardProductPage.vue'
    import ChartDougnutPage from '@/views/finance/dashboard/components/ChartDougnutPage.vue'
    import HeaderPage from '@/views/finance/component/HeaderPage.vue'

</script>

<template>
    <!-- Header + Menu -->

    <!-- Card Product -->
    <card-product-page/>

    <!-- Chart Dougnut Realisasi RKAP & Kinerja Produksi -->
    <chart-dougnut-page/>
</template>