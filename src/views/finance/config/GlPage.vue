<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {gl} from '@/api/dummy/gl.js'
    import GlConfig from '@/api/configuration/GlConfig.js';
    import CategoryMaster from '@/api/master/CategoryMaster.js';

    // VARIABLE
    const products = ref();
    const totalDebit = ref();
    const totalCredit = ref();
    const totalDifference = ref();
    const list_category = ref([])
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const loadingTable = ref(false)
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
        loadCategory()
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
        try {
            loadingTable.value = true
            const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
            const response = await GlConfig.getByDate({tanggal:dateString})
            const load = response.data;
            totalCredit.value = formatCurrency(load.totalCredit.toFixed(2));
            totalDebit.value = formatCurrency(load.totalDebit.toFixed(2));
            totalDifference.value = formatCurrency(load.totalDifference.toFixed(2));

            // Data
            const data = load.data;
            products.value = []
            const cat = list_category.value;
            let category2;
            for (let i = 0; i < data.length; i++) {
                category2 = data[i].debe == null ? null :  data[i].debe.cat3 == null ? null : cat.find(item => item.id3 == data[i].debe.cat3.id && item.id2 == data[i].debe.cat3.id_category2)
                products.value.push({
                    coa: data[i].account_account == null ? '' : data[i].account_account.code,
                    no_transaksi: data[i].move_name,
                    uraian: data[i].name,
                    debet: Number(data[i].debit) < 1 ? '-' : formatCurrency(Number(data[i].debit)),
                    kredit: Number(data[i].credit) < 1 ? '-' : formatCurrency(Number(data[i].credit)),
                    date: moment(data[i].date).format('DD MMM YYYY'),
                    cat1: category2 == null ? '-': category2.name1,
                    cat2: category2 == null ? '-': category2.name2,
                    cat3: data[i].debe == null ? '' : data[i].debe.cat3 == null ? '-' :  data[i].debe.cat3.nama,
                    laporan_management: data[i].debe == null ? '' : data[i].debe.m_report == null ? '-' : data[i].debe.m_report.nama,
                    cost_centre: data[i].debe == null ? '' : data[i].debe.c_centre == null ? '-' : data[i].debe.c_centre.nama,
                    plan: data[i].debe == null ? '' : data[i].debe.plant == null ? '-' : data[i].debe.plant.nama,
                    allocation: data[i].debe == null ? '' : data[i].debe.allocation == null ? '-' : data[i].debe.allocation.nama,
                    journal: data[i].move_name + " ("+ data[i].ref + ")",
                    account: data[i].account_account == null ? '' : data[i].account_account.code + ' ' + data[i].account_account.name,
                    reference: data[i].ref,
                });
            }
            console.log(products.value)

            loadingTable.value = false
            loadTahun();
            loadBulan();
        } catch (error) {
            loadingTable.value = false
            products.value = []
            totalCredit.value = formatCurrency(0);
            totalDebit.value = formatCurrency(0);
            totalDifference.value = formatCurrency(0);
        }
        
    }

    const loadCategory = async() => {
        try {
            list_category.value = [];
            const response = await CategoryMaster.getAll()
            const load = response.data;
            const data = load.data;
            for (let a = 0; a < data.length; a++) {
                const cat2 = data[a].cat2;
                for (let b = 0; b < cat2.length; b++) {
                    const cat3 = cat2[b].cat3;
                    for (let c = 0; c < cat3.length; c++) {
                        list_category.value.push({
                            id3:cat3[c].id,
                            id2:cat2[b].id,
                            id1:data[a].id,
                            name3:cat3[c].nama,
                            name2:cat2[b].nama,
                            name1:data[a].nama,
                        })
                    }
                }
            }
            // console.log(list_category.value)
        } catch (error) {
            list_category.value = []
        }
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
        loadData()
    }

    function formatCurrency(amount) {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return 'Rp. ' + parts.join(',');
    }
</script>

<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-4">
                <div class="p-inputgroup formgrid p-fluid">
                    <Button icon="pi pi-calendar" severity="info" size="small" @click="opByPeriod"/>
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
                    <InputText type="text" v-model="filters['global'].value" placeholder="Search" />
                </div>
            </div>
            <div class="w-1">
            </div>
            <div class="w-full flex gap-3">
                <div class="p-2 border-round border-1 border-gray-400 w-full flex flex-column gap-2">
                    <small class="text-xs">Total Credit:</small>
                    <div v-if="loadingTable == true" class="flex justify-content-start">
                        <div>
                            <ProgressSpinner v-if="loadingTable == true" style="width: 20px; height:20px;" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
                        </div>
                    </div>
                    <strong v-else class="w-full text-right font-medium">{{totalCredit}}</strong>
                </div>
                <div class="p-2 border-round border-1 border-gray-400 w-full flex flex-column gap-2">
                    <small class="text-xs">Total Debit:</small>
                    <div v-if="loadingTable == true" class="flex justify-content-start">
                        <div>
                            <ProgressSpinner v-if="loadingTable == true" style="width: 20px; height:20px;" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
                        </div>
                    </div>
                    <strong v-else class="w-full text-right font-medium">{{totalDebit}}</strong>
                </div>
                <div class="p-2 border-round border-1 border-gray-400 w-full flex flex-column gap-2">
                    <small class="text-xs">Total Difference:</small>
                    <div v-if="loadingTable == true" class="flex justify-content-start">
                        <div>
                            <ProgressSpinner v-if="loadingTable == true" style="width: 20px; height:20px;" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
                        </div>
                    </div>
                    <strong v-else class="w-full text-right font-medium">{{totalDifference}}</strong>
                </div>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '100rem' }">
            <div class="flex flex-column gap-3">
                <div class="flex justify-content-between">
                    <span class="text-sm font-light">Chart of Account</span>
                    <span class="text-sm font-normal"><small class="text-red-500 font-bold">*</small> ) Wajib di isi</span>
                </div>
                <div class="flex flex-wrap row-gap-4 column-gap-2 border-1 border-gray-300 border-round p-2">
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="username" class="font-semibold">COA <small class="text-red-500 font-bold">*</small></label>
                        <InputText id="username" class="flex-auto" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="cat1" class="font-semibold">Category 1</label>
                        <InputText id="cat1" disabled class="bg-gray-200" autocomplete="off" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="cat2" class="font-semibold">Category 2</label>
                        <InputText id="cat2" disabled class="bg-gray-200" autocomplete="off" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="cat3" class="font-semibold">Category 3</label>
                        <InputText id="cat3" disabled class="bg-gray-200" autocomplete="off" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="lamen" class="font-semibold">Laporan Management</label>
                        <InputText id="lamen" disabled class="bg-gray-200" autocomplete="off" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="cost" class="font-semibold">Cost Centre</label>
                        <InputText id="cost" disabled class="bg-gray-200" autocomplete="off" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="plant" class="font-semibold">Plant</label>
                        <InputText id="plant" disabled class="bg-gray-200" autocomplete="off" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="alloc" class="font-semibold">Allocation</label>
                        <InputText id="alloc" disabled class="bg-gray-200" autocomplete="off" />
                    </div>
                </div>
                <span class="text-sm font-light">Transaction</span>
                <div class="flex flex-wrap row-gap-4 column-gap-2 border-1 border-gray-300 border-round p-2">
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="transaksi" class="font-semibold">No. Transaksi</label>
                        <InputText id="transaksi" class="flex-auto" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="date" class="font-semibold">Date <small class="text-red-500 font-bold">*</small></label>
                        <InputText id="date" type="date" class="flex-auto" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="debet" class="font-semibold">Debet <small class="text-red-500 font-bold">*</small></label>
                        <InputNumber inputId="debet" mode="currency" currency="IDN" currencyDisplay="code" locale="de-DE" :maxFractionDigits="2"/>
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="kredit" class="font-semibold">Kredit <small class="text-red-500 font-bold">*</small></label>
                        <InputNumber inputId="kredit" mode="currency" currency="IDN" currencyDisplay="code" locale="de-DE" :maxFractionDigits="2"/>
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="jurnal" class="font-semibold">Journal Entry</label>
                        <InputText id="jurnal" class="flex-auto" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="account" class="font-semibold">Account</label>
                        <InputText id="account" class="flex-auto" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 24.5%;">
                        <label for="reference" class="font-semibold">Reference</label>
                        <InputText id="reference" class="flex-auto" />
                    </div>
                    <div class="flex flex-column gap-2" style="width: 100%;">
                        <label for="reference" class="font-semibold">Uraian <small class="text-red-500 font-bold">*</small></label>
                        <Textarea rows="5" cols="30" />
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-content-end gap-2 pt-3">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button type="button" label="Save" @click="visible = false"></Button>
                </div>
            </template>
        </Dialog>

        <!-- Table -->
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <DataTable v-else v-model:filters="filters" :value="products" paginator :rows="10" dataKey="id" scrollHeight="380px" scrollable :globalFilterFields="['coa','no_transaksi', 'uraian']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="coa" header="COA" frozen style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <strong class="text-sm">{{ data.coa }}</strong>
                </template>
            </Column>
            <Column field="no_transaksi" header="No. Transaksi" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <small v-tooltip.bottom="data.no_transaksi">{{ data.no_transaksi }}</small>
                </template>
            </Column>
            <Column field="uraian" header="Uraian" style="min-width: 13rem">
                <template #body="{ data }">
                    <small v-tooltip.bottom="data.uraian">{{ data.uraian.substring(0, 20) }}<span v-if="data.uraian.length > 20">...</span></small>
                </template>
            </Column>
            <Column field="debet" header="Debet" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="w-full justify-content-end flex"><small :title="data.debet">{{ data.debet }}</small></div>
                </template>
            </Column>
            <Column field="kredit" header="Kredit" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="w-full justify-content-end flex"><small :title="data.kredit">{{ data.kredit }}</small></div>
                </template>
            </Column>
            <Column field="date" header="Date" style="min-width: 12rem">
                <template #body="{ data }">
                    <small :title="data.date">{{ data.date }}</small>
                </template>
            </Column>
            <Column field="cat1" header="Category 1" style="min-width: 12rem">
                <template #body="{ data }">
                    <small :title="data.cat1">{{ data.cat1 }}</small>
                </template>
            </Column>
            <Column field="cat2" header="Category 2" style="min-width: 12rem">
                <template #body="{ data }">
                    <small :title="data.cat2">{{ data.cat2 }}</small>
                </template>
            </Column>
            <Column field="cat3" header="Category 3" style="min-width: 12rem">
                <template #body="{ data }">
                    <small :title="data.cat3">{{ data.cat3 }}</small>
                </template>
            </Column>
            <Column field="laporan_management" header="Laporan Management" style="min-width: 14rem">
                <template #body="{ data }">
                    <small :title="data.laporan_management">{{ data.laporan_management }}</small>
                </template>
            </Column>
            <Column field="cost_centre" header="Cost Centre" style="min-width: 12rem">
                <template #body="{ data }">
                    <small :title="data.cost_centre">{{ data.cost_centre }}</small>
                </template>
            </Column>
            <Column field="plan" header="Plant" style="min-width: 12rem">
                <template #body="{ data }">
                    <small :title="data.plan">{{ data.plan }}</small>
                </template>
            </Column>
            <Column field="allocation" header="Allocation" style="min-width: 6rem">
                <template #body="{ data }">
                    <small :title="data.allocation">{{ data.allocation }}</small>
                </template>
            </Column>
            <Column field="journal" header="Jurnal Entry" style="min-width: 12rem">
                <template #body="{ data }">
                    <small v-tooltip.bottom="data.journal">{{ data.journal.substring(0, 20) }}<span v-if="data.journal.length > 20">...</span></small>
                    <!-- <small :title="data.journal">{{ data.journal }}</small> -->
                </template>
            </Column>
            <Column field="account" header="Account" style="min-width: 12rem">
                <template #body="{ data }">
                    <small v-tooltip.bottom="data.account">{{ data.account.substring(0, 20) }}<span v-if="data.account.length > 20">...</span></small>
                    <!-- <small :title="data.account">{{ data.account }}</small> -->
                </template>
            </Column>
            <Column field="reference" header="Reference" style="min-width: 12rem">
                <template #body="{ data }">
                    <small v-tooltip.bottom="data.reference">{{ data.reference.substring(0, 20) }}<span v-if="data.reference.length > 20">...</span></small>
                    <!-- <small :title="data.reference">{{ data.reference }}</small> -->
                </template>
            </Column>
        </DataTable>
    </div>
</template>