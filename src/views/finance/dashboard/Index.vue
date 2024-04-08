<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // Components
    import FooterPage from '@/views/finance/dashboard/components/FooterPage.vue'
    import CardProductPage from '@/views/finance/dashboard/components/CardProductPage.vue'

</script>

<template>
    <div class="bg-blue-100 min-h-screen flex flex-column relative">
        <card-product-page/>
        <div class="w-full">
            <span>Test</span>
        </div>
        <footer-page/>
    </div>
</template>