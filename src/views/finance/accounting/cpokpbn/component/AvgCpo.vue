<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment-timezone';

    moment.tz.setDefault('Asia/Jakarta');

    // API ========================================================================================================================================================
    import { URL_WEB } from '@/api/DataVariable';
    import {cpo_kpbn} from '@/api/dummy/variable_form.js';
    import { cek_token } from "@/api/DataVariable.js";
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import {addCpoKpbn_CpoController, updateCpoKpbn_CpoController} from '@/controller/retail/CpoController.js'

    const props = defineProps({
        datas:{
            type:Array,
            default: () => {}
        }
    });

    // VARIABLE
    const products = ref([]);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const forms = ref({cpo_kpbn})
    const loadingTable = ref(false)
    const loadingButton = ref(false)
    
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
            const response = props.datas
            products.value = response
            loadingTable.value = false
        } catch (error) {
            products.value = []
            loadingTable.value = false
        }
    }

    const formDatabase = (cond, data) => {
        messages.value = []
        visible.value = true
        status_form.value = cond;
        title_dialog.value = cond == 'add' ? 'CPO KPBN - Tambah Data' : cond == 'edit' ? 'CPO KPBN - Edit Data' : 'CPO KPBN - Hapus Data' ;
        if (cond == 'add') {
            resetForm()
        } else {
            forms.value = {
                id: data.id,
                tanggal: moment(data.tanggal).format('YYYY-MM-DD'),
                avg: Number(data.avg),
            }
        }
    }

    const resetForm = () => {
        forms.value = {
            tanggal: moment().format('YYYY-MM-DD'),
            avg: null
        }
    }

    const saveData = async () => {
        status_form.value
        if (forms.value.tanggal != null && forms.value.avg != null) {
            loadingButton.value = true
            if (status_form.value == 'add') {
                const response = await addCpoKpbn_CpoController(forms.value);
                if (response.status == true) {
                    messages.value = [{ severity: 'success', content: 'Data berhasil di tambahkan', id: count.value++ }];
                    setTimeout(function() {
                        visible.value = false
                        window.location.replace(`${URL_WEB}cpo?active=1`);
                    }, time.value);
                } else {
                    if (response.code == 400) {
                        messages.value = [{ severity: 'error', content: response.msg, id: count.value++ }];
                    } else {
                        messages.value = [{ severity: 'error', content: response.msg, id: count.value++ }];
                    }
                }
            } else if (status_form.value == 'edit') {
                const response = await updateCpoKpbn_CpoController(forms.value.id, forms.value);
                if (response.status == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di update', id: count.value++ }
                    ];
                    setTimeout(function() {
                        // loadData()
                        visible.value = false
                        window.location.replace(`${URL_WEB}cpo?active=1`);
                    }, time.value);
                } else {
                    if (response.code == 400) {
                        messages.value = [{ severity: 'error', content: response.msg, id: count.value++ }];
                    } else {
                        messages.value = [{ severity: 'error', content: response.msg, id: count.value++ }];
                    }
                }
            } else {
                messages.value = [
                    { severity: 'success', content: 'Data berhasil di hapus', id: count.value++ }
                ];
            }
            loadingButton.value = false
        } else {
            messages.value = [
                { severity: 'warn', content: 'Mohon data diisi dengan lengkap', id: count.value++ }
            ];
        }
    }
</script>

<template>
    <div class="flex flex-column gap-3 w-full">
        <span class="font-medium text-xl">CPO KPBN</span>
        <div class="flex justify-content-between align-items-center gap-5">
            <div :class="cek_token == null ? 'hidden' : 'flex'" class="w-full gap-2">
                <Button icon="pi pi-plus" severity="info" size="small" @click="formDatabase('add', null)"/>
            </div>
            <div class="p-inputgroup p-fluid">
                <span class="p-inputgroup-addon bg-white">
                    <i class="pi pi-search"></i>
                </span>
                <InputText type="text" placeholder="Search" class="w-full" v-model="filters['global'].value"/>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :closable="false" :style="{ width: '50rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="username" class="font-semibold w-6rem">Tanggal</label>
                <InputText id="username" v-model="forms.tanggal" type="date" class="flex-auto" autocomplete="off" :max="moment().format('YYYY-MM-DD')"/>
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="avg" class="font-semibold w-6rem">Avg CPO</label>
                <InputNumber v-model="forms.avg" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" class="flex-auto"/>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false" :disabled="loadingButton ? true : false"></Button>
                <Button type="button" :label="loadingButton ? 'Saving...' : 'Save'" @click="saveData" :disabled="loadingButton ? true : false"></Button>
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
        <DataTable v-else v-model:filters="filters" :value="products" paginator :rows="10" showGridlines="" dataKey="id" scrollable :globalFilterFields="['tanggal','avg']">
            <template #empty> No avg cpo kpbn found. </template>
            <template #loading> Loading avg cpo kpbn data. Please wait. </template>
            <Column field="tanggal" header="Date" style="min-width: 8rem;">
                <template #body="{ data }">
                    <strong class="text-sm">{{ data.tanggal }}</strong>
                </template>
            </Column>
            <Column field="avg" style="min-width: 10rem">
                <template #header>
                    <div class="flex justify-content-end w-full">
                        <span>Average CPO for KPBN</span>
                    </div>
                </template>
                <template #body="{ data }">
                    <div class="flex justify-content-end">
                        <span>{{ formatCurrency(Number(data.avg).toFixed(2)) }}</span>
                    </div>
                </template>
            </Column>
            <Column field="tanggal" header="Created At" style="min-width: 4rem;">
                <template #body="{ data }">
                    <div class="text-sm">
                        <span>{{ moment(data.created_at).format('YYYY-MM-DD  HH:mm:ss') }}</span>
                    </div>
                </template>
            </Column>
            <Column field="tanggal" header="Updated At" style="min-width: 4rem;">
                <template #body="{ data }">
                    <div class="text-sm">
                        <span>{{ moment(data.updated_at).format('YYYY-MM-DD  HH:mm:ss') }}</span>
                    </div>
                </template>
            </Column>
            <Column header="" style="min-width: 10px;" v-if="cek_token != null">
                <template #body="{ data }">
                    <div class="flex justify-content-end gap-3">
                        <button @click="formDatabase('edit', data)" class="bg-transparent text-sm border-none border-round text-yellow-500"><i class="pi pi-pencil"></i></button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>