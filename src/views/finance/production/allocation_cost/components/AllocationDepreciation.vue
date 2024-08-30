<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';
    import { useRouter } from 'vue-router';

    // API ========================================================================================================================================================
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import { cek_token } from "@/api/DataVariable.js";
    import { postData_PenyusutanBiayaController, loadLatest_PenyusutanBiayaController, add_PenyusutanBiayaController, update_PenyusutanBiayaController } from '@/controller/master_data/PenyusutanBiayaController.js'
    import { loadAll_AllocMaster } from '@/controller/master_data/AllocController.js'

    const props = defineProps({
        // tanggal:{
        //     type:String
        // },
        datas:{
            type:Array,
            default: () => {}
        }
    });

    const router = useRouter();

    // VARIABLE
    const loadingTable = ref(false)
    const loadingButton = ref(false)
    const load = ref([])
    const total_data = ref({
        unit_qty: 0, unit_persen: 0, aux_qty: 0, aux_persen: 0, alloc_qty: 0, alloc_persen: 0
    })
    const tanggal = ref(moment().format('YYYY-MM-DD'));

    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const data_form = ref([]);
    const title_dialog = ref('');

    // Message Configure
    const messages = ref([]);
    let count = ref(0);
    const time = ref(3000)

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadDataPenyusutan()
    });

    const loadDataPenyusutan = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            const data = response.find(item => item.name == 'list_biaya_peyusutan')
            load.value = data.item
            total_data.value = {
                unit_qty: data.total.unit_qty,
                unit_persen: data.total.unit_persen,
                aux_qty: data.total.aux_qty,
                aux_persen: data.total.aux_persen,
                alloc_qty: data.total.alloc_qty,
                alloc_persen: data.total.alloc_persen,
            }
            loadingTable.value = false
        } catch (error) {
            load.value = {}
            loadingTable.value = false
        }
    }

    const formData = async(cond) => {
        const param = await paramAlloc()
        const data = load.value;
        const list = []
        for (let i = 0; i < param.length; i++) {
            const filter = data.find(item => item.name == param[i].alokasi_name)
            list.push({
                id: filter.id,
                alokasi_id: param[i].alokasi_id,
                alokasi_name: param[i].alokasi_name,
                tanggal: param[i].tanggal,
                value: filter.id == null ? null : filter.unit_qty,
            })
        }
        data_form.value = list
        console.log(list)
        // if (cond == 'add') {
        // } else {
        // }
        visible.value = true;
        messages.value = [];
        status_form.value = cond;
        loadingButton.value = false
        title_dialog.value = 'Allocation Depreciation - Update Data';
    }

    const paramAlloc = async() => {
        const response = await loadAll_AllocMaster()
        const list = []
        if (response != null) {
            const filter = response.filter(item => item.nama.toLowerCase().includes('refinery') || item.nama.toLowerCase().includes('packaging') || item.nama.toLowerCase().includes('fraksinasi') || item.nama.toLowerCase().includes('auxiliary'));
            for (let i = 0; i < filter.length; i++) {
                list.push({
                    id: null,
                    alokasi_id: filter[i].id,
                    alokasi_name: filter[i].nama,
                    tanggal: moment().format('YYYY-MM-DD'),
                    value: null,
                })
            }
        }
        return list;
    }

    const postData = async() => {
        loadingButton.value = true
        try {
            console.log(data_form.value)
            const response = await postData_PenyusutanBiayaController(data_form.value, tanggal.value)
            messages.value = [
                { severity: response.severity, content: response.content, id: count.value++ },
            ];
            setTimeout(function() {
                visible.value = false;
                router.push('/alloc-cost')
            }, 2000);
            loadingButton.value = false
        } catch (error) {
            messages.value = [
                { severity: 'error', content: 'Proses gagal, silahkan dicoba beberapa saat lagi.', id: count.value++ },
            ];
            loadingButton.value = false
        }
    }

</script>

