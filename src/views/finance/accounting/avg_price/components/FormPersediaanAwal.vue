<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API
    import {list_product_type} from '@/api/DummyData.js';
    import {loadProduct, loadSubProduct, loadBulky} from '@/views/load_data/master_config.js';
    import {addAvgPrice, updateAvgPrice, forViewAvgPrice} from '@/views/load_data/avg_price.js';

    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const product_type = ref(list_product_type)
    const loadingTable = ref(false)
    const time = ref(3000)
    const tgl = ref(moment().format('YYYY-MM'))
    const forms = ref([
        { id: null, tanggal: moment().format('YYYY-MM'), qty: null, harga: null, product_type: null, productable_id: null, category:null, sub_category:null},
    ])
    const list_product_retail = ref([])
    const list_product_bulk = ref([])

    onMounted(() => {
        loadData();
    })

    const loadData = async() => {
        // console.log(route.params)
        const params = route.params.status
        if (params == 'update') {
            await updateData()
        } else {
            await addData()
        }
    }

    const updateData = async () => {
        loadingTable.value = true
        try {
            const waktu = route.query.tgl
            tgl.value = moment(waktu).format('YYYY-MM');
            const list = await listInput();
            const avg_price = await forViewAvgPrice(waktu)
            const response = avg_price.data
            // console.log(list)
            // console.log(response)
            const data = []
            for (let i = 0; i < list.length; i++) {
                const produk = response.find(item => item.category == list[i].category && item.productable_type == list[i].product_type && item.product == list[i].sub_category )
                // console.log(produk);
                data.push({
                    id: produk != null ? produk.id :null,
                    tanggal: produk != null ? produk.tanggal :null,
                    qty: produk != null ? produk.qty :null,
                    harga: produk != null ? produk.harga :null,
                    product_type: produk != null ? produk.productable_type : list[i].product_type, //bulk
                    productable_id: produk != null ? produk.productable_id : list[i].productable_id,
                    category: produk != null ? produk.category : list[i].category, //rbd olein iv 56
                    sub_category: produk != null ? produk.product : list[i].sub_category, // kemasan (minyakita)
                })
            }
            forms.value = data;
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
            forms.value = [
                { id: null, tanggal: moment().format('YYYY-MM'), qty: null, harga: null, product_type: null, productable_id: null, category:null, sub_category:null},
            ]
        }
    }

    const addData = async () => {
        loadingTable.value = true
        try {
            const list = await listInput()
            console.log(list)
            forms.value = list
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
            forms.value = [
                { id: null, tanggal: moment().format('YYYY-MM'), qty: null, harga: null, product_type: null, productable_id: null, category:null, sub_category:null},
            ]
        }
    }

    const listInput = async() => {
        const list = []
        const bulk = await loadBulky();
        for (let i = 0; i < bulk.length; i++) {
            if (bulk[i].id == 2 || bulk[i].id == 3 || bulk[i].id == 5) {
                list.push({
                    id: null,
                    tanggal: null,
                    qty: null,
                    harga: null,
                    product_type: 'bulk',
                    productable_id: bulk[i].id,
                    category: bulk[i].name,
                    sub_category: bulk[i].name,
                })
            }
        }
        const sub_product = await loadSubProduct();
        const load_sub_product = sub_product.filter(item => item.nama.toLowerCase().includes('kemasan') || item.nama.toLowerCase() === 'bulk')
        for (let i = 0; i < load_sub_product.length; i++) {
            list.push({
                id: null,
                tanggal: null,
                qty: null,
                harga: null,
                product_type: 'subproduct',
                productable_id: load_sub_product[i].id,
                category: 'RBD Olein ' + load_sub_product[i].product.nama,
                sub_category: load_sub_product[i].nama,
            })
        }
        return list
    }

    const postData = async() => {
        loadingTable.value = true
        try {
            let total = 0
            const form = forms.value
            for (let i = 0; i < form.length; i++) {
                if (form[i].qty != null && form[i].harga != null ) {
                    total += 1
                }
            }
            if (total >= form.length) {
                let berhasil = 0 , gagal = 0;
                for (let i = 0; i < form.length; i++) {
                    const list = {
                        id: form[i].id,
                        tanggal: tgl.value.toString()+'-01',
                        qty: form[i].qty,
                        harga: form[i].harga,
                        product_type: form[i].product_type,
                        productable_id: form[i].productable_id,
                    }
                    let response;
                    if (form[i].id != null ) {
                        // console.log('update')
                        response = await updateAvgPrice(form[i].id, list);
                    } else {
                        // console.log('add')
                        response = await addAvgPrice(list);
                    }
                    if (response.success == true) {
                        berhasil += 1
                    } else {
                        gagal += 1
                    }
                    // console.log(response)
                }
                if (berhasil >= form.length && gagal == 0) {
                    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Proses Input Error', detail: 'Data sudah ada', life: 3000 });
                }
                loadData();
                loadingTable.value = false
            } else {
                toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'Harap data diisi dengan lengkap.', life: 3000 });
                loadingTable.value = false
            }
        } catch (error) {
            loadingTable.value = false
            toast.add({ severity: 'error', summary: 'Proses Input Error', detail: error.response.data.message, life: 3000 });
        }
    }

</script>
<template>
    <Toast />
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-2">
            <span class="font-medium text-xl uppercase">Form Persediaan Awal <span class="">{{ route.query.type }}</span></span>
            <div class="flex gap-2">
                <Button label="Back" icon="pi pi-times" size="small" class="px-3 py-2" severity="danger" outlined @click="()=>{router.push('/avg-price')}"/>
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
        <form v-else class="flex flex-column gap-2">
            <div class="flex justify-content-end gap-1">
                <small class="font-medium">Note :</small>
                <small class="text-red-500">Apabila tidak ada nilai, bisa masukan nilai <span class="font-bold">0</span></small>
            </div>
            <div class="flex flex-column gap-3">
                <div class="flex flex-column gap-1">
                    <label for="bulan" class="font-medium text-sm text-gray-500">BULAN</label>
                    <InputText id="bulan" v-model="tgl" type="month" class="w-full" autocomplete="off" />
                </div>
                <Divider/>
                <div class="flex justify-content-between gap-5 align-items-center" v-for="(item, index) in forms" :key="index">
                    <div class="flex flex-column gap-1 w-full">
                        <label for="rbdpo" class="font-medium text-lg text-blue-600">{{item.sub_category}}</label>
                        <label for="rbdpo" class="font-medium text-xs">Category : <span class="text-gray-500 font-italic">{{item.category}}</span></label>
                    </div>
                    <div class="flex flex-column gap-1 w-full">
                        <label for="qty_rbdpo" class="font-medium text-sm text-gray-500">QTY <span class="font-bold text-red-500">*</span></label>
                        <InputNumber id="qty_rbdpo" v-model="item.qty" class="w-full" placeholder="QTY" :maxFractionDigits="5" inputId="locale-german" locale="de-DE" />
                    </div>
                    <div class="flex flex-column gap-1 w-full">
                        <label for="rp_rbdpo" class="font-medium text-sm text-gray-500">RP / KG <span class="font-bold text-red-500">*</span></label>
                        <InputNumber id="rp_rbdpo" v-model="item.harga" class="w-full" placeholder="RP / KG" :maxFractionDigits="5" inputId="locale-german" locale="de-DE" />
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>