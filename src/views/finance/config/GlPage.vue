<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {loadTable_GeneralLedgerController} from '@/controller/config/GeneralLedgerController.js'

    // VARIABLE
    const products = ref();
    const totalDebit = ref();
    const totalCredit = ref();
    const totalDifference = ref();
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const loadingTable = ref(false)
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


    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
        tanggal.value = dateString;
        const response = await loadTable_GeneralLedgerController(dateString)
        products.value = response.list
        totalCredit.value = response.credit;
        totalDebit.value = response.debit;
        totalDifference.value = response.diff;
        loadTahun();
        loadBulan();
        loadingTable.value = false
    }

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

    const opByPeriod = (event) => {
        op.value.toggle(event);
    }

    const loadByPeriod = () => {
        op.value.toggle();
        loadData()
    }
</script>

<template>
    <div class="p-5 border-round bg-white shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="flex align-items-center gap-3 w-full">
                <Button label="Select by Period" outlined severity="secondary" size="small" class="py-2" @click="opByPeriod"/>
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
                <span class="font-medium text-sm text-gray-400">{{ moment(tanggal).format('MMMM YYYY') }}</span>
            </div>
            <div class="p-inputgroup p-fluid">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-search"></i>
                </span>
                <InputText type="text" v-model="filters['global'].value" placeholder="Search" />
            </div>
        </div>
        <div class="flex justify-content-between align-items-center gap-5">
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

        <!-- Table -->
        <div class="p-4 border-2 border-gray-200 border-round">
            <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
                <div>
                    <span class="text-xl font-normal">Loading...</span>
                </div>
                <div>
                    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
                </div>
            </div>
            <DataTable v-else v-model:filters="filters" :value="products" dataKey="id" scrollHeight="480px" scrollable :globalFilterFields="['coa','no_transaksi', 'uraian']">
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
                        <small v-tooltip.bottom="data.uraian2">{{ data.uraian }}</small>
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
                        <small v-tooltip.bottom="data.journal2">{{ data.journal }}</small>
                    </template>
                </Column>
                <Column field="account" header="Account" style="min-width: 12rem">
                    <template #body="{ data }">
                        <small v-tooltip.bottom="data.account2">{{ data.account }}</small>
                    </template>
                </Column>
                <Column field="reference" header="Reference" style="min-width: 12rem">
                    <template #body="{ data }">
                        <small v-tooltip.bottom="data.reference2">{{ data.reference }}</small>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>