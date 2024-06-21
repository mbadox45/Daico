<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // API
    import {loadTank, loadProduct} from '@/views/load_data/master_config.js'

    // Components
    import BulkyStock from '@/views/finance/accounting/stock/components/BulkyStock.vue'

    const active = ref(0);
    const load_bulky = ref([])

    onMounted(() => {
        loadData()
    })

    const loadData = async() => {
        // Bulky
        const response = await loadTank()
        const produk = await loadProduct()
        console.log(produk)
        load_bulky.value = []
        for (let i = 0; i < response.length; i++) {
            load_bulky.value.push({
                location: response[i].location.name,
                location_id: response[i].location_id,
                capacity: response[i].capacity,
                name: response[i].name,
                tank_id: response[i].tank_id,
                stok_mt: null,
                stok_exc_btm_mt: null,
                umur: null, 
                remarks: null,
            })
        }
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
        <div v-show="active == 0">
            <bulky-stock :datas="load_bulky"/>
        </div>
        <div v-show="active == 1">
            <!-- <prop-cost/> -->
        </div>
    </div>
</template>