<script setup>
    // Vue Component
    import { ref, computed } from 'vue';
    import moment from 'moment';

    // API
    import {potensi_margin} from '@/api/dummy/potensi_margin.js'

    // Variable
    const list_potensi_margin = ref([])
    const pm = potensi_margin

    // Function
    const loadProduct = () => {
        list_potensi_margin.value = []
        for (let i = 0; i < pm.length; i++) {
            list_potensi_margin.value.push({
                type: pm[i].type,
                diff: pm[i].diff,
                idr_kpbn: pm[i].idr_kpbn,
                usd_kpbn: pm[i].usd_kpbn,
                idr_olah: pm[i].idr_olah,
                usd_olah: pm[i].usd_olah,
            })
        }
        console.log(list_potensi_margin.value)
    }

    loadProduct()
</script>

<template>
    <div class="flex flex-column gap-3 py-2">
        <div class="p-3 border-1 border-round border-gray-300 flex flex-column gap-5 bg-white">
            <span class="font-semibold text-xl text-center w-full border-bottom-1 pb-3 border-gray-300">MINIMUM SELLING PRICE (EXCL. LEVY DUTY) <i class="pi pi-angle-double-right mx-3 text-xl"></i> GPM 7% Base On CPO Olah INL</span>
            <!-- Produk Kemasan -->
            
        </div>
    </div>
</template>