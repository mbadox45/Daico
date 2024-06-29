<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API
    import {addStockBulky, updateStockBulky, loadDataBulky} from '@/views/load_data/stock.js'
    import {loadLocation, loadTank, loadBulky, loadProduct, loadSubProduct} from '@/views/load_data/master_config.js'
    import {productable_type} from '@/api/DummyData.js'

    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const loadingTable = ref(false);
    const loadingProduct = ref(false);
    const disabled = ref(true);
    const list_tank = ref([])
    const list_produk = ref([])
    const list_type = ref(productable_type)
    const location = ref(null)
    const forms = ref(
        {id: null, tanggal: moment().format('YYYY-MM-DD'), tank_id: null, location: null, productable_type: null, productable_id: null, stok_mt: null, stok_exc_btm_mt: null, umur: null, remarks: null}
    )

    onMounted(() => {
        loadData()
    })

    const loadData = async() => {
        loadingTable.value = true
        try {
            const tank = await listTank()
            list_tank.value = tank
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
        }
    }

    const listTank = async() => {
        const tank = await loadTank()
        const data = []
        for (let i = 0; i < tank.length; i++) {
            data.push({
                id: tank[i].id,
                name: `Tank - ${tank[i].name}, Cap. ${tank[i].capacity}, ${tank[i].location.name}`
            })
        }
        return data;
    }

    const listBulky = async() => {
        loadingTable.value = true
        const bulky = await loadDataBulky()
        if (bulky != null) {
            const filter = bulky.find(item => item.tank_id == forms.value.tank_id)
            if (filter != null) {
                forms.value.id = filter.id;
                forms.value.stok_mt = filter.stok_mt;
                forms.value.productable_id = filter.productable_id;
                forms.value.productable_type = filter.productable_type;
                forms.value.remarks = filter.remarks;
                forms.value.tanggal = filter.tanggal;
                forms.value.umur = filter.umur;
                forms.value.stok_exc_btm_mt = filter.stok_exc_btm_mt;
                await listProduct()
            } else {
                forms.value.id = null;
                forms.value.stok_mt = null;
                forms.value.productable_id = null;
                forms.value.productable_type = null;
                forms.value.remarks = null;
                forms.value.tanggal = moment().format('YYYY-MM-DD');
                forms.value.umur = null;
                forms.value.stok_exc_btm_mt = null;
                disabled.value = true
            }
        }
        loadingTable.value = false
    }

    const listProduct = async() => {
        loadingProduct.value = true
        let data = []
        switch (forms.value.productable_type) {
            case "bulk":
                const bulk = await loadBulky()
                const kecuali_bulk = bulk.filter(item => !item.name.includes('Olein'))
                for (let i = 0; i < kecuali_bulk.length; i++) {
                    data.push({
                        id: kecuali_bulk[i].id,
                        name: kecuali_bulk[i].name
                    })
                }
                break;
            case "product":
                const product = await loadProduct()
                const kecuali_product = product.filter(item => !item.nama.includes('SP') && !item.nama.includes('PP'))
                for (let i = 0; i < kecuali_product.length; i++) {
                    data.push({
                        id: kecuali_product[i].id,
                        name: kecuali_product[i].productable.name + ' ' + kecuali_product[i].nama
                    })
                }
                break;
            default:
                const subproduct = await loadSubProduct()
                const kecuali = subproduct.filter(item => 
                !item.nama.includes('Kemasan ') && 
                !item.nama.includes('Kemasan') && 
                !item.nama.includes('Bulk') && 
                !item.nama.includes('1L') && 
                !item.nama.includes('2L') && 
                !item.nama.includes('ML')
                )
                for (let i = 0; i < kecuali.length; i++) {
                    data.push({
                        id: kecuali[i].id,
                        name: `RBD Olein ${kecuali[i].product.nama} (${kecuali[i].nama})`
                    })
                }
                break;
        }
        disabled.value = false
        loadingProduct.value = false
        list_produk.value = data;
    }
    
    // const loadDataRetail = async() => {
    //     loadingTable.value = true
    //     const retail = await loadRetail()
    //     const list_retail = retail.find(item => item.location_id == location.value)
    //     const items = list_retail.items
    //     forms.value = []
    //     for (let i = 0; i < items.length; i++) {
    //         forms.value.push({
    //             id: items[i].id,
    //             produk: `${items[i].produk}`,
    //             productable_id: items[i].productable_id,
    //             productable_type: items[i].productable_type,
    //             tanggal: moment().format('YYYY-MM-DD'),
    //             sub_product: items[i].sub_product,
    //             productable_type: items[i].product_type,
    //             location_id: list_retail.location_id,
    //             ctn: null,
    //         })
    //     }
    //     loadingTable.value = false
    // }

    const postData = async() => {
        loadingTable.value = true
        try {
            if (forms.value.stok_exc_btm_mt != null && forms.value.stok_mt != null && forms.value.umur != null && forms.value.productable_id != null && forms.value.productable_type != null && forms.value.tank_id != null) {
                let response;
                if (forms.value.tanggal == moment().format('YYYY-MM-DD')) {
                    response = await updateStockBulky(forms.value.id, forms.value)
                } else {
                    response = await addStockBulky(forms.value)
                }
                if (response.success == true) {
                    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Proses Input Error', detail: 'Data sudah ada', life: 3000 });
                }
            } else {
                toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'Harap data diisi dengan lengkap.', life: 3000 });
            }
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
            toast.add({ severity: 'error', summary: 'Proses Input Error', detail: "error.response.data.message", life: 3000 });
        }
    }

    // const postData = async() => {
    //     loadingTable.value = true
    //     try {
    //         let total = 0
    //         const form = forms.value
    //         for (let i = 0; i < form.length; i++) {
    //             if (form[i].ctn != null ) {
    //                 total += 1
    //             }
    //         }
    //         if (total >= form.length) {
    //             let berhasil = 0 , gagal = 0;
    //             for (let i = 0; i < form.length; i++) {
    //                 const list = {
    //                     id: form[i].id,
    //                     tanggal: form[i].tanggal,
    //                     location_id: form[i].location_id,
    //                     ctn: form[i].ctn,
    //                     productable_type: form[i].productable_type,
    //                     productable_id: form[i].productable_id,
    //                 }
    //                 let response;
    //                 if (form[i].tanggal == moment('YYYY-MM-DD') && form[i].id != null) {
    //                     response = await updateStockRetail(form[i].id, list);
    //                 } else {
    //                     response = await addStockRetail(list);
    //                 }
    //                 if (response.success == true) {
    //                     berhasil += 1
    //                 } else {
    //                     gagal += 1
    //                 }
    //             }
    //             if (berhasil >= form.length && gagal == 0) {
    //                 toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
    //             } else {
    //                 toast.add({ severity: 'error', summary: 'Proses Input Error', detail: 'Data sudah ada', life: 3000 });
    //             }
    //             loadingTable.value = false
    //             // toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
    //         } else {
    //             loadingTable.value = false
    //             toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'Harap data diisi dengan lengkap.', life: 3000 });
    //         }
    //     } catch (error) {
    //         loadingTable.value = false
    //         toast.add({ severity: 'error', summary: 'Proses Input Error', detail: "error.response.data.message", life: 3000 });
    //     }
    // }

