<script setup>
    // Vue Component
    import { ref, onMounted, computed, defineProps, watch } from 'vue';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API ========================================================================================================================================================
    import { loadDataProd, loadDailyDmo, loadMonthlyDmo, loadMasterBulkProd, loadMasterRetailProd } from '@/views/finance/accounting/target/components/list/data/data_cost_prod.js';
    import TargetReal from '@/api/target/TargetReal.js';
    import TargetRkap from '@/api/target/TargetRkap.js';

    const props = defineProps({
        tanggal:{
            type:String
        }
    });

    // VARIABLE
    const loadingTable = ref(false)
    const products = ref([]);
    const dmos = ref({})
    const cpo_olah_vs_rkap = ref([]);
    const cpo_olah_vs_utility = ref([]);

    const router = useRouter();

    watch(() => props.tanggal, (newVal) => {loadData(newVal)});

    // Function ===================================================================================================================================================
    // onMounted(() => {
    //     loadData(props.tanggal)
    // });

    const loadData = async(tgl) => {
        loadingTable.value = true;
        products.value = await loadQtyPenjualan(tgl);
        dmos.value = await loadDmo(tgl);
        cpo_olah_vs_rkap.value = await loadQtyProduksiRkap(tgl);
        cpo_olah_vs_utility.value = await loadQtyProduksiUtility(tgl);
        loadingTable.value = false;
    }

    const loadQtyPenjualan = async(tgl) => {
        const list_product = []
        const bulk_master = await loadMasterBulkProd();
        for (let i = 0; i < bulk_master.length; i++) {
            list_product.push({
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
            list_product.push({
                product: retail_master[i].name,
                product_id: retail_master[i].id,
                type: 'retail',
                real: 0,
                rkap: 0,
                diff: 0,
            })
        }

        const data_target_real = await loadSumTargetReal(tgl);
        const data_target_rkap = await loadSumTargetRkap(tgl);
        if (data_target_real == null && data_target_rkap == null) {
            return list_product;
        } else {
            const list = []
            for (let i = 0; i < list_product.length; i++) {
                const real = data_target_real.find(item => item.productable == list_product[i].product && item.productable_type == list_product[i].type);
                const nilai_real = real != null ? real.totalValue : 0;
                const rkap = data_target_rkap.find(item => item.productable == list_product[i].product && item.productable_type == list_product[i].type)
                const nilai_rkap = rkap != null ? rkap.totalValue : 0;
                list[i] = {
                    product: list_product[i].product,
                    product_id: list_product[i].product_id,
                    type: list_product[i].type,
                    real: nilai_real,
                    rkap: nilai_rkap,
                    diff: 0,
                }
            }
            return list;
        }
    }

    const loadQtyProduksiRkap = async(tgl) => {
        const monthly = await loadMonthlyDmo(tgl);
        const nilai_monthly = monthly == null ? 0 : Number(monthly[0].cpo_olah_rkap);
        const real = await loadDataProd(tgl);
        const list = real.find(item => item.name == 'Refinery')
        const items = list.items;
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id_uraian == 1) {
                total += Number(items[i].value);
            } else {
                continue;
            }
        }
        const data = [
            {
                name: 'CPO Olah',
                real: total,
                rkap: nilai_monthly,
                diff: total - nilai_monthly,
                real_persen: (total / nilai_monthly)*100,
                sisa_target: (total / nilai_monthly)*100 >= 100 ? 0 : (100-((total / nilai_monthly)*100)),
            }
        ]
        return data;
    }

    const loadQtyProduksiUtility = async(tgl) => {
        const monthly = await loadMonthlyDmo(tgl);
        const nilai_monthly = monthly == null ? 0 : (Number(monthly[0].kapasitas_utility) * Number(monthly[0].pengali_kapasitas_utility));
        const real = await loadDataProd(tgl);
        const list = real.find(item => item.name == 'Refinery')
        const items = list.items;
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id_uraian == 1) {
                total += Number(items[i].value);
            } else {
                continue;
            }
        }
        const data = [
            {
                name: 'CPO Olah',
                real: total,
                rkap: nilai_monthly,
                diff: total - nilai_monthly,
                real_persen: (total / nilai_monthly)*100,
                sisa_target: (total / nilai_monthly)*100 >= 100 ? 0 : (100-((total / nilai_monthly)*100)),
            }
        ]
        return data;
    }

    const loadSumTargetReal = async(tgl) => {
        const real = await loadDataTargetReal(tgl);
        let data;
        if (real == null) {
            data = null;
        } else {
            const result = real.reduce((acc, curr) => {
                const key = `${curr.productable_id}-${curr.productable_type}`;
                if (!acc[key]) {
                    acc[key] = {
                        productable_id: curr.productable_id,
                        productable_type: curr.productable_type,
                        productable: curr.productable, // Storing the name for convenience
                        totalValue: 0
                    };
                }
                acc[key].totalValue += parseFloat(curr.value);
                return acc;
            }, {});
    
            data = Object.values(result);
        }
        

        return data;
    }

    const loadSumTargetRkap = async(tgl) => {
        const real = await loadDataTargetRkap(tgl);
        let data;
        if (real == null) {
            data = null;
        } else {
            const result = real.reduce((acc, curr) => {
                const key = `${curr.productable_id}-${curr.productable_type}`;
                if (!acc[key]) {
                    acc[key] = {
                        productable_id: curr.productable_id,
                        productable_type: curr.productable_type,
                        productable: curr.productable, // Storing the name for convenience
                        totalValue: 0
                    };
                }
                acc[key].totalValue += parseFloat(curr.value);
                return acc;
            }, {});
    
            data = Object.values(result);
        }

        return data;
    }

    const loadDataTargetReal = async(tgl) => {
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

    const loadDataTargetRkap = async(tgl) => {
        try {
            const response = await TargetRkap.getByDate({tanggal: tgl});
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

    const loadDmo = async(tgl) => {
        const monthly = await loadMonthlyDmo(tgl);
        const nilai_monthly = monthly == null ? 0 : Number(monthly[0].dmo);
        const daily = await loadDailyDmo(tgl);
        const nilai_daily = daily == null ? 0 : Number(daily);
        const total_dmo = {
            real: nilai_daily,
            rkap: nilai_monthly,
            diff: (nilai_daily - nilai_monthly),
            real_persen: ((nilai_daily/nilai_monthly)*100),
            sisa_target: (nilai_daily/nilai_monthly)*100 >= 100 ? 0 : ((1-(nilai_daily/nilai_monthly))*100),
        }
        return total_dmo;
    }

    const formatCurrency = (amount) => {
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return parts.join(',');
    }

    const calculateCustomerTotal = (name, cond) => {
        let total = 0;

        if (products.value) {
            for (let product of products.value) {
                if (name == 'all') {
                    if (cond == 'real') {
                        total = total + Number(product.real);
                    } else {
                        total = total + Number(product.rkap);
                    }
                } else {
                    if (product.type === name) {
                        if (cond == 'real') {
                            total = total + Number(product.real);
                        } else {
                            total = total + Number(product.rkap);
                        }
                    } else {
                        continue;
                    }
                }
            }
        }

        return total;
    };

</script>

<template>
    <div class="flex flex-column gap-3">
        <!-- Table -->
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <div v-else class="flex flex-column gap-5">
            <div class="w-full flex flex-column gap-2">
                <div class="flex justify-content-between">
                    <span class="font-medium font-italic text-sm">Qty Penjualan</span>
                    <span class="font-medium font-italic text-sm">% tage to Target</span>
                </div>
                <DataTable :value="products" rowGroupMode="subheader" groupRowsBy="type" sortMode="single" sortField="type" :sortOrder="1" tableStyle="min-width: 50rem">
                    <Column field="type" header="Type"></Column>
                    <Column field="product" headerStyle="background-color:#28B463; color:white; width:20%;">
                        <template #header>
                            <span class="text-sm font-bold">Product</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium w-full">{{data.product}}</span>
                        </template>
                    </Column>
                    <Column field="real" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Real</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-end">{{data.real == 0 ? null : formatCurrency(Number(data.real).toFixed(2))}}</span>
                        </template>
                    </Column>
                    <Column field="rkap" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">RKAP PMG-1</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-end">{{data.rkap == 0 ? null : formatCurrency(Number(data.rkap).toFixed(2))}}</span>
                        </template>
                    </Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Diff</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium w-full flex justify-content-end">{{data.real == 0 && data.rkap == 0 ? '-' : formatCurrency((Number(data.real)-Number(data.rkap)).toFixed(2))}}</span>
                        </template>
                    </Column>
                    <Column field="test" headerStyle="background-color:white; width:5%;"></Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <div class="flex justify-content-center w-full">
                                <span class="text-sm font-bold uppercase">real</span>
                            </div>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-center">{{data.diff == 0 ? null : 0}}</span>
                        </template>
                    </Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <div class="flex justify-content-center w-full">
                                <span class="text-sm font-bold uppercase">sisa target</span>
                            </div>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-center">{{data.diff == 0 ? null : 0}}</span>
                        </template>
                    </Column>
                    <template #groupheader="{data}">
                        <div class="flex align-items-center gap-2">
                            <span class="uppercase font-bold capitalize font-italic underline">{{ data.type }}</span>
                        </div>
                    </template>
                    <ColumnGroup type="footer" style="background-color: transparent;">
                        <Row>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-sm">Total DMO</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-end">{{formatCurrency(Number(dmos.real).toFixed(2))}}</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-end">{{formatCurrency(Number(dmos.rkap).toFixed(2))}}</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-end">{{formatCurrency(Number(dmos.diff).toFixed(2))}}</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-end"></small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-center">{{formatCurrency(Number(dmos.real_persen).toFixed(2))}}%</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-center">{{formatCurrency(Number(dmos.sisa_target).toFixed(2))}}%</small>
                                </template>
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                <template #footer>
                                    <small class="font-bold uppercase text-sm">Total Penjualan</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-end">{{formatCurrency((calculateCustomerTotal('all', 'real') + Number(dmos.real)).toFixed(2))}}</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-end">{{formatCurrency((calculateCustomerTotal('all', 'rkap') + Number(dmos.rkap)).toFixed(2))}}</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-end">{{formatCurrency(((calculateCustomerTotal('all', 'real') + Number(dmos.real))-(calculateCustomerTotal('all', 'rkap') + Number(dmos.rkap))).toFixed(2))}}</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-end"></small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-center">{{formatCurrency(((calculateCustomerTotal('all', 'real') + Number(dmos.real))/(calculateCustomerTotal('all', 'rkap') + Number(dmos.rkap))*100).toFixed(2))}}%</small>
                                </template>
                            </Column>
                            <Column>
                                <template #footer>
                                    <small class="font-bold capitalize text-xs flex justify-content-center">{{(calculateCustomerTotal('all', 'real') + Number(dmos.real))/(calculateCustomerTotal('all', 'rkap') + Number(dmos.rkap))*100 >= 100 ? 0 : formatCurrency((100-((calculateCustomerTotal('all', 'real') + Number(dmos.real))/(calculateCustomerTotal('all', 'rkap') + Number(dmos.rkap))*100)).toFixed(2))}}%</small>
                                </template>
                            </Column>
                        </Row>
                    </ColumnGroup>
                    <template #groupfooter="{data}">
                        <table class="w-full">
                            <thead>
                                <tr>
                                    <th class="capitalize font-italic text-sm" style="width: 19%;">Total {{ data.type }}</th>
                                    <th class="text-right text-xs pr-3" style="width: 15.5%;">{{ formatCurrency(calculateCustomerTotal(data.type, 'real').toFixed(2)) }}</th>
                                    <th class="text-right text-xs pr-3" style="width: 15.5%;">{{ formatCurrency(calculateCustomerTotal(data.type, 'rkap').toFixed(2)) }}</th>
                                    <th class="text-right text-xs pr-3" style="width: 15.5%;">{{ formatCurrency((calculateCustomerTotal(data.type, 'real') - calculateCustomerTotal(data.type, 'rkap')).toFixed(2)) }}</th>
                                    <th class="text-right text-xs pr-3" style="width: 5.5%;"></th>
                                    <th class="text-center text-xs pr-3" style="width: 15.5%;">{{ formatCurrency(((calculateCustomerTotal(data.type, 'real') / calculateCustomerTotal(data.type, 'rkap'))*100).toFixed(2)) + '%' }}</th>
                                    <th class="text-center text-xs pl-2" style="width: 17%;">{{ (calculateCustomerTotal(data.type, 'real') / calculateCustomerTotal(data.type, 'rkap'))*100 >= 100 ? '0%' : formatCurrency((100 - ((calculateCustomerTotal(data.type, 'real') / calculateCustomerTotal(data.type, 'rkap'))*100)).toFixed(2)) }}</th>
                                </tr>
                            </thead>
                        </table>
                    </template>
                </DataTable>
            </div>
            <!-- RKAP -->
            <div class="w-full flex flex-column gap-2">
                <div class="flex justify-content-between">
                    <span class="font-medium font-italic text-sm">Qty Produksi (VS RKAP)</span>
                    <span class="font-medium font-italic text-sm">% tage to Target</span>
                </div>
                <DataTable :value="cpo_olah_vs_rkap" tableStyle="min-width: 50rem">
                    <Column field="product" headerStyle="background-color:#28B463; color:white; width:20%;">
                        <template #header>
                            <span class="text-sm font-bold">Product</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-sm font-bold w-full font-italic">{{data.name}}</span>
                        </template>
                    </Column>
                    <Column field="real" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Real</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-end">{{data.real == 0 ? null : formatCurrency(Number(data.real).toFixed(2))}}</span>
                        </template>
                    </Column>
                    <Column field="rkap" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">RKAP PMG-1</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-end">{{data.rkap == 0 ? null : formatCurrency(Number(data.rkap).toFixed(2))}}</span>
                        </template>
                    </Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Diff</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium w-full flex justify-content-end">{{data.real == 0 && data.rkap == 0 ? '-' : Number(data.real)-Number(data.rkap) < 0 ? '('+formatCurrency(((Number(data.real)-Number(data.rkap))*(-1)).toFixed(2))+')' : formatCurrency((Number(data.real)-Number(data.rkap)).toFixed(2))}}</span>
                        </template>
                    </Column>
                    <Column field="test" headerStyle="background-color:white; width:5%;"></Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <div class="flex justify-content-center w-full">
                                <span class="text-sm font-bold uppercase">real</span>
                            </div>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-center">{{formatCurrency(Number(data.real_persen).toFixed(2))}}%</span>
                        </template>
                    </Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <div class="flex justify-content-center w-full">
                                <span class="text-sm font-bold uppercase">sisa target</span>
                            </div>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-center">{{formatCurrency(Number(data.sisa_target).toFixed(2))}}%</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
            <!-- Utility -->
            <div class="w-full flex flex-column gap-2">
                <div class="flex justify-content-between">
                    <span class="font-medium font-italic text-sm">Qty Produksi (VS Utility)</span>
                    <span class="font-medium font-italic text-sm">% tage to Target</span>
                </div>
                <DataTable :value="cpo_olah_vs_utility" tableStyle="min-width: 50rem">
                    <Column field="product" headerStyle="background-color:#28B463; color:white; width:20%;">
                        <template #header>
                            <span class="text-sm font-bold">Product</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-sm font-bold w-full font-italic">{{data.name}}</span>
                        </template>
                    </Column>
                    <Column field="real" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Real</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-end">{{data.real == 0 ? null : formatCurrency(Number(data.real).toFixed(2))}}</span>
                        </template>
                    </Column>
                    <Column field="rkap" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Kap. Terpasang</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-end">{{data.rkap == 0 ? null : formatCurrency(Number(data.rkap).toFixed(2))}}</span>
                        </template>
                    </Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <span class="text-sm font-bold uppercase">Diff</span>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium w-full flex justify-content-end">{{data.real == 0 && data.rkap == 0 ? '-' : Number(data.real)-Number(data.rkap) < 0 ? '('+formatCurrency(((Number(data.real)-Number(data.rkap))*(-1)).toFixed(2))+')' : formatCurrency((Number(data.real)-Number(data.rkap)).toFixed(2))}}</span>
                        </template>
                    </Column>
                    <Column field="test" headerStyle="background-color:white; width:5%;"></Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <div class="flex justify-content-center w-full">
                                <span class="text-sm font-bold uppercase">real</span>
                            </div>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-center">{{formatCurrency(Number(data.real_persen).toFixed(2))}}%</span>
                        </template>
                    </Column>
                    <Column field="diff" headerStyle="background-color:#28B463; color:white; width:15%;">
                        <template #header>
                            <div class="flex justify-content-center w-full">
                                <span class="text-sm font-bold uppercase">sisa target</span>
                            </div>
                        </template>
                        <template #body="{data}">
                            <span class="text-xs font-medium flex justify-content-center">{{formatCurrency(Number(data.sisa_target).toFixed(2))}}%</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>