<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API
    import {loadRetail} from '@/views/load_data/stock.js'
    import {loadLocation} from '@/views/load_data/master_config.js'

    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const loadingTable = ref(false);
    const list_lokasi = ref([])
    const location = ref(null)
    const forms = ref([])

    onMounted(() => {
        loadData()
    })

    const loadData = async() => {
        loadingTable.value = true
        try {
            const lokasi = await loadLocation()
            const site = lokasi.filter(item => item.id >= 4)
            list_lokasi.value = site
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
        }
    }
    
    const loadDataRetail = async() => {
        const retail = await loadRetail()
        const list_retail = retail.find(item => item.location_id == location.value)
        const items = list_retail.items
        for (let i = 0; i < items.length; i++) {
            forms.value.push({
                produk: `${items[i].produk}`,
                productable_id: items[i].productable_id,
                productable_type: items[i].productable_type,
                tanggal: moment().format('YYYY-MM-DD'),
                sub_product: items[j].sub_product,
                product_type: 'produk',
                location_id: list_retail.location_id,
                ctn: null,
            })
        }
        console.log(list_retail)
    }

    const postData = async() => {

    }

</script>
<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-2">
            <span class="font-medium text-xl uppercase">Form Stock Retail <span class="">{{ route.query.type }}</span></span>
            <div class="flex gap-2">
                <Button label="Back" icon="pi pi-times" size="small" class="px-3 py-2" severity="danger" outlined @click="()=>{router.push('/stock')}"/>
                <Button label="Save" icon="pi pi-save" size="small" class="px-3 py-2" severity="success" @click="postData"/>
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
        <div v-else class="flex flex-column gap-5">
            <Dropdown v-model="location" :options="list_lokasi" optionLabel="name" optionValue="id" placeholder="Select a Location" class="w-full md:w-56" @change="loadDataRetail" />
            <div >

            </div>
        </div>
    </div>
</template>