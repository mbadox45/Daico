<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {database} from '@/api/DummyData.js'

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
        products.value = []
        for (let i = 1; i <= 31; i++) {
            const qty = Math.floor(Math.random() * 111)+100;
            const harga = Number(`12${Math.floor(Math.random()*900) + 100}`);
            products.value.push({id: i, date:`${i > 9 ? i : '0'+i}-Mar-2024`, qty: qty, harga:formatCurrency(harga), value: formatCurrency(qty * harga)});
        }
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
    <div class="flex flex-column gap-3 w-full">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-full flex gap-2">
                <Button icon="pi pi-plus" severity="info" size="small" @click="formDatabase('add', null)" class="h-2rem w-2rem"/>
                <Button label="Select by Period" outlined severity="secondary" icon="pi pi-calendar" size="small" @click="opByPeriod" class="h-2rem px-3"/>
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
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '50rem' }">
            <span class="p-text-secondary block mb-5">Update your information.</span>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="username" class="font-semibold w-6rem">Username</label>
                <InputText id="username" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="email" class="font-semibold w-6rem">Email</label>
                <InputText id="email" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="visible = false"></Button>
            </div>
        </Dialog>

        <!-- Table -->
        <DataTable v-model:filters="filters" :value="products" dataKey="id" scrollable scrollHeight="430px" :globalFilterFields="['date']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <ColumnGroup type="header">
                <Row>
                    <Column header="Date" :rowspan="2" />
                    <Column :colspan="3">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <span>Actual Incoming CPO</span>
                            </div>
                        </template>
                    </Column>
                    <Column :rowspan="2" />
                </Row>
                <Row>
                    <Column header="Qty" sortable field="qty" />
                    <Column header="Harga" sortable field="harga" />
                    <Column header="Value" sortable field="value" />
                </Row>
            </ColumnGroup>
            <Column field="product">
                <template #body="{ data }">
                    <strong class="text-sm">{{ data.date }}</strong>
                </template>
            </Column>
            <Column field="qty">
                <template #body="{ data }">
                    {{ data.qty }}
                </template>
            </Column>
            <Column field="harga">
                <template #body="{ data }">
                    {{ data.harga }}
                </template>
            </Column>
            <Column field="value">
                <template #body="{ data }">
                    {{ data.value }}
                </template>
            </Column>
            <Column header="">
                <template #body="{ data }">
                    <div class="flex gap-3">
                        <button @click="formDatabase('edit', data)" class="bg-transparent text-sm border-none border-round text-yellow-500"><i class="pi pi-pencil"></i></button>
                        <button @click="formDatabase('delete', data)" class="bg-transparent text-sm border-none border-round text-pink-500"><i class="pi pi-trash"></i></button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>