</script>
<template>
    <Toast />
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-2">
            <span class="font-medium text-xl uppercase">Form Stock Bulky</span>
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
            <!-- <div class="grid" v-for="(item, index) in forms" :key="index"> -->
            <div class="grid">
                <div class="px-3 col-6 flex flex-column gap-2">
                    <label>Tank & Location</label>
                    <Dropdown v-model="forms.tank_id" filter :options="list_tank" optionLabel="name" optionValue="id" placeholder="Select a Tank" class="w-full md:w-56" @change="listBulky()"/>
                </div>
                <div class="px-3 col-3 flex flex-column gap-2">
                    <label>Product Type</label>
                    <Dropdown v-model="forms.productable_type" :options="list_type" optionLabel="name" optionValue="id" placeholder="Select a Product Type" class="w-full md:w-56" @change="listProduct()"/>
                </div>
                <div class="px-3 col-3 flex flex-column gap-2">
                    <label>Product</label>
                    <ProgressBar v-if="loadingProduct == true" mode="indeterminate" style="height: 6px"></ProgressBar>
                    <Dropdown v-else v-model="forms.productable_id" :options="list_produk" optionLabel="name" optionValue="id" placeholder="Select a Product" class="w-full md:w-56" :disabled="disabled"/>
                </div>
                <div class="px-3 col-4 flex flex-column gap-2">
                    <label>Stock MT</label>
                    <InputNumber v-model="forms.stok_mt" class="w-full" placeholder="Stock MT" :maxFractionDigits="5" inputId="locale-german" locale="de-DE" />
                </div>
                <div class="px-3 col-4 flex flex-column gap-2">
                    <label>Stock</label>
                    <InputNumber v-model="forms.stok_exc_btm_mt" class="w-full" placeholder="Stock" :maxFractionDigits="5" inputId="locale-german" locale="de-DE" />
                </div>
                <div class="px-3 col-4 flex flex-column gap-2">
                    <label>Umur</label>
                    <InputNumber v-model="forms.umur" class="w-full" placeholder="Umur" :maxFractionDigits="0" inputId="locale-german" locale="de-DE" />
                </div>
                <div class="px-3 col-12 flex flex-column gap-2">
                    <label>Remarks</label>
                    <InputText type="text" v-model="forms.remarks" class="w-full" placeholder="Remarks"/>
                </div>
            </div>
        </div>
    </div>
</template>