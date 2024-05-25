<script setup>
    // Vue Component
    import { ref, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
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

    // Components
    import TargetRealRkap from '@/views/finance/accounting/target/components/TargetRealRkap.vue';
    import DailyDmo from '@/views/finance/accounting/target/components/DailyDmo.vue';
    import MonthlyDmo from '@/views/finance/accounting/target/components/MonthlyDmo.vue';

    // VARIABLE
    const layout = ref('list');
    const expandedRowGroups = ref();
    const total_biaya_produksi = ref();
    const total_cpo_olah = ref();
    const products = ref();
    const products_cpo_olah = ref();
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const list_tahun = ref([]);
    const tanggal = ref(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`)
    const op = ref();
    
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const title_dialog = ref('');

    const router = useRouter();

    const menu_add = ref([
        { label: 'Daily', command: () => { formDatabase('add_daily', null) } },
        { label: 'Monthly', command: () => { formDatabase('add_monthly', null) } },
        { label: 'Target', command: () => { router.push('/form-target') } },
    ])



    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadBulan = () => {
        list_bulan.value = []
        if (tahun.value >= Number(moment().format('yyyy'))) {
            const month = Number(moment().format('M'))
            for (let i = 1; i <= month; i++) {
                const dateString = `2024-${i.toString().padStart(2, '0')}-01`;
                const monthName = moment(dateString, 'YYYY-MM-DD').format('MMMM');
                list_bulan.value.push({ id: i, name: monthName });
            }
        } else {
            for (let i = 1; i <= 12; i++) {
                const dateString = `2024-${i.toString().padStart(2, '0')}-01`;
                const monthName = moment(dateString, 'YYYY-MM-DD').format('MMMM');
                list_bulan.value.push({ id: i, name: monthName });
            }
        }
    }

    const loadTahun = () => {
        const year = Number(moment().format('yyyy'))
        list_tahun.value = []
        for (let i = 2020; i <= year; i++) {
            list_tahun.value.push({ id: i, name: i });
        }
    }

    const loadData = async() => {
        products.value = []
        products_cpo_olah.value = []
        // let tot_biaya_produksi = 0;
        // let tot_cpo_olah = 0;
        // for (let i = 0; i < target.length; i++) {
        //     const item = target[i].items; 
        //     const items = []
        //     for (let a = 0; a < item.length; a++) {
        //         items.push({
        //             type: item[a].type,
        //             diff: item[a].diff,
        //             real: item[a].real < 1 ? '' : formatCurrency(item[a].real.toFixed(2)),
        //             rkap: item[a].rkap < 1 ? '' : formatCurrency(item[a].rkap.toFixed(2)),
        //             diff_n: (item[a].real - item[a].rkap) < 0 ? `(${formatCurrency(((item[a].real - item[a].rkap)*-1).toFixed(0))})` : (item[a].real - item[a].rkap) == 0 ? '-': formatCurrency((item[a].real - item[a].rkap).toFixed(0)),
        //             diff_r: (item[a].real - item[a].rkap) < 0 ? ((item[a].real - item[a].rkap)) : (item[a].real - item[a].rkap) == 0 ? 0: (item[a].real - item[a].rkap),
        //             real_r: item[a].real,
        //             rkap_r: item[a].rkap,
        //         })
        //     }
        //     products.value.push({
        //         qty: target[i].qty,
        //         items: items,
        //     });
        // }
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
        const dailyDMO = await loadDailyDmo();
        console.log(dailyDMO)

        const monthlyDMO = await loadMonthlyDmo();
        console.log(monthlyDMO)
        loadTahun();
        loadBulan();
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

    const loadDailyDmo = async() => {
        try {
            const response = await DailyDmoAPI.getByDate({tanggal:tanggal.value});
            const load = response.data;
            const data = load.data
            return data;
        } catch (error) {
            return null;
        }
    }

    const loadMonthlyDmo = async() => {
        try {
            const response = await MonthlyDmoAPI.getByDate({tanggal:tanggal.value});
            const load = response.data;
            const data = load.data
            return data;
        } catch (error) {
            return null;
        }
    }

    const formDatabase = (cond, data) => {
        visible.value = true
        status_form.value = cond;
        title_dialog.value = getTitleModal(cond);
    }

    const opByPeriod = (event) => {
        op.value.toggle(event);
    }

    const loadByPeriod = () => {
        op.value.toggle();
    }

    const calculateCustomerTotal = (name, type) => {
        let total = 0;

        const filteredBulkItems = products.value.flatMap(entry => {
            // Filter the items array for each entry where type is "Bulk"
            const bulkItems = entry.items.filter(item => item.type === name);
            let count = 0;
            for (let i = 0; i < bulkItems.length; i++) {
                if (type == 'real') {
                    count = count + bulkItems[i].real_r;
                } else if (type == 'diff') {
                    count = count + bulkItems[i].diff_r;
                } else {
                    count = count + bulkItems[i].rkap_r;
                }
            }
            return count
        });

        return total = formatCurrency(filteredBulkItems[0].toFixed(0));
        // console.log(filteredBulkItems)
    };

    function formatCurrency(amount) {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return parts.join(',');
    }

    const postData = (ket) => {
        console.log(ket)
        visible.value = false;
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
                    <template #groupfooter="{data}">
                        <div class="flex justify-content-start align-items-center gap-2 font-bold  w-full">
                            <span class="w-full capitalize font-italic">Total {{ data.type }}</span>
                            <span class="w-full text-right text-xs">{{ data.diff }}</span>
                            <span class="w-full text-right text-xs">{{ data.diff }}</span>
                            <span class="w-full text-right text-xs">{{ data.diff }}</span>
                            <span class="w-3 text-center text-xs"></span>
                            <span class="w-full text-center text-xs">{{ data.diff }}</span>
                            <span class="w-full text-center text-xs">{{ data.diff }}</span>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- Table -->
        <span class="font-medium font-italic mt-5 text-sm">Qty Produksi (VS RKAP)</span>
        <DataTable :value="products_cpo_olah" tableStyle="min-width: 50rem">
            <Column field="product" headerStyle="background-color:#28B463; color:white;">
                <template #header>
                    <span class="text-sm font-bold">Product</span>
                </template>
                <template #body="{data}">
                    <span class="text-xs font-medium">{{data.product}}</span>
                </template>
            </Column>
            <Column field="real" headerStyle="background-color:#28B463; color:white">
                <template #header>
                    <span class="text-sm font-bold">Real</span>
                </template>
                <template #body="{data}">
                    <span class="text-xs font-medium">{{data.real}}</span>
                </template>
            </Column>
            <Column field="rkap" headerStyle="background-color:#28B463; color:white">
                <template #header>
                    <span class="text-sm font-bold">RKAP PMG-1</span>
                </template>
                <template #body="{data}">
                    <span class="text-xs font-medium">{{data.rkap}}</span>
                </template>
            </Column>
            <Column field="diff" headerStyle="background-color:#28B463; color:white">
                <template #header>
                    <span class="text-sm font-bold">Diff</span>
                </template>
                <template #body="{data}">
                    <span class="text-xs font-medium">{{data.diff}}</span>
                </template>
            </Column>
            <template #footer> In total there are {{ products_cpo_olah ? products_cpo_olah.length : 0 }} products. </template>
        </DataTable>

        <span class="font-medium font-italic mt-5 text-sm">Qty Produksi (VS Utility)</span>
        <DataTable :value="products_cpo_olah" tableStyle="min-width: 50rem">
            <Column field="product" headerStyle="background-color:#28B463; color:white;">
                <template #header>
                    <span class="text-sm font-bold">Product</span>
                </template>
                <template #body="{data}">
                    <span class="text-xs font-medium">{{data.product}}</span>
                </template>
            </Column>
            <Column field="real" headerStyle="background-color:#28B463; color:white">
                <template #header>
                    <span class="text-sm font-bold">Real</span>
                </template>
                <template #body="{data}">
                    <span class="text-xs font-medium">{{data.real}}</span>
                </template>
            </Column>
            <Column field="rkap" headerStyle="background-color:#28B463; color:white">
                <template #header>
                    <span class="text-sm font-bold">RKAP PMG-1</span>
                </template>
                <template #body="{data}">
                    <span class="text-xs font-medium">{{data.rkap}}</span>
                </template>
            </Column>
            <Column field="diff" headerStyle="background-color:#28B463; color:white">
                <template #header>
                    <span class="text-sm font-bold">Diff</span>
                </template>
                <template #body="{data}">
                    <span class="text-xs font-medium">{{data.diff}}</span>
                </template>
            </Column>
            <template #footer> In total there are {{ products_cpo_olah ? products_cpo_olah.length : 0 }} products. </template>
        </DataTable>
    </div>
</template>