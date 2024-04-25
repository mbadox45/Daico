<script setup>
    // Vue Component
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // Components
    import AllocMaster from '@/views/finance/config/master/components/AllocMaster.vue'
    import ReportMaster from '@/views/finance/config/master/components/ReportMaster.vue'
    import CentreMaster from '@/views/finance/config/master/components/CentreMaster.vue'
    import PlantMaster from '@/views/finance/config/master/components/PlantMaster.vue'
    import CategoryMaster from '@/views/finance/config/master/components/CategoryMaster.vue'

</script>

<template>
    <div class="flex flex-wrap justify-content-between gap-3">
        <alloc-master/>
        <report-master/>
        <centre-master/>
        <plant-master/>
        <category-master/>
    </div>
</template>