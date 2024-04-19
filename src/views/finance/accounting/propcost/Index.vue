<script setup>
    // Vue Component
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // Components
    import MarketValue from '@/views/finance/accounting/propcost/component/MarketValue.vue'
    import PropCost from '@/views/finance/accounting/propcost/component/PropCost.vue'

</script>

<template>
    <!-- Header + Menu -->
    <div class="flex flex-wrap justify-content-between gap-5">
        <TabView class="tabview-custom card w-full">
            <TabPanel>
                <template #header>
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-chart-line text-xl"/>
                        <span class="font-bold white-space-nowrap">Market Value</span>
                    </div>
                </template>
                <market-value/>
            </TabPanel>
            <TabPanel>
                <template #header>
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-money-bill text-xl"/>
                        <span class="font-bold white-space-nowrap">Proportion Cost</span>
                    </div>
                </template>
                <prop-cost/>
            </TabPanel>
        </TabView>
    </div>
</template>