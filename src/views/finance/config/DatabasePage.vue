<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {debe} from '@/api/dummy/variable_form.js';
    import KpbnCpo from '@/api/cpo/KpbnCpo.js';

    // VARIABLE
    const products = ref();
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const op = ref();
    const loadingTable = ref(false)
    
    // Forms
    const forms = ref({debe})
    const list_category = ref([])
    const list_report = ref([])
    const list_centre = ref([])
    const list_plant = ref([])
    const list_allocation = ref([])

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

    const loadData = async() => {
        loadingTable.value = true
        try {
            products.value = []
            // const dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`;
            const dateString = `2024-03-01`;
            const response = await KpbnCpo.getByDate({tanggal: dateString})
            const load = response.data;
            const data = load.data;
            for (let a = 0; a < data.length; a++) {
                products.value.push({
                    id:data[a].id,
                    tanggal:moment(data[a].tanggal).format('DD-MMM-YYYY'),
                    avg:formatCurrency(data[a].avg),
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
        title_dialog.value = cond == 'add' ? 'CPO KPBN - Tambah Data' : cond == 'edit' ? 'CPO KPBN - Edit Data' : 'CPO KPBN - Hapus Data' ;
        if (cond == 'add') {
            resetForm()
        } else {
            forms.value = {
                id: data.id,
                tanggal: moment(data.tanggal).format('YYYY-MM-DD'),
                avg: currencyToNumber(data.avg),
            }
        }
    }

    const resetForm = () => {
        forms.value = {
            id: null,
            coa: null,
            id_category3: null,
            id_m_report: null,
            id_c_centre: null,
            id_plant: null,
            id_allocation: null,
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
        if (forms.value.tanggal != null && forms.value.avg != null) {
            if (status_form.value == 'add') {
                const response = await KpbnCpo.addKpbn(forms.value);
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
                const response = await KpbnCpo.updateKpbn(forms.value.id, forms.value);
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
    <div class="flex flex-column gap-3 w-full card shadow-3">
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
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '80rem' }">
            <Divider/>
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex align-items-center gap-3">
                <div class="w-full">
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="coa" class="font-semibold">COA <small class="text-red-500">*</small></label>
                        <InputText id="coa" v-model="forms.coa" class="flex-auto" autocomplete="off" placeholder="00xxx"/>
                    </div>
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="category" class="font-semibold">Category 3 <small class="text-red-500">*</small></label>
                        <Dropdown id="category" v-model="forms.id_category3" :options="list_category" optionLabel="name" optionValue="id" placeholder="Category 3" @change="loadBulan" checkmark :highlightOnSelect="false" class="flex-auto"/>
                    </div>
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="report" class="font-semibold">Management Report <small class="text-red-500">*</small></label>
                        <Dropdown id="report" v-model="forms.id_m_report" :options="list_report" optionLabel="name" optionValue="id" placeholder="Management Report" checkmark :highlightOnSelect="false" class="flex-auto"/>
                    </div>
                </div>
                <div class="w-full">
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="cc" class="font-semibold">Cost Centre <small class="text-red-500">*</small></label>
                        <Dropdown id="cc" v-model="forms.id_c_centre" :options="list_centre" optionLabel="name" optionValue="id" placeholder="Cost Centre" checkmark :highlightOnSelect="false" class="flex-auto"/>
                    </div>
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="plant" class="font-semibold">Plant <small class="text-red-500">*</small></label>
                        <Dropdown id="plant" v-model="forms.id_plant" :options="list_plant" optionLabel="name" optionValue="id" placeholder="Plant" checkmark :highlightOnSelect="false" class="flex-auto"/>
                    </div>
                    <div class="flex flex-column gap-3 mb-5">
                        <label for="allo" class="font-semibold">Allocation <small class="text-red-500">*</small></label>
                        <Dropdown id="allo" v-model="forms.id_allocation" :options="list_allocation" optionLabel="name" optionValue="id" placeholder="Cost Centre" checkmark :highlightOnSelect="false" class="flex-auto"/>
                    </div>
                </div>
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
        <DataTable v-else v-model:filters="filters" :value="products" paginator :rows="10" showGridlines="" :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="id" scrollable :globalFilterFields="['tanggal','avg']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="coa" header="Chart of Account" frozen style="min-width: 12rem">
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
            <Column field="category1" header="Category 1" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.category1 }}
                </template>
            </Column>
            <Column field="category2" header="Category 2" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.category2 }}
                </template>
            </Column>
            <Column field="category3" header="Category 3" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.category3 }}
                </template>
            </Column>
            <Column field="man_report" header="Management Report" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.man_report }}
                </template>
            </Column>
            <Column field="cost_centre" header="Cost Centre" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cost_centre }}
                </template>
            </Column>
            <Column field="plant" header="Plant" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.plant }}
                </template>
            </Column>
            <Column field="allocation" header="Allocation" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.allocation }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>