<template>
    <div class="flex flex-column gap-3">
        <!-- Dialog -->
        <Dialog v-model:visible="visible" :closable="false" modal :header="title_dialog" :style="{ width: '70rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
                <div class="flex w-full flex-column gap-4">
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon bg-white">
                            <i class="pi pi-calendar"></i>
                        </span>
                        <InputText id="tanggal" v-model="tanggal" type="date" class="w-full" autocomplete="off" :max="moment().format('YYYY-MM-DD')"/>
                    </div>
                    <div class="flex flex-column gap-2 border-round border-2 border-gray-300 p-3">
                        <span class="uppercase text-sm font-light">Allocation : </span>
                        <div v-for="(item, index) in data_form" :key="index" class="flex justify-content-between gap-4 border-bottom-1 py-2 border-gray-300 align-items-center">
                            <span class="font-bold font-italic text-lg w-full">{{ item.alokasi_name }} <small class="text-red-500">*</small></span>
                            <InputNumber v-model="item.value" :maxFractionDigits="2" inputId="locale-german" placeholder="Qty Unit" locale="de-DE" class="w-full" />
                        </div>
                    </div>
                    <div class="flex justify-content-end gap-2">
                        <Button label="Close" severity="secondary" outlined @click="visible = false"/>
                        <Button :disabled="loadingButton == true ? true : false" :label="loadingButton == false ? 'Save' : 'Saving...'" severity="success" @click="postData"/>
                    </div>
                </div>
            </transition-group>
        </Dialog>
        <div class="flex justify-content-between align-items-center gap-2 w-full">
            <span class="w-full text-xl font-italic text-gray-500 font-semibold capitalize">Allocation depreciation</span>
            <div v-if="cek_token != null" class="w-full flex justify-content-end">
                <Button icon="pi pi-pencil" label="Update Data" severity="warning" size="small" @click="formData('add', null)" />
            </div>
        </div>
        <div class="w-full">
            <DataTable :value="load" class="text-sm" showGridlines tableStyle="min-width: 50rem">
                <ColumnGroup type="header">
                    <Row>
                        <Column header="Alokasi Biaya Penyusutan" :rowspan="2" />
                        <Column :colspan="2">
                            <template #header>
                                <div class="w-full flex justify-content-center"><span>Unit</span></div>
                            </template>
                        </Column>
                        <Column :colspan="2">
                            <template #header>
                                <div class="w-full flex justify-content-center"><span>Auxiliary</span></div>
                            </template>
                        </Column>
                        <Column :colspan="2">
                            <template #header>
                                <div class="w-full flex justify-content-center"><span>Allocation</span></div>
                            </template>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <template #header><div class="w-full flex justify-content-center"><span>Qty</span></div></template>
                        </Column>
                        <Column>
                            <template #header><div class="w-full flex justify-content-center"><span>%</span></div></template>
                        </Column>
                        <Column>
                            <template #header><div class="w-full flex justify-content-center"><span>Qty</span></div></template>
                        </Column>
                        <Column>
                            <template #header><div class="w-full flex justify-content-center"><span>%</span></div></template>
                        </Column>
                        <Column>
                            <template #header><div class="w-full flex justify-content-center"><span>Qty</span></div></template>
                        </Column>
                        <Column>
                            <template #header><div class="w-full flex justify-content-center"><span>%</span></div></template>
                        </Column>
                    </Row>
                </ColumnGroup>
                <Column field="name" />
                <Column field="name">
                    <template #body="slotProps"> 
                        <div class="flex w-full justify-content-end">{{ formatCurrency(Number(slotProps.data.unit_qty).toFixed(0) )}}</div>
                    </template>
                </Column>
                <Column field="name">
                    <template #body="slotProps"> 
                        <div class="flex w-full justify-content-end">{{ Number(slotProps.data.unit_persen).toFixed(2) }}%</div>
                    </template>
                </Column>
                <Column field="name">
                    <template #body="slotProps"> 
                        <div class="flex w-full justify-content-end">{{ formatCurrency(Number(slotProps.data.aux_qty).toFixed(0) )}}</div>
                    </template>
                </Column>
                <Column field="name">
                    <template #body="slotProps"> 
                        <div class="flex w-full justify-content-end">{{ Number(slotProps.data.aux_persen).toFixed(2) }}%</div>
                    </template>
                </Column>
                <Column field="name">
                    <template #body="slotProps"> 
                        <div class="flex w-full justify-content-end">{{ formatCurrency(Number(slotProps.data.alloc_qty).toFixed(0) )}}</div>
                    </template>
                </Column>
                <Column field="name">
                    <template #body="slotProps"> 
                        <div class="flex w-full justify-content-end">{{ Number(slotProps.data.alloc_persen).toFixed(2) }}%</div>
                    </template>
                </Column>
                <ColumnGroup type="footer">
                    <Row>
                        <Column>
                            <template #footer>
                                <small class="font-bold font-italic uppercase">Total Penyusutan</small>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ formatCurrency(Number(total_data.unit_qty).toFixed(0)) }}</small>
                                </div>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ Number(total_data.unit_persen).toFixed(2) }}%</small>
                                </div>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ formatCurrency(Number(total_data.aux_qty).toFixed(0)) }}</small>
                                </div>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ Number(total_data.aux_persen).toFixed(2) }}%</small>
                                </div>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ formatCurrency(Number(total_data.alloc_qty).toFixed(0)) }}</small>
                                </div>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ Number(total_data.alloc_persen).toFixed(2) }}%</small>
                                </div>
                            </template>
                        </Column>
                    </Row>
                    </ColumnGroup>
            </DataTable>
        </div>
    </div>
</template>