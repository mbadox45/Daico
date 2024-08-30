<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import moment from 'moment-timezone';
    
    moment.tz.setDefault('Asia/Jakarta');
    
    // API
    import { URL_WEB } from '@/api/DataVariable';
    import { cek_token } from "@/api/DataVariable.js";
    import {addCpoStockAwal_CpoController, updateCpoStockAwal_CpoController} from '@/controller/retail/CpoController.js'

    const props = defineProps({
        datas:{
            type:Array,
            default: () => {}
        }
    });

    // Variable
    const tables = ref([])
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const forms = ref(
        {id: null, tanggal: moment().format('YYYY-MM-DD'), qty: 0, harga: 0, cond: false},
    )
    const loadingButton = ref(false)

    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const title_dialog = ref('');

    // Message Configure
    const messages = ref([]);
    let count = ref(0);
    const time = ref(3000)

    const loadData = async() => {
        try {
            const response = props.datas;
            console.log(response)
            tables.value = response
        } catch (error) {
            tables.value = []
        }
    }

    const formDatabase = (cond, data) => {
        console.log(data)
        messages.value = []
        visible.value = true
        status_form.value = cond;
        title_dialog.value = 'Stock Awal CPO - Update Data';
        if (cond == 'add') {
            resetForm()
        } else {
            forms.value = {
                id: data.id,
                tanggal: moment(data.tanggal).format('YYYY-MM-DD'),
                qty: Number(data.qty),
                harga: Number(data.harga),
                cond: true,
            }
        }
    }

    const resetForm = () => {
        forms.value = {
            id: null,
            tanggal: moment().format('YYYY-MM-DD'),
            qty: null,
            harga: null,
            cond: false,
        }
    }

    const postData = async() => {
        if (forms.value.tanggal != null && forms.value.qty != null && forms.value.harga != null) {
            if (status_form.value == 'add') {
                const response = await addCpoStockAwal_CpoController(forms.value);
                if (response.status == true) {
                    messages.value = [{ severity: 'success', content: 'Data berhasil di tambahkan', id: count.value++ }];
                    setTimeout(function() {
                        visible.value = false
                        window.location.replace(`${URL_WEB}cpo?active=0`);
                    }, time.value);
                } else {
                    if (response.code == 400) {
                        messages.value = [{ severity: 'error', content: response.msg, id: count.value++ }];
                    } else {
                        messages.value = [{ severity: 'error', content: response.msg, id: count.value++ }];
                    }
                }
            } else {
                const response = await updateCpoStockAwal_CpoController(forms.value.id, forms.value);
                if (response.status == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di update', id: count.value++ }
                    ];
                    setTimeout(function() {
                        // loadData()
                        visible.value = false
                        window.location.replace(`${URL_WEB}cpo?active=0`);
                    }, time.value);
                } else {
                    if (response.code == 400) {
                        messages.value = [{ severity: 'error', content: response.msg, id: count.value++ }];
                    } else {
                        messages.value = [{ severity: 'error', content: response.msg, id: count.value++ }];
                    }
                }
            }
        } else {
            messages.value = [
                { severity: 'warn', content: 'Mohon data diisi dengan lengkap', id: count.value++ }
            ];
        }
    }

    watch(() => props.datas, loadData, { immediate: true });
</script>
<template>
    <div class="flex flex-column gap-3 w-full">
        <div class="flex justify-content-between align-items-center gap-5">
            <span class="font-medium text-xl w-full">Stock Awal CPO</span>
            <div :class="cek_token == null ? 'hidden' : 'flex'" class="justify-content-end w-full gap-2">
                <Button label="Update Data" severity="info" size="small" @click="formDatabase('add', null)"/>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :closable="false" :style="{ width: '50rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="username" class="font-semibold w-6rem">Tanggal</label>
                <InputText :disabled="forms.cond" id="username" v-model="forms.tanggal" type="date" class="flex-auto" autocomplete="off" :max="moment().format('YYYY-MM-DD')"/>
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="avg" class="font-semibold w-6rem">QTY</label>
                <InputNumber v-model="forms.qty" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" class="flex-auto"/>
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="harga" class="font-semibold w-6rem">Harga</label>
                <InputNumber v-model="forms.harga" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" class="flex-auto"/>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false" :disabled="loadingButton ? true : false"></Button>
                <Button type="button" :label="loadingButton ? 'Saving...' : 'Save'" @click="postData" :disabled="loadingButton ? true : false"></Button>
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
        <div v-else class="flex pt-4 pl-5 w-full">
            <div class="grid w-full">
                <div class="col-12 py-1">
                    <div class="grid text-sm font-bold bg-gray-300 border-round">
                        <div class="col-5">Description</div>
                        <div class="col-2">Qty</div>
                        <div class="col-2">Rp/Kg</div>
                        <div class="col-3">Value</div>
                    </div>
                </div>
                <div class="col-12 py-1" v-for="(item, index) in tables" :key="index">
                    <div :class="index == (tables.length - 1) ? 'bg-gray-300 border-round' : ''" class="grid text-sm">
                        <div :class="index == (tables.length - 1) ? 'font-bold font-italic' : ''" class="col-5 border-right-2 border-gray-300 flex justify-content-between">
                            <span>{{item.name}}</span>
                            <Button v-if="index == 0 && cek_token != null" class="py-0 px-1 text-sm w-auto" severity="warning" size="small" icon="pi pi-pencil" @click="formDatabase('edit', item)"></Button>
                        </div>
                        <div :class="index == (tables.length - 1) ? 'font-bold font-italic' : ''" class="col-2 border-right-2 border-gray-300 text-right font-semibold">{{formatCurrency(item.qty)}}</div>
                        <div :class="index == (tables.length - 1) ? 'font-bold font-italic' : ''" class="col-2 border-right-2 border-gray-300 text-right font-semibold">{{formatCurrency(item.harga)}}</div>
                        <div :class="index == (tables.length - 1) ? 'font-bold font-italic' : ''" class="col-3 text-right font-semibold">{{formatCurrency(item.value)}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>