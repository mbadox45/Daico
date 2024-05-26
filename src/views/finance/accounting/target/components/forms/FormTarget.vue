<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API
    import {list_product_type} from '@/api/DummyData.js';
    import TargetReal from '@/api/target/TargetReal.js';
    import TargetRkap from '@/api/target/TargetRkap.js';
    import BulkyProdMaster from '@/api/master/BulkyProdMaster.js';
    import RetailProdMaster from '@/api/master/RetailProdMaster.js';

    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const product_type = ref(list_product_type)
    const loadingTable = ref(false)
    const time = ref(3000)
    const forms = ref([{
        id: null,
        tanggal: moment().format('YYYY-MM-DD'),
        value: null,
        product_type: null,
        productable_id: null,
    }])
    const list_product_retail = ref([])
    const list_product_bulk = ref([])

    onMounted(() => {
        loadData();
    })

    const loadData = async() => {
        loadingTable.value = true
        try {
            const real = await loadTargetReal()
            console.log(real)

            const retail = await loadRetailProd();
            list_product_retail.value = retail;
    
            const bulk = await loadBulkProd();
            list_product_bulk.value = bulk;
            
            const list = [];
            // Retail Looping
            for (let i = 0; i < retail.length; i++) {
                list.push ({
                    id: null,
                    tanggal: moment().format('YYYY-MM-DD'),
                    value: null,
                    product_type: 'retail',
                    productable_id: retail[i].id,
                })
            }
            // Bulk Looping
            for (let i = 0; i < bulk.length; i++) {
                list.push ({
                    id: null,
                    tanggal: moment().format('YYYY-MM-DD'),
                    value: null,
                    product_type: 'bulk',
                    productable_id: bulk[i].id,
                })
            }
            forms.value = list
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
            forms.value = [{
                id: null,
                tanggal: moment().format('YYYY-MM-DD'),
                value: null,
                product_type: null,
                productable_id: null,
            }]
        }
    }

    // Function
    const loadProduct = async() => {
        forms_real.value.product_type
        if (forms_real.value.product_type == 'bulk') {
            // const response = await 
        } else {
            
        }
    }

    const loadTargetReal = async() => {
        try {
            const response = await TargetReal.getByDate({tanggal: moment().format('YYYY-MM-DD')})
            const load = response.data;
            const data = load.data
            return data;
        } catch (error) {
            return null;
        }
    }

    const loadRetailProd = async() => {
        try {
            const response = await RetailProdMaster.getAll()
            const load = response.data;
            const data = load.mBulky
            return data;
        } catch (error) {
            return null;
        }

    }

    const loadBulkProd = async() => {
        try {
            const response = await BulkyProdMaster.getAll()
            const load = response.data;
            const data = load.mBulky
            return data;
        } catch (error) {
            return null;
        }

    }

    const postData = async() => {
        loadingTable.value = true
        try {
            const form = forms.value
            let count_value = 0;
            for (let i = 0; i < form.length; i++) {
                if (form[i].value == null) {
                    continue;
                }
                count_value = count_value + 1;
            }
            if (count_value >= form.length) {
                // status = 'bisa di simpan';
                if (route.query.type == 'real') {
                    for (let i = 0; i < form.length; i++) {
                        const response = await TargetReal.addPost(form[i]);
                        const load = response.data;
                        console.log(load)
                    }
                    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
                    setTimeout(function() {
                        router.push('/target?active=3')
                    }, time.value);
                } else {
                    for (let i = 0; i < form.length; i++) {
                        const response = await TargetRkap.addPost(form[i]);
                        const load = response.data;
                        console.log(load)
                    }
                    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
                    setTimeout(function() {
                        router.push('/target?active=4')
                    }, time.value);
                }
                loadingTable.value = false
            } else {
                loadingTable.value = false
                toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'Harap data diisi dengan lengkap.', life: 3000 });
            }
        } catch (error) {
            console.log(error)
            loadingTable.value = false
            toast.add({ severity: 'error', summary: 'Proses Input Error', detail: error.response.data.message, life: 3000 });
            if (route.query.type == 'real') {
                setTimeout(function() {
                    router.push('/target?active=3')
                }, time.value);
            } else {
                setTimeout(function() {
                    router.push('/target?active=4')
                }, time.value);
            }
        }
    }

</script>
<template>
    <div>
        <Toast />
        <div class="p-4 bg-white shadow-4 border-round flex flex-column gap-5">
            <div class="flex justify-content-between align-items-center gap-2">
                <span class="font-medium text-xl uppercase">Form Target <span class="">{{ route.query.type }}</span></span>
                <div class="flex gap-2">
                    <Button label="Back" icon="pi pi-times" size="small" class="px-3 py-2" severity="danger" outlined @click="()=>{route.query.type == 'real' ? router.push('/target?active=3') : router.push('/target?active=4')}"/>
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
                <DataTable :value="forms" rowGroupMode="subheader" groupRowsBy="product_type" sortMode="single" sortField="product_type" :sortOrder="1" tableStyle="min-width: 50rem">
                    <Column field="product_type" header="Type"></Column>
                    <template #groupheader="{data}">
                        <div class="flex align-items-center justify-content-between gap-2">
                            <span class="uppercase font-bold capitalize font-italic underline w-full">{{ data.product_type }}</span>
                            <div class="p-inputgroup">
                                <span class="p-inputgroup-addon bg-white">
                                    Tanggal
                                </span>
                                <InputText id="tanggal" v-model="data.tanggal" type="date" class="w-full" autocomplete="off" />
                            </div>
                        </div>
                    </template>
                    <Column field="product" class="w-min-h" headerStyle="background-color:#28B463; color:white;">
                        <template #header>
                            <span class="text-sm font-bold">Product</span>
                        </template>
                        <template #body="{data}">
                            <div class="w-full">
                                <Dropdown v-if="data.product_type == 'retail'" v-model="data.productable_id" :options="list_product_retail" optionLabel="name" optionValue="id" placeholder="Select a Product" class="w-full" disabled/>
                                <Dropdown v-else v-model="data.productable_id" :options="list_product_bulk" optionLabel="name" optionValue="id" placeholder="Select a Product" class="w-full" disabled/>
                            </div>
                        </template>
                    </Column>
                    <!-- <Column field="diff" headerStyle="background-color:#28B463; color:white;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Tanggal</span>
                        </template>
                        <template #body="{data}">
                            <div class="w-full">
                                <InputText id="tanggal" v-model="data.tanggal" type="date" class="w-full" autocomplete="off" />
                            </div>
                        </template>
                    </Column> -->
                    <Column field="real" headerStyle="background-color:#28B463; color:white;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Value</span>
                        </template>
                        <template #body="{data}">
                            <div class="w-full">
                                <InputNumber id="dmo" v-model="data.value" class="w-full" placeholder="Value" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </form>
        </div>
    </div>
</template>