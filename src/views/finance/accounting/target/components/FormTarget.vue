<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
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

    const product_type = ref(list_product_type)
    const loadingTable = ref(false)
    const forms_real = ref([{
        id: null,
        tanggal: moment().format('YYYY-MM-DD'),
        value: null,
        product_type: null,
        productable_id: null,
    }])
    const forms_rkap = ref([{
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
            forms_real.value = list
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
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
        try {
            if (status == 'add_daily') {
                const response = await TargetReal.addPost(forms.value);
                const load = response.data;
                if (load.success == true) {
                    emit('submit','add_daily_success');
                } else {
                    emit('submit','add_daily_error');
                }
            } else {
                const response = await TargetReal.updatePost(forms.value.id,forms.value);
                const load = response.data;
                if (load.success == true) {
                    emit('submit','edit_daily_success');
                } else {
                    emit('submit','edit_daily_error');
                }
            }
        } catch (error) {
            emit('submit','close');
        }
    }

</script>
<template>
    <div class="p-4 bg-white shadow-4 border-round flex flex-column gap-5">
        <div class="flex justify-content-between align-items-center gap-2">
            <span class="font-medium text-xl uppercase">Form Target</span>
            <div class="flex gap-2">
                <Button label="Back" icon="pi pi-times" size="small" class="px-3 py-2" severity="danger" outlined @click="()=>{route.query.type == 'real' ? router.push('/target?active=3') : router.push('/target?active=4')}"/>
                <Button label="Save" icon="pi pi-save" size="small" class="px-3 py-2" severity="success"/>
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
        <form v-else class="flex flex-column gap-4" @submit="postData">
            <DataTable :value="forms_real" rowGroupMode="subheader" groupRowsBy="product_type" sortMode="single" sortField="product_type" :sortOrder="1" tableStyle="min-width: 50rem">
                <Column field="product_type" header="Type"></Column>
                <template #groupheader="{data}">
                    <div class="flex align-items-center gap-2">
                        <span class="uppercase font-bold capitalize font-italic underline">{{ data.product_type }}</span>
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
                <Column field="diff" headerStyle="background-color:#28B463; color:white;">
                    <template #header>
                        <span class="text-sm font-bold uppercase">Tanggal</span>
                    </template>
                    <template #body="{data}">
                        <div class="w-full">
                            <InputText id="tanggal" v-model="data.tanggal" type="date" class="w-full" autocomplete="off" />
                        </div>
                    </template>
                </Column>
                <Column field="real" headerStyle="background-color:#28B463; color:white;">
                    <template #header>
                        <span class="text-sm font-bold uppercase">Real</span>
                    </template>
                    <template #body="{data}">
                        <div class="w-full">
                            <InputNumber id="dmo" v-model="data.value" class="w-full" placeholder="Value (Real)" :maxFractionDigits="2" />
                        </div>
                    </template>
                </Column>
                <Column field="rkap" headerStyle="background-color:#28B463; color:white;">
                    <template #header>
                        <span class="text-sm font-bold uppercase">RKAP PMG-1</span>
                    </template>
                    <template #body="{data}">
                        <div class="w-full">
                            <InputNumber id="dmo" v-model="data.value" class="w-full" placeholder="Value (RKAP)" :maxFractionDigits="2" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </form>
    </div>
</template>