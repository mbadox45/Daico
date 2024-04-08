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

</script>

<template>
    <div class="min-h-screen flex flex-column pt-3 pb-8 gap-3">
    <!-- <div class="min-h-screen flex flex-column pt-3 pb-8 gap-3" style="background-color:#135D66;"> -->
        <div class="bg-white m-4 py-2 border-round shadow-3">
            <card-product-page/>
        </div>
        <chart-dougnut-page/>
        <footer-page/>
    </div>
</template>