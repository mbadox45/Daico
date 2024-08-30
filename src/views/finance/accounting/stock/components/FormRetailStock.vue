<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API
    import {loadRetail, addStockRetail, updateStockRetail} from '@/views/load_data/stock.js'
    import {loadAll_LocationMaster} from '@/controller/master_data/LocationController.js'
    import {loadTable_StockRetailController, postData_StockRetailController} from '@/controller/retail/StockRetailController.js'

    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const loadingTable = ref(false);
    const list_lokasi = ref([])
    const list_latest = ref([])
    const list_pallet = ref([])
    const location = ref(null)
    const forms = ref([])
    const forms_kapasitas = ref([])

    onMounted(() => {
        loadData()
    })

    const loadData = async() => {
        loadingTable.value = true
        try {
            const lokasi = await loadAll_LocationMaster()
            const site = lokasi.filter(item => item.id >= 4)
            const data = await dataLatest()
            list_lokasi.value = site
            list_latest.value = data.list
            list_pallet.value = data.kapasitas_wh
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
        }
    }

    const dataLatest = async() => {
        const data = await loadTable_StockRetailController();
        const response = data.list
        const list = [];
        const list_wh = [];
        for (let i = 0; i < response.length; i++) {
            const items = response[i].items;
            const kapasitas = response[i].kapasitas_wh;
            for (let j = 0; j < items.length; j++) {
                list.push({
                    id: items[j].id,
                    produk: items[j].produk,
                    location_id: items[j].location_id,
                    location_name: items[j].location_name,
                    ctn: items[j].ctn,
                    tanggal: items[j].tanggal,
                    productable_type: items[j].productable_type,
                    productable_id: items[j].productable_id,
                })
            }
            list_wh.push({
                id: kapasitas.id,
                location_id: kapasitas.location_id,
                location_name: kapasitas.location_name,
                tanggal: kapasitas.tanggal,
                value: kapasitas.pallet,
            })
        }
        return {
            list: list,
            kapasitas_wh: list_wh
        };
    }
    
    const loadDataRetail = async() => {
        loadingTable.value = true
        const retail = list_latest.value
        const list = retail.filter(item => item.location_id == location.value)
        const pallet = list_pallet.value
        const lp = pallet.filter(item => item.location_id == location.value)
        forms_kapasitas.value = lp
        forms.value = list
        loadingTable.value = false
    }

    const postData = async() => {
        loadingTable.value = true
        try {
            const response = await postData_StockRetailController(forms.value, forms_kapasitas.value);
            toast.add({ severity: response.severity, summary: response.severity == 'success' ? 'Sukses' : response.severity == 'warn' ? 'Mohon Perhatian' : 'Gagal Proses', detail: response.content, life: 3000 });
            loadingTable.value = false
            setTimeout(function() {
                loadData()
                router.push('/stock')
            }, 2000);
            console.log(response)
        } catch (error) {
            loadData()
            loadingTable.value = false
            toast.add({ severity: 'error', summary: 'Proses Input Error', detail: "error.response.data.message", life: 3000 });
        }
    }

</script>
<template>
    <Toast />
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-2">
            <span class="font-medium text-xl uppercase">Form Stock Retail <span class="">{{ route.query.type }}</span></span>
            <div class="flex gap-2">
                <Button label="Back" icon="pi pi-times" size="small" class="px-3 py-2" severity="danger" outlined @click="()=>{router.push('/stock')}"/>
                <Button :disabled="location == null ? true : false" label="Save" icon="pi pi-save" size="small" class="px-3 py-2" severity="success" @click="postData"/>
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
            <Dropdown v-model="location" :options="list_lokasi" showClear optionLabel="name" optionValue="id" placeholder="Select a Location" class="w-full md:w-56" @change="loadDataRetail" />
            <table>
                <tbody>
                    <tr v-for="(item, indexs) in forms_kapasitas" :key="indexs">
                        <td width="50%">
                            <label for="kapasitas" class="font-medium font-italic">Kapasitas WH</label>
                        </td>
                        <td>
                            <InputNumber id="kapasitas" v-model="item.value" class="w-full" placeholder="Kapasitas WH" :maxFractionDigits="5" inputId="locale-german" locale="de-DE" />
                        </td>
                    </tr>
                    <tr v-for="(item, index) in forms" :key="index">
                        <td width="50%">
                            <label :for="item.produk" class="font-medium font-italic">{{ item.produk }}</label>
                        </td>
                        <td>
                            <InputNumber :id="item.produk" v-model="item.ctn" class="w-full" placeholder="Ctn" :maxFractionDigits="5" inputId="locale-german" locale="de-DE" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>