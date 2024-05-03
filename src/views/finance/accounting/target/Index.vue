<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {target} from '@/api/dummy/target.js'
    import ProductService from '@/service/ProductService';

    // VARIABLE
    const layout = ref('list');
    const expandedRowGroups = ref();
    const products = ref();
    const total_biaya_produksi = ref();
    const total_cpo_olah = ref();
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const list_tahun = ref([]);
    const op = ref();
    
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const title_dialog = ref('');


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
        let tot_biaya_produksi = 0;
        let tot_cpo_olah = 0;
        for (let i = 0; i < target.length; i++) {
            // tot_biaya_produksi = tot_biaya_produksi + target[i].real;
            // tot_cpo_olah = tot_cpo_olah + target[i].rkap;
            const item = target[i].items; 
            const items = []
            for (let a = 0; a < item.length; a++) {
                items.push({
                    type: item[a].type,
                    diff: item[a].diff,
                    real: item[a].real < 1 ? '' : formatCurrency(item[a].real.toFixed(2)),
                    rkap: item[a].rkap < 1 ? '' : formatCurrency(item[a].rkap.toFixed(2)),
                    diff_n: (item[a].real - item[a].rkap) < 0 ? `(${formatCurrency(((item[a].real - item[a].rkap)*-1).toFixed(0))})` : (item[a].real - item[a].rkap) == 0 ? '-': formatCurrency((item[a].real - item[a].rkap).toFixed(0)),
                    diff_r: (item[a].real - item[a].rkap) < 0 ? ((item[a].real - item[a].rkap)) : (item[a].real - item[a].rkap) == 0 ? 0: (item[a].real - item[a].rkap),
                    real_r: item[a].real,
                    rkap_r: item[a].rkap,
                })
            }
            products.value.push({
                qty: target[i].qty,
                items: items,
            });
        }
        console.log(products.value)
        loadTahun();
        loadBulan();
    }

    const formDatabase = (cond, data) => {
        visible.value = true
        status_form.value = cond;
        title_dialog.value = cond == 'add' ? 'Tambah Data' : cond == 'edit' ? 'Edit Data' : 'Hapus Data' ;
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
</script>

<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-3 flex gap-2">
                <Button icon="pi pi-plus" severity="info" size="small" @click="formDatabase('add', null)"/>
                <Button label="Select by Period" outlined severity="secondary" size="small" @click="opByPeriod"/>
                <OverlayPanel ref="op" :style="{ width: '25rem' }">
                    <div class="flex flex-column gap-3">
                        <span class="font-light text-sm">Please select a period</span>
                        <div class="p-inputgroup p-fluid">
                            <span class="p-inputgroup-addon bg-white">
                                <i class="pi pi-calendar"></i>
                            </span>
                            <Dropdown v-model="tahun" :options="list_tahun" optionLabel="name" optionValue="id" placeholder="Tahun" @change="loadBulan" checkmark :highlightOnSelect="false" class="w-full" />
                            <Dropdown v-model="bulan" :options="list_bulan" optionLabel="name" optionValue="id" placeholder="Bulan" checkmark :highlightOnSelect="false" class="w-full" />
                        </div>
                        <Button icon="pi pi-check" label="Submit" severity="success" class="w-auto" @click="loadByPeriod"/>
                    </div>
                </OverlayPanel>
            </div>
            <div class="w-4">
            </div>
            <div class="w-3">
                <div class="p-inputgroup p-fluid">
                    <span class="p-inputgroup-addon bg-white">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText v-model="filters['global'].value" placeholder="Search"/>
                </div>
            </div>
        </div>

        <!-- Table -->

        <DataTable :value="products" rowGroupMode="subheader" groupRowsBy="qty" sortMode="single" sortField="qty" :sortOrder="1" tableStyle="min-width: 50rem">
            <Column field="qty" style="min-width: 200px;">
                <!-- <template #header>
                    <div class="bg-green-500 text-white w-full border-round p-3 uppercase">
                        <span>product</span>
                    </div>
                </template> -->
            </Column>
            <template #groupheader="slotProps">
                <div class="flex flex-column gap-2 my-4">
                    <span class="vertical-align-text-top font-bold line-height-3 uppercase text-xl font-italic">{{ slotProps.data.qty }}</span>
                    <DataTable :value="slotProps.data.items" rowGroupMode="subheader" groupRowsBy="type" sortMode="single" sortField="type" :sortOrder="1" tableStyle="min-width: 50rem">
                        <Column field="type" style="width: 130px;"></Column>
                        <Column field="diff">
                            <template #header>
                                <div class="uppercase">
                                    <span>Product</span>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="flex w-full">
                                    <span class="text-sm font-bold text-gray-500">{{data.diff}}</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="real" style="min-width: 200px">
                            <template #header>
                                <div class="flex w-full justify-content-end uppercase">
                                    <span>real</span>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="flex w-full justify-content-end">
                                    <span class="text-sm font-bold">{{data.real}}</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="rkap" style="min-width: 200px">
                            <template #header>
                                <div class="flex w-full justify-content-end uppercase">
                                    <span>rkap</span>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="flex w-full justify-content-end">
                                    <span class="text-sm font-bold">{{data.rkap}}</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="diff_n" style="min-width: 200px">
                            <template #header>
                                <div class="flex w-full justify-content-end uppercase">
                                    <span>diff</span>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="flex w-full justify-content-end">
                                    <span class="text-sm font-bold">{{data.diff_n}}</span>
                                </div>
                            </template>
                        </Column>
                        <template #groupheader="slotProps">
                            <div class="font-italic font-medium mt-4" v-if="slotProps.data.type !='1' && slotProps.data.type !='2'">{{ slotProps.data.type }}</div>
                        </template>
                        <!-- <ColumnGroup type="footer">
                            <Row>
                                <Column footer="Totals:" footerStyle="text-align:right" />
                                <Column :footer="calculateCustomerTotal(slotProps.data.type, 'real')" footerStyle="text-align:right"/>
                                <Column :footer="calculateCustomerTotal(slotProps.data.type, 'rkap')" footerStyle="text-align:right"/>
                                <Column :footer="calculateCustomerTotal(slotProps.data.type, 'diff')" footerStyle="text-align:right"/>
                            </Row>
                        </ColumnGroup> -->
                        <template #groupfooter="slotProps">
                            <div class="flex gap-3 align-items-center justify-content-between">
                                <div class="flex flex-column gap-2">
                                    <span class="text-xl font-bold">TOTALS</span>
                                </div>
                                <div class="flex flex-column gap-2">
                                    <span>Real</span>
                                    <span class="font-bold">{{ calculateCustomerTotal(slotProps.data.type, 'real') }}</span>
                                </div>
                                <div class="flex flex-column gap-2">
                                    <span>RKAP</span>
                                    <span class="font-bold">{{ calculateCustomerTotal(slotProps.data.type, 'rkap') }}</span>
                                </div>
                                <div class="flex flex-column gap-2">
                                    <span>DIFF</span>
                                    <span class="font-bold">{{ calculateCustomerTotal(slotProps.data.type, 'diff') }}</span>
                                </div>

                                <div class="flex flex-column gap-2">
                                    <span>Real (%)</span>
                                    <span class="font-bold">{{ calculateCustomerTotal(slotProps.data.type, 'diff') }}</span>
                                </div>
                                <div class="flex flex-column gap-2">
                                    <span>Sisa Target (%)</span>
                                    <span class="font-bold">{{ calculateCustomerTotal(slotProps.data.type, 'diff') }}</span>
                                </div>
                            </div>
                        </template>
                        <!-- <div class="flex justify-content-end font-bold w-full">Total: {{ slotProps.data.real_r }}</div> -->
                    </DataTable>
                </div>
            </template>
        </DataTable>
        
    </div>
</template>