<script setup>
    // Vue Component
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // Components
    import AvgCpo from '@/views/finance/accounting/cpokpbn/component/AvgCpo.vue'
    import IncomingCpo from '@/views/finance/accounting/cpokpbn/component/IncomingCpo.vue'
    import OutstandingCpo from '@/views/finance/accounting/cpokpbn/component/OutstandingCpo.vue'

</script>

<template>
    <!-- Header + Menu -->
    <div class="flex flex-wrap justify-content-between gap-5">
        <div class="w-full md:w-full">
            <avg-cpo/>
        </div>
        <div class="w-full md:w-full">
            <incoming-cpo/>
        </div>
        <div class="w-full md:w-full">
            <outstanding-cpo/>
        </div>
    </div>
</template>