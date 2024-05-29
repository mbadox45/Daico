<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {actual_cpo} from '@/api/dummy/variable_form.js';
    import ActualCpo from '@/api/cpo/ActualCpo.js';

    // VARIABLE
    const products = ref();
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const list_tahun = ref([]);
    const op = ref();
    const forms = ref({actual_cpo})
    const loadingTable = ref(false)
    
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const title_dialog = ref('');

    // Message Configure
    const messages = ref([]);
    let count = ref(0);
    const time = ref(3000)


    // Function ===================================================================================================================================================
    onMounted(() => {
        loadTahun();
        loadBulan();
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
        loadingTable.value = true
        try {
            products.value = []
            const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
            // const dateString = `2024-03-01`;
            const response = await ActualCpo.getByDate({tanggal: dateString})
            const load = response.data;
            const data = load.data;
            for (let a = 0; a < data.length; a++) {
                products.value.push({
                    id:data[a].id,
                    tanggal:moment(data[a].tanggal).format('DD-MMM-YYYY'),
                    harga:formatCurrency(data[a].harga),
                    qty: data[a].qty,
                    value: formatCurrency(data[a].value),
                })
            }
            loadingTable.value = false
        } catch (error) {
            products.value = []
            loadingTable.value = false
        }
    }

    const formDatabase = (cond, data) => {
        visible.value = true
        status_form.value = cond;
        title_dialog.value = cond == 'add' ? 'Actual Incomming CPO - Tambah Data' : cond == 'edit' ? 'Actual Incomming CPO - Edit Data' : 'Actual Incomming CPO - Hapus Data' ;
        if (cond == 'add') {
            resetForm()
        } else {
            forms.value = {
                id: data.id,
                tanggal: moment(data.tanggal).format('YYYY-MM-DD'),
                harga: currencyToNumber(data.harga),
                qty: data.qty,
            }
        }
    }

    const resetForm = () => {
        forms.value = {
            id: null,
            tanggal: moment().format('YYYY-MM-DD'),
            qty: null,
            harga: null,
        }
    }

    const opByPeriod = (event) => {
        op.value.toggle(event);
    }

    const loadByPeriod = () => {
        op.value.toggle();
        loadData();
    }

    const formatCurrency = (amount) => {
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return 'Rp ' + parts.join(',');
    }

    const currencyToNumber = (money) => {
        const numericString = money.replace(/[^\d,.]/g, ''); // Removes all non-numeric characters except ',' and '.'
        const numericValue = parseFloat(numericString.replace('.', ''));
        return numericValue;
    }

    const saveData = async () => {
        status_form.value
        if (forms.value.tanggal != null && forms.value.harga != null && forms.value.qty != null) {
            if (status_form.value == 'add') {
                const response = await ActualCpo.addActual(forms.value);
                const load = response.data;
                if (load.success == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di tambahkan', id: count.value++ }
                    ];
                    setTimeout(function() {
                        loadData()
                        visible.value = false
                    }, time.value);
                } else {
                    messages.value = [
                        { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
                    ];
                }
            } else if (status_form.value == 'edit') {
                const response = await ActualCpo.updateActual(forms.value.id, forms.value);
                const load = response.data;
                if (load.success == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di update', id: count.value++ }
                    ];
                    setTimeout(function() {
                        loadData()
                        visible.value = false
                    }, time.value);
                } else {
                    messages.value = [
                        { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
                    ];
                }
            } else {
                messages.value = [
                    { severity: 'success', content: 'Data berhasil di hapus', id: count.value++ }
                ];
            }
        } else {
            messages.value = [
                { severity: 'warn', content: 'Mohon data diisi dengan lengkap', id: count.value++ }
            ];
        }
    }
</script>

<template>
    <div class="flex flex-column gap-3 w-full">
        <span class="font-medium text-xl uppercase">Actual Incoming CPO</span>
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-full flex gap-2">
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
            <div class="p-inputgroup p-fluid">
                <span class="p-inputgroup-addon bg-white">
                    <i class="pi pi-search"></i>
                </span>
                <InputText type="text" placeholder="Search" class="w-full" v-model="filters['global'].value"/>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '50rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="username" class="font-semibold w-6rem">Tanggal</label>
                <InputText id="username" v-model="forms.tanggal" type="date" class="flex-auto" autocomplete="off" :max="moment().format('YYYY-MM-DD')"/>
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="avg" class="font-semibold w-6rem">Qty</label>
                <InputNumber v-model="forms.qty" inputId="locale-german" locale="de-DE" :minFractionDigits="1" :maxFractionDigits="2" class="flex-auto"/>
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="avg" class="font-semibold w-6rem">Harga (Rp)</label>
                <InputNumber v-model="forms.harga" inputId="locale-german" locale="de-DE" :minFractionDigits="1" :maxFractionDigits="3" class="flex-auto"/>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="saveData"></Button>
            </div>
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
        <!-- Table -->
        <DataTable v-else v-model:filters="filters" :value="products" paginator :rows="10" showGridlines :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="id" scrollable :globalFilterFields="['date']">
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
                    <Column sortable field="qty">
                        <template #header>
                            <div class="flex">
                                <span>Qty</span>
                            </div>
                        </template>
                    </Column>
                    <Column sortable field="harga">
                        <template #header>
                            <div class="flex justify-content-end w-full">
                                <span>Harga</span>
                            </div>
                        </template>
                    </Column>
                    <Column sortable field="value">
                        <template #header>
                            <div class="flex justify-content-end w-full">
                                <span>Value</span>
                            </div>
                        </template>
                    </Column>
                </Row>
            </ColumnGroup>
            <Column field="product">
                <template #body="{ data }">
                    <strong class="text-sm">{{ data.tanggal }}</strong>
                </template>
            </Column>
            <Column field="qty">
                <template #body="{ data }">
                    <div class="flex">
                        <span>{{ data.qty }}</span>
                    </div>
                </template>
            </Column>
            <Column field="harga">
                <template #body="{ data }">
                    <div class="flex justify-content-end">
                        <span>{{ data.harga }}</span>
                    </div>
                </template>
            </Column>
            <Column field="value">
                <template #body="{ data }">
                    <div class="flex justify-content-end">
                        <span>{{ data.value }}</span>
                    </div>
                </template>
            </Column>
            <Column header="" style="max-width: 10px;">
                <template #body="{ data }">
                    <div class="flex justify-content-end gap-3">
                        <button @click="formDatabase('edit', data)" class="bg-transparent text-sm border-none border-round text-yellow-500"><i class="pi pi-pencil"></i></button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>