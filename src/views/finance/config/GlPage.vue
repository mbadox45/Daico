<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {gl} from '@/api/dummy/gl.js'
    import GlConfig from '@/api/configuration/GlConfig.js';

    // VARIABLE
    const products = ref();
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
        try {
            const response = await GlConfig.getByDate({tanggal:"2024-04-01"})
            const load = response.data;
            console.log(load)
        } catch (error) {
            
        }
        // products.value = []
        // for (let i = 0; i < gl.length; i++) {
        //     products.value.push({
        //         coa: gl[i].coa,
        //         no_transaksi: gl[i].no_transaksi,
        //         uraian: gl[i].uraian,
        //         debet: gl[i].debet < 1 ? '-' : formatCurrency(gl[i].debet),
        //         kredit: gl[i].kredit < 1 ? '-' : formatCurrency(gl[i].kredit),
        //         date: gl[i].date,
        //         cat1: gl[i].cat1,
        //         cat2: gl[i].cat2,
        //         cat3: gl[i].cat3,
        //         laporan_management: gl[i].laporan_management,
        //         cost_centre: gl[i].cost_centre,
        //         plan: gl[i].plan,
        //         allocation: gl[i].allocation,
        //         journal: gl[i].journal,
        //         account: gl[i].account,
        //         reference: gl[i].reference,
        //     });
        // }
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

    function formatCurrency(amount) {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return 'Rp ' + parts.join(',');
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
        <DataTable v-model:filters="filters" :value="products" paginator :rows="10" dataKey="id" scrollable :globalFilterFields="['name']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="coa" header="COA" frozen>
                <template #body="{ data }">
                    <strong class="text-sm">{{ data.coa }}</strong>
                </template>
            </Column>
            <Column header="" frozen>
                <template #body="{ data }">
                    <div class="flex gap-3">
                        <button @click="formDatabase('edit', data)" class="p-2 text-sm border-none border-round text-yellow-500"><i class="pi pi-pencil"></i></button>
                        <button @click="formDatabase('delete', data)" class="p-2 text-sm border-none border-round text-pink-500"><i class="pi pi-trash"></i></button>
                    </div>
                </template>
            </Column>
            <Column field="no_transaksi" header="No. Transaksi" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.no_transaksi }}
                </template>
            </Column>
            <Column field="uraian" header="Uraian" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.uraian }}
                </template>
            </Column>
            <Column field="debet" header="Debet" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.debet }}
                </template>
            </Column>
            <Column field="kredit" header="Kredit" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.kredit }}
                </template>
            </Column>
            <Column field="date" header="Date" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.date }}
                </template>
            </Column>
            <Column field="cat1" header="Category 1" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cat1 }}
                </template>
            </Column>
            <Column field="cat2" header="Category 2" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cat2 }}
                </template>
            </Column>
            <Column field="cat3" header="Category 3" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cat3 }}
                </template>
            </Column>
            <Column field="laporan_management" header="Laporan Management" style="min-width: 14rem">
                <template #body="{ data }">
                    {{ data.laporan_management }}
                </template>
            </Column>
            <Column field="cost_centre" header="Cost Centre" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cost_centre }}
                </template>
            </Column>
            <Column field="plan" header="Plant" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.plan }}
                </template>
            </Column>
            <Column field="allocation" header="Allocation" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.allocation }}
                </template>
            </Column>
            <Column field="journal" header="Jurnal Entry" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.journal }}
                </template>
            </Column>
            <Column field="account" header="Account" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.account }}
                </template>
            </Column>
            <Column field="reference" header="Reference" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.reference }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>