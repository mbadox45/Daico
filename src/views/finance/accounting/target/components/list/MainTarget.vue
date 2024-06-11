<script setup>
    // Vue Component
    import { ref, onMounted, computed, defineProps, watch } from 'vue';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API ========================================================================================================================================================
    import {loadMainTarget} from '@/views/load_data/target.js';

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
        const loadTarget = await loadMainTarget(tgl)
        products.value = loadTarget.qty_penjualan;
        dmos.value = loadTarget.dmo;
        cpo_olah_vs_rkap.value = loadTarget.cpo_olah_vs_rkap;
        cpo_olah_vs_utility.value = loadTarget.cpo_olah_vs_utility;
        loadingTable.value = false;
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