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
    <div class="flex flex-wrap justify-content-between gap-5">
        <TabView class="tabview-custom card w-full">
            <TabPanel>
                <template #header>
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-chart-line text-xl"/>
                        <span class="font-bold white-space-nowrap">CPO KPBN</span>
                    </div>
                </template>
                <avg-cpo/>
            </TabPanel>
            <TabPanel>
                <template #header>
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-money-bill text-xl"/>
                        <span class="font-bold white-space-nowrap">Actual CPO</span>
                    </div>
                </template>
                <incoming-cpo/>
            </TabPanel>
            <TabPanel>
                <template #header>
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-money-bill text-xl"/>
                        <span class="font-bold white-space-nowrap">Outstanding CPO</span>
                    </div>
                </template>
                <outstanding-cpo/>
            </TabPanel>
        </TabView>
    </div>
</template>