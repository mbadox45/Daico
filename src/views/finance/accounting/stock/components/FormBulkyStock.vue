<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API
    import {loadAll_TankMaster} from '@/controller/master_data/TankController.js';
    import {loadTable_StockBulkyController, postData_StockBulkyController} from '@/controller/retail/StockBulkyController.js'
    import {loadAll_BulkyMarketMaster} from '@/controller/master_data/BulkyMarketController.js'
    import {loadAll_SubProductMaster} from '@/controller/master_data/SubProductController.js'
    import {loadAll_ProductMaster} from '@/controller/master_data/ProductController.js'
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
        [{index: null, id: null, tanggal: moment().format('YYYY-MM-DD'), tank_id: null, location: null, productable_type: null, productable_id: null, stok_mt: null, stok_exc_btm_mt: null, umur: null, remarks: null}]
    )

    onMounted(() => {
        loadData()
    })

    const loadData = async() => {
        loadingTable.value = true
        await loadForms()
        // await listProduct();
        // try {
        //     // const tank = await listTank()
        //     const tank = await loadAll_TankMaster()
        //     console.log(tank)
        //     list_tank.value = tank
        //     loadingTable.value = false
        // } catch (error) {
            loadingTable.value = false
        // }
    }

    const loadForms = async() => {
        const tank = await loadAll_TankMaster();
        const data = await loadTable_StockBulkyController()
        const list_prod_prod = await listProduct()
        list_produk.value = list_prod_prod
        const list_prod = list_prod_prod
        const list = []
        const list_list = []
        if (tank != null) {
            for (let i = 0; i < tank.length; i++) {
                const load = data.find(item => item.tank_id == tank[i].id)
                const prod = list_prod.find(item => item.id == load.productable_id && item.type == load.productable_type)
                list.push({
                    index: i,
                    id: load.id,
                    tanggal: load.tanggal,
                    tank_id: tank[i].id,
                    tank_name: tank[i].name,
                    capacity: tank[i].capacity,
                    productable_type: load.productable_type,
                    productable_id: prod,
                    stok_mt: load.stok_mt,
                    stok_exc_btm_mt: load.stok_exc_btm_mt,
                    umur: load.umur,
                    remarks: load.remarks,
                })
            }
            forms.value = list
        }
    }

    const listProduct = async() => {
        // loadingProduct.value = true
        const data = []
        // Proses Bulky
        const bulk = await loadAll_BulkyMarketMaster()
        const kecuali_bulk = bulk.filter(item => !item.name.includes('Olein'))
        for (let i = 0; i < kecuali_bulk.length; i++) {
            data.push({
                id: kecuali_bulk[i].id,
                name: `Bulky - ${kecuali_bulk[i].name}`,
                type: 'bulk'
            })
        }
        // Proses Product
        const product = await loadAll_ProductMaster()
        const kecuali_product = product.filter(item => !item.nama.includes('SP') && !item.nama.includes('PP'))
        for (let i = 0; i < kecuali_product.length; i++) {
            data.push({
                id: kecuali_product[i].id,
                name: 'Product - ' + kecuali_product[i].productable.name + ' ' + kecuali_product[i].nama,
                type: 'product'
            })
        }

        // Proses SubProduct
        const subproduct = await loadAll_SubProductMaster()
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
                name: `Sub Product - RBD Olein ${kecuali[i].product.nama} (${kecuali[i].nama})`,
                type: 'subproduct'
            })
        }
        // list_produk.value = data

        return data;
    }

    const postData = async() => {
        loadingTable.value = true
        try {
            const response = await postData_StockBulkyController(forms.value)
            toast.add({ severity: response.severity, summary: response.severity == 'success' ? 'Sukses' : response.severity == 'warn' ? 'Mohon Perhatian' : 'Gagal Proses', detail: response.content, life: 3000 });
            loadingTable.value = false
            setTimeout(function() {
                loadData()
                router.push('/stock')
            }, 2000);
            console.log(response)
        } catch (error) {
            loadingTable.value = false
            toast.add({ severity: 'error', summary: 'Proses Input Error', detail: "error.response.data.message", life: 3000 });
        }
    }

</script>
<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <Toast />
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
        <div v-else class="flex flex-column gap-4">
            <div class="flex-column flex gap-2 p-3 border-round border-1 border-gray-400" v-for="(item, index) in forms" :key="index">
            <!-- <div class="flex-column flex gap-2"> -->
                <div class="w-full text-md text-gray-400 font-medium flex justify-content-between font-italic"><span>TANK - {{ item.tank_name }}</span> <span>Capacity : {{ item.capacity }}</span></div>
                <div class="w-full flex lg:flex-row flex-column gap-3">
                    <!--<div class="w-full">
                        <label class="font-xs">Product Type <small class="text-red-500 font-bold">*</small></label>
                        <Dropdown v-model="item.productable_type" :options="list_type" optionLabel="name" optionValue="id" placeholder="Select a Product Type" class="w-full md:w-56" @change="listProduct()"/>
                    </div>-->
                    <div class="w-full">
                        <label class="font-xs">Product <small class="text-red-500 font-bold">*</small></label>
                        <Dropdown v-model="item.productable_id" :options="list_produk" optionLabel="name" placeholder="Select a Product" filter class="w-full md:w-56"/>
                    </div>
                    <div class="w-full">
                        <label class="font-xs">Stock MT <small class="text-red-500 font-bold">*</small></label>
                        <InputNumber v-model="item.stok_mt" class="w-full" placeholder="Stock MT" :maxFractionDigits="5" inputId="locale-german" locale="de-DE" />
                    </div>
                    <div class="w-full">
                        <label class="font-xs">Stock <small class="text-red-500 font-bold">*</small></label>
                        <InputNumber v-model="item.stok_exc_btm_mt" class="w-full" placeholder="Stock" :maxFractionDigits="5" inputId="locale-german" locale="de-DE" />
                    </div>
                    <div class="w-full">
                        <label class="font-xs">Umur <small class="text-red-500 font-bold">*</small></label>
                        <InputNumber v-model="item.umur" class="w-full" placeholder="Umur" :maxFractionDigits="0" inputId="locale-german" locale="de-DE" />
                    </div>
                </div>
                <div class="w-full">
                    <label class="font-xs">Remarks <small class="text-yellow-500 font-bold">*</small></label>
                    <InputText type="text" v-model="item.remarks" class="w-full" placeholder="Remarks"/>
                </div>
            </div>
        </div>
    </div>
</template>