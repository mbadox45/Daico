<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // API
    import {loadTank, loadProduct, loadLocation} from '@/views/load_data/master_config.js'
    import {loadRetail, loadDataBulky} from '@/views/load_data/stock.js'

    // Components
    import BulkyStock from '@/views/finance/accounting/stock/components/BulkyStock.vue'
    import RetailStock from '@/views/finance/accounting/stock/components/RetailStock.vue'

    const active = ref(0);
    const load_bulky = ref([])
    const load_retail = ref([])
    const loadingTable = ref(false);

    onMounted(() => {
        loadData()
    })

    const loadData = async() => {
        // Bulky
        loadingTable.value = true
        const response = await loadDataBulky()
        load_bulky.value = response
        console.log(response)

        load_retail.value = await loadRetail();
        loadingTable.value = false
    }

</script>

<template>
    <!-- Header + Menu -->
    <div class="flex flex-column justify-content-between p-4 bg-white border-round shadow-3">
        <div class="flex justify-content-between">
            <span class="font-medium text-xl ">{{active == 0 ? 'Stock Bulky' : 'Stock Retail'}}</span>
            <div class="flex mb-2 gap-2 justify-content-end border-1 p-2 border-round border-gray-500">
                <Button @click="active = 0" label="Bulky" severity="secondary" class="h-2rem px-2 text-sm" :text="active !== 0" />
                <Button @click="active = 1" label="Retail" severity="secondary" class="h-2rem px-2 p-0 text-sm" :text="active !== 1" />
            </div>
        </div>
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <div v-else>
            <div v-show="active == 0">
                <bulky-stock :datas="load_bulky"/>
            </div>
            <div v-show="active == 1">
                <retail-stock :datas="load_retail"/>
            </div>
        </div>
    </div>
</template>