<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // Components
    import CardPotensiPage from '@/views/finance/dashboard/components/CardPotensiPage.vue'
    import CardProductPage from '@/views/finance/dashboard/components/CardProductPage.vue'
    import ChartDougnutPage from '@/views/finance/dashboard/components/ChartDougnutPage.vue'
    import ChartLinePage from '@/views/finance/dashboard/components/ChartLinePage.vue'

</script>

<template>
    <div>
        <!-- Header + Menu -->
    
        <!-- Card Product -->
        <card-product-page/>
        
        <!-- Chart Dougnut Realisasi RKAP & Kinerja Produksi -->
        <chart-dougnut-page/>
        
        <card-potensi-page/>

        <!-- Chart Dougnut Realisasi RKAP & Kinerja Produksi -->
        <chart-line-page/>
    </div>
</template>