<script setup>
    // Vue Component
    import { ref, onMounted, computed, defineProps, watch } from 'vue';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API ========================================================================================================================================================
    import { getTitleModal } from '@/api/DummyData.js'
    import ProductService from '@/service/ProductService';
    import DailyDmoAPI from '@/api/target/DailyDmo.js';
    import MonthlyDmoAPI from '@/api/target/MonthlyDmo.js';
    import TargetReal from '@/api/target/TargetReal.js';
    import TargetRkap from '@/api/target/TargetRkap.js';
    import BulkyProdMaster from '@/api/master/BulkyProdMaster.js';
    import RetailProdMaster from '@/api/master/RetailProdMaster.js';

    const props = defineProps({
        tanggal:{
            type:String
        }
    });

    // VARIABLE
    const products = ref();
    const products_cpo_olah = ref();

    const router = useRouter();

    const menu_add = ref([
        { label: 'Daily', command: () => { formDatabase('add_daily', null) } },
        { label: 'Monthly', command: () => { formDatabase('add_monthly', null) } },
        { label: 'Target', command: () => { router.push('/form-target') } },
    ])

    watch(() => props.tanggal, (newVal) => {loadData(newVal)});

    // Function ===================================================================================================================================================
    // onMounted(() => {
    //     loadData(props.tanggal)
    // });

    const loadData = async(tgl) => {
        products.value = []
        products_cpo_olah.value = []
        const bulk_master = await loadMasterBulkProd();
        for (let i = 0; i < bulk_master.length; i++) {
            products.value.push({
                product: bulk_master[i].name,
                product_id: bulk_master[i].id,
                type: 'bulk',
                real: 0,
                rkap: 0,
                diff: 0,
            })
        }
        const retail_master = await loadMasterRetailProd();
        for (let i = 0; i < retail_master.length; i++) {
            products.value.push({
                product: retail_master[i].name,
                product_id: retail_master[i].id,
                type: 'retail',
                real: 0,
                rkap: 0,
                diff: 0,
            })
        }
        products_cpo_olah.value.push({
            product: 'CPO Olah',
            real: 0,
            rkap: 0,
            diff: 0,
        })

        console.log(products.value)
        const data_target = await loadDataTarget(tgl);
        console.log(data_target)
        console.log(tgl)

        // const dailyDMO = await loadDailyDmo(tgl);
        // console.log(dailyDMO)

        // const monthlyDMO = await loadMonthlyDmo(tgl);
        // console.log(monthlyDMO)
    }

    const loadDataTarget = async(tgl) => {
        try {
            const response = await TargetReal.getByDate({tanggal: tgl});
            const load = response.data;
            const data = load.data;
            const list = [];
            for (let a = 0; a < data.length; a++) {
                const type = data[a].productable_type.split('\\').pop();

                list[a] = {
                    id:data[a].id,
                    tanggal:data[a].tanggal,
                    value:data[a].value,
                    productable_id:data[a].productable_id,
                    productable_type:type == 'MasterBulkProduksi' ? 'bulk' : 'retail',
                    productable:data[a].productable != null ? data[a].productable.name : null,
                };
            }
            return list;
        } catch (error) {
            return null;
        }
    }

    const loadMasterBulkProd = async() => {
        try {
            const response = await BulkyProdMaster.getAll();
            const load = response.data;
            const data = load.mBulky
            return data;
        } catch (error) {
            return null;
        }
    }

    const loadMasterRetailProd = async() => {
        try {
            const response = await RetailProdMaster.getAll();
            const load = response.data;
            const data = load.mBulky
            return data;
        } catch (error) {
            return null;
        }
    }

    const loadDailyDmo = async(tgl) => {
        try {
            const response = await DailyDmoAPI.getByDate({tanggal:tgl});
            const load = response.data;
            const data = load.data
            return data;
        } catch (error) {
            return null;
        }
    }

    const loadMonthlyDmo = async(tgl) => {
        try {
            const response = await MonthlyDmoAPI.getByDate({tanggal:tgl});
            const load = response.data;
            const data = load.data
            return data;
        } catch (error) {
            return null;
        }
    }
</script>

<template>
    <div class="flex flex-column gap-3">
        <!-- Table -->
        <div class="flex gap-3">
            <div class="w-full flex flex-column gap-2">
                <div class="flex justify-content-between">
                    <span class="font-medium font-italic text-sm">Qty Penjualan</span>
                    <span class="font-medium font-italic text-sm">% tage to Target</span>
                </div>
                <!-- <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Product</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in products" :key="index">
                            <td>{{ data.type }}</td>
                            <td>{{ data.product }}</td>
                        </tr>
                    </tbody>
                </table> -->
                <DataTable :value="products" rowGroupMode="subheader" groupRowsBy="type" sortMode="single" sortField="type" :sortOrder="1" tableStyle="min-width: 50rem">
                    <Column field="type" header="Type"></Column>
                    <Column field="product" class="w-min-h" headerStyle="background-color:#28B463; color:white;">
                        <template #header>
                            <span class="text-sm font-bold">Product</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium w-full">{{data.product}}</span>
                        </template>
                    </Column>
                    <Column field="real" headerStyle="background-color:#28B463; color:white;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Real</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium w-full flex justify-content-end">{{data.real}}</span>
                        </template>
                    </Column>
                    <Column field="rkap" headerStyle="background-color:#28B463; color:white;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">RKAP PMG-1</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium w-full flex justify-content-end">{{data.rkap}}</span>
                        </template>
                    </Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Diff</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium w-full flex justify-content-end">{{data.diff}}</span>
                        </template>
                    </Column>
                    <Column field="test" headerStyle="background-color:white;"></Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white;">
                        <template #header>
                            <div class="flex justify-content-center w-full">
                                <span class="text-sm font-bold uppercase">real</span>
                            </div>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-center">{{data.diff}}</span>
                        </template>
                    </Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white;">
                        <template #header>
                            <div class="flex justify-content-center w-full">
                                <span class="text-sm font-bold uppercase">sisa target</span>
                            </div>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-center">{{data.diff}}</span>
                        </template>
                    </Column>
                    <template #groupheader="{data}">
                        <div class="flex align-items-center gap-2">
                            <span class="uppercase font-bold capitalize font-italic underline">{{ data.type }}</span>
                        </div>
                    </template>
                    <!-- <ColumnGroup type="groupfooter">
                        <Row>
                            <Column>
                                <template #footer>
                                    <small class="font-medium uppercase">Period</small>
                                </template>
                            </Column>
                        </Row>
                    </ColumnGroup> -->
                    <!-- <template #groupfooter="{data}">
                        <div class="flex justify-content-start align-items-center gap-2 font-bold  w-full">
                            <span class="w-full capitalize font-italic">Total {{ data.type }}</span>
                            <span class="w-full text-right text-xs">{{ data.diff }}</span>
                            <span class="w-full text-right text-xs">{{ data.diff }}</span>
                            <span class="w-full text-right text-xs">{{ data.diff }}</span>
                            <span class="w-3 text-center text-xs"></span>
                            <span class="w-full text-center text-xs">{{ data.diff }}</span>
                            <span class="w-full text-center text-xs">{{ data.diff }}</span>
                        </div>
                    </template> -->
                </DataTable>
            </div>
        </div>

    </div>
</template>