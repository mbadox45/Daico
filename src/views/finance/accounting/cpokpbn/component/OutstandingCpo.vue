<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {formatCurrency} from '@/views/load_data/func_dummy.js'
    import {outstanding_cpo} from '@/api/dummy/variable_form.js';
    import OutstandingCpo from '@/api/cpo/OutstandingCpo.js';

    // VARIABLE
    const products = ref();
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const bulan = ref(Number(moment().format('M')));
    const list_bulan = ref([]);
    const tahun = ref(Number(moment().format('yyyy')));
    const list_tahun = ref([]);
    const op = ref();
    const forms = ref({outstanding_cpo})
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
        loadData()
    });

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
            const response = await OutstandingCpo.getAll()
            const load = response.data;
            const data = load.data;
            // console.log(load)
            for (let a = 0; a < data.length; a++) {
                products.value.push({
                    id:data[a].id,
                    kontrak: data[a].kontrak,
                    supplier: data[a].supplier,
                    harga:data[a].harga,
                    qty: data[a].qty,
                    qty_out: data[a].qty_out,
                    value: data[a].value,
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
        messages.value = []
        title_dialog.value = cond == 'add' ? 'Outstanding CPO - Tambah Data' : cond == 'edit' ? 'Outstanding CPO - Edit Data' : 'Outstanding CPO - Hapus Data' ;
        if (cond == 'add') {
            resetForm()
        } else {
            console.log(data)
            forms.value = {
                id: data.id,
                kontrak: data.kontrak,
                supplier: data.supplier,
                harga: data.harga,
                qty: data.qty,
                qty_out: data.qty_out,
            }
        }
    }

    const resetForm = () => {
        forms.value = {
            id: null,
            kontrak: null,
            supplier: null,
            qty: null,
            qty_out: null,
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

    const saveData = async () => {
        status_form.value
        if (forms.value.kontrak != null && forms.value.supplier != null && forms.value.harga != null && forms.value.qty != null && forms.value.qty_out != null) {
            if (status_form.value == 'add') {
                const response = await OutstandingCpo.addOutstanding(forms.value);
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
                const response = await OutstandingCpo.updateOutstanding(forms.value.id, forms.value);
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
        <span class="font-medium text-xl uppercase">Outstanding CPO</span>
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-full flex gap-2">
                <Button icon="pi pi-plus" severity="info" size="small" @click="formDatabase('add', null)"/>
                <!-- <Button label="Select by Period" outlined severity="secondary" size="small" @click="opByPeriod"/>
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
                </OverlayPanel> -->
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
                <label for="username" class="font-semibold w-6rem">Kontrak</label>
                <InputText id="username" v-model="forms.kontrak" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="supplier" class="font-semibold w-6rem">Supplier</label>
                <InputText id="supplier" v-model="forms.supplier" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="avg" class="font-semibold w-6rem">Qty</label>
                <div class="flex-auto flex gap-3">
                    <InputNumber v-model="forms.qty" inputId="avg" :minFractionDigits="1" :maxFractionDigits="2" placeholder="Qty Terima" class="w-full"/>
                    <InputNumber v-model="forms.qty_out" inputId="avg" :minFractionDigits="1" :maxFractionDigits="2" placeholder="Qty Kirim" class="w-full"/>
                </div>
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="harga" class="font-semibold w-6rem">Harga (Rp)</label>
                <InputNumber v-model="forms.harga" inputId="harga" :minFractionDigits="1" :maxFractionDigits="3" class="flex-auto"/>
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
        <DataTable v-else v-model:filters="filters" :value="products" paginator :rows="10" showGridlines :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="id" scrollable :globalFilterFields="['kontrak','supplier','qty','harga','value']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <ColumnGroup type="header">
                <Row>
                    <Column header="Kontrak" field="kontrak" :rowspan="2" />
                    <Column header="Supplier" :rowspan="2" />
                    <Column :colspan="4">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <span>Outstanding CPO Yang Belum Dikirim</span>
                            </div>
                        </template>
                    </Column>
                </Row>
                <Row>
                    <Column sortable field="qty">
                        <template #header>
                            <div class="flex justify-content-end w-full">
                                <span>Qty Out</span>
                            </div>
                        </template>
                    </Column>
                    <Column sortable field="qty">
                        <template #header>
                            <div class="flex justify-content-end w-full">
                                <span>Qty In</span>
                            </div>
                        </template>
                    </Column>
                    <Column sortable field="harga">
                        <template #header>
                            <div class="flex justify-content-end w-full">
                                <span>Price</span>
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
            <Column field="kontrak">
                <template #body="{ data }">
                    <div class="flex align-items-center justify-content-between">
                        <strong class="text-sm uppercase">{{ data.kontrak }}</strong>
                        <button @click="formDatabase('edit', data)" class="bg-transparent text-sm border-none border-round text-yellow-500"><i class="pi pi-pencil"></i></button>
                    </div>
                </template>
            </Column>
            <Column field="supplier">
                <template #body="{ data }">
                    <strong class="text-sm uppercase">{{ data.supplier }}</strong>
                </template>
            </Column>
            <Column field="qty">
                <template #body="{ data }">
                    <div class="flex justify-content-end">
                        <span>{{ formatCurrency(Number(data.qty_out).toFixed(2)) }}</span>
                    </div>
                </template>
            </Column>
            <Column field="qty">
                <template #body="{ data }">
                    <div class="flex justify-content-end">
                        <span>{{ formatCurrency(Number(data.qty).toFixed(2)) }}</span>
                    </div>
                </template>
            </Column>
            <Column field="harga">
                <template #body="{ data }">
                    <div class="flex justify-content-end">
                        <span>Rp. {{ formatCurrency(Number(data.harga).toFixed(2)) }}</span>
                    </div>
                </template>
            </Column>
            <Column field="value">
                <template #body="{ data }">
                    <div class="flex justify-content-end">
                        <span>Rp. {{ formatCurrency(Number(data.value).toFixed(2)) }}</span>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>