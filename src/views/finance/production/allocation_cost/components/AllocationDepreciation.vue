<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import { cek_token } from "@/api/DataVariable.js";
    import { loadLatest_PenyusutanBiayaController, add_PenyusutanBiayaController, update_PenyusutanBiayaController } from '@/controller/master_data/PenyusutanBiayaController.js'
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

    // VARIABLE
    const loadingTable = ref(false)
    const load = ref([])
    const total_data = ref({
        unit_qty: 0, unit_persen: 0, aux_qty: 0, aux_persen: 0, alloc_qty: 0, alloc_persen: 0
    })

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
            // console.log(data)
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

    const formData = async(cond, data) => {
        const param = await paramAlloc()
        if (cond == 'add') {
            const list = []
            for (let i = 0; i < param.length; i++) {
                list.push({
                    id: param[i].id,
                    alokasi_id: param[i].alokasi_id,
                    tanggal: param[i].tanggal,
                    value: param[i].value,
                })
            }
            data_form.value = list
        } else {
        }
        visible.value = true;
        messages.value = [];
        status_form.value = cond;
        title_dialog.value = cond == 'add' ? 'Allocation Depreciation - Tambah Data' : cond == 'edit' ? 'Allocation Depreciation - Edit Data' : 'Allocation Depreciation - Hapus Data' ;
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
                    tanggal: moment().format('YYYY-MM-DD'),
                    value: null,
                })
            }
        }
        return list;
    }

</script>

<template>
    <div class="flex flex-column gap-3">
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '70rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
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