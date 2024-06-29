<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API
    import {loadRetail, addStockRetail, updateStockRetail} from '@/views/load_data/stock.js'
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
        loadingTable.value = true
        const retail = await loadRetail()
        const list_retail = retail.find(item => item.location_id == location.value)
        const items = list_retail.items
        forms.value = []
        for (let i = 0; i < items.length; i++) {
            forms.value.push({
                id: items[i].id,
                produk: `${items[i].produk}`,
                productable_id: items[i].productable_id,
                productable_type: items[i].productable_type,
                tanggal: moment().format('YYYY-MM-DD'),
                sub_product: items[i].sub_product,
                productable_type: items[i].product_type,
                location_id: list_retail.location_id,
                ctn: null,
            })
        }
        loadingTable.value = false
    }

    const postData = async() => {
        loadingTable.value = true
        try {
            let total = 0
            const form = forms.value
            for (let i = 0; i < form.length; i++) {
                if (form[i].ctn != null ) {
                    total += 1
                }
            }
            if (total >= form.length) {
                let berhasil = 0 , gagal = 0;
                for (let i = 0; i < form.length; i++) {
                    const list = {
                        id: form[i].id,
                        tanggal: form[i].tanggal,
                        location_id: form[i].location_id,
                        ctn: form[i].ctn,
                        productable_type: form[i].productable_type,
                        productable_id: form[i].productable_id,
                    }
                    let response;
                    if (form[i].tanggal == moment('YYYY-MM-DD') && form[i].id != null) {
                        response = await updateStockRetail(form[i].id, list);
                    } else {
                        response = await addStockRetail(list);
                    }
                    if (response.success == true) {
                        berhasil += 1
                    } else {
                        gagal += 1
                    }
                }
                if (berhasil >= form.length && gagal == 0) {
                    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Proses Input Error', detail: 'Data sudah ada', life: 3000 });
                }
                loadingTable.value = false
                // toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
            } else {
                loadingTable.value = false
                toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'Harap data diisi dengan lengkap.', life: 3000 });
            }
        } catch (error) {
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
            <table>
                <tbody>
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