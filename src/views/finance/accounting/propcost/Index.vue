<script setup>
    // Vue Component
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // Components
    import MarketValue from '@/views/finance/accounting/propcost/component/MarketValue.vue'
    import PropCost from '@/views/finance/accounting/propcost/component/PropCost.vue'

    const active = ref(0);

</script>

<template>
    <!-- Header + Menu -->
    <div class="flex flex-column justify-content-between p-4 bg-white border-round shadow-3">
        <div class="flex justify-content-between">
            <span class="font-medium text-xl ">{{active == 0 ? 'Market Value' : 'Proportion Cost'}}</span>
            <div class="flex mb-2 gap-2 justify-content-end border-1 p-2 border-round border-green-500">
                <Button @click="active = 0" label="Market Value" severity="success" class="h-2rem px-2" :text="active !== 0" />
                <Button @click="active = 1" label="Proportion Cost" severity="success" class="h-2rem px-2 p-0" :text="active !== 1" />
            </div>
        </div>
        <div v-show="active == 0">
            <market-value/>
        </div>
        <div v-show="active == 1">
            <prop-cost/>
        </div>
    </div>
</template>