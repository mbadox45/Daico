<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps } from 'vue';
    import moment from 'moment';
    
    // API ========================================================================================================================================================
    import { URL_WEB } from '@/api/DataVariable';
    import {m_router, levy_duty} from '@/api/dummy/variable_form.js'
    import {loadAll_BulkyMarketMaster} from '@/controller/master_data/BulkyMarketController.js'
    import {postDataMarketValue_ProCostController} from '@/controller/retail/ProCostController.js'
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import { cek_token } from "@/api/DataVariable.js";

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
    const products = ref([]);
    const op = ref();
    const list_currency = ref([{id:2, name:'$ USD'}]);
    const list_bulk = ref([]);
    const loadingTable = ref(false)
    const loadingButton = ref(false)
    const period = ref()
    
    // Dialog Configure
    const visible = ref(false);
    const messages = ref([]);
    const status_form = ref('add');
    const forms_router = ref(m_router)
    const forms_levy = ref(levy_duty)
    const title_dialog = ref('');
    let count = ref(0);
    const time = ref(3000)


    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
        loadBulky()
    });
    
    const loadData = async() => {
        const response = props.datas;
        products.value = response
    }
    
    const loadBulky = async() => {
        const response = await loadAll_BulkyMarketMaster()
        const list = []
        if (response != null) {
            for (let a = 0; a < response.length; a++) {
                if (response[a].id === 2 || response[a].id === 3 || response[a].id === 4 || response[a].id === 5 ) {
                    list.push({
                        id:response[a].id,
                        name:response[a].name,
                    })
                }
            }
            list_bulk.value = list;
        } else {
            list_bulk.value = [];
        }
    }

    const formDatabase = (cond, data) => {
        messages.value = []
        visible.value = true
        status_form.value = cond;
        loadingButton.value = false
        title_dialog.value = 'Form Market Value' ;
        if (cond == 'add') {
            addForms()
        } else {
            editForms(data)
        }
    }

    const editForms = (data) => {
        const listLevy = [
            {cond: data.pfad.levy.id == null ? 'add' : 'edit', id: data.pfad.levy.id, currency_id: 2, id_bulky: 2, nilai: data.pfad.levy.nilai == null ? null : Number(data.pfad.levy.nilai), tanggal: data.tanggal},
            {cond: data.rbdpo.levy.id == null ? 'add' : 'edit', id: data.rbdpo.levy.id, currency_id: 2, id_bulky: 3, nilai: data.rbdpo.levy.nilai == null ? null : Number(data.rbdpo.levy.nilai), tanggal: data.tanggal},
            {cond: data.rbdo.levy.id == null ? 'add' : 'edit', id: data.rbdo.levy.id, currency_id: 2, id_bulky: 4, nilai: data.rbdo.levy.nilai == null ? null : Number(data.rbdo.levy.nilai), tanggal: data.tanggal},
            {cond: data.rbds.levy.id == null ? 'add' : 'edit', id:data.rbds.levy.id, currency_id: 2, id_bulky: 5, nilai: data.rbds.levy.nilai == null ? null : Number(data.rbds.levy.nilai), tanggal: data.tanggal},
        ]
        console.log(listLevy)
        const listRouters = [
            {cond: data.pfad.routers.id == null ? 'add' : 'edit', id: data.pfad.routers.id, currency_id: 2, id_bulky: 2, nilai: data.pfad.routers.nilai == null ? null : Number(data.pfad.routers.nilai), tanggal: data.tanggal},
            {cond: data.rbdpo.routers.id == null ? 'add' : 'edit', id: data.rbdpo.routers.id, currency_id: 2, id_bulky: 3, nilai: data.rbdpo.routers.nilai == null ? null : Number(data.rbdpo.routers.nilai), tanggal: data.tanggal},
            {cond: data.rbdo.routers.id == null ? 'add' : 'edit', id: data.rbdo.routers.id, currency_id: 2, id_bulky: 4, nilai: data.rbdo.routers.nilai == null ? null : Number(data.rbdo.routers.nilai), tanggal: data.tanggal},
            {cond: data.rbds.routers.id == null ? 'add' : 'edit', id:data.rbds.routers.id, currency_id: 2, id_bulky: 5, nilai: data.rbds.routers.nilai == null ? null : Number(data.rbds.routers.nilai), tanggal: data.tanggal},
        ]
        console.log(listRouters)

        forms_levy.value = []
        forms_router.value = []
        for (let i = 0; i < list_bulk.value.length; i++) {
            const levyduties = listLevy.find(item => item.id_bulky == list_bulk.value[i].id);
            forms_levy.value.push({
                cond: levyduties.cond, id: levyduties.id, currency_id: levyduties.currency_id, id_bulky: levyduties.id_bulky, nilai: levyduties.nilai, tanggal: levyduties.tanggal, name_bulk: list_bulk.value[i].name
            })
            const markRouter = listRouters.find(item => item.id_bulky == list_bulk.value[i].id);
            forms_router.value.push({
                cond: markRouter.cond, id: markRouter.id, currency_id: markRouter.currency_id, id_bulky: markRouter.id_bulky, nilai: markRouter.nilai, tanggal: markRouter.tanggal, name_bulk: list_bulk.value[i].name
            })
        }
    }

    const addForms = () => {
        const data = list_bulk.value;
        const f_router = []
        const f_levy = []
        for (let a = 0; a < data.length; a++) {
            f_router[a] = {
                cond: 'add',
                id: null,
                id_bulky: data[a].id,
                name_bulk: data[a].name,
                tanggal: moment().format('YYYY-MM-DD'),
                currency_id: 2,
                nilai: null,
            };
            f_levy[a] = {
                cond: 'add',
                id: null,
                id_bulky: data[a].id,
                name_bulk: data[a].name,
                tanggal: moment().format('YYYY-MM-DD'),
                currency_id: 2,
                nilai: null,
            };
        }
        forms_levy.value = f_levy
        forms_router.value = f_router
    }

    const postData = async() => {
        loadingButton.value = true
        const routers = forms_router.value
        const levy = forms_levy.value
        const data_table = products.value
        const response = await postDataMarketValue_ProCostController(routers, levy, data_table);
        messages.value = [
            { severity: response.severity, content: response.content, id: count.value++ }
        ];

        if (response.severity == 'success') {
            setTimeout(function() {
                visible.value = false
                window.location.replace(`${URL_WEB}prop-cost`);
                loadingButton.value = false
            }, time.value);
        } else {
            loadingButton.value = false
        }
    }
</script>

<template>
    <div class="flex flex-column gap-3 w-full">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-full flex gap-2">
                <span class="uppercase text-xl text-cyan-700 font-medium">Market Value</span>
            </div>
            <div :class="cek_token == null ? 'hidden' : 'flex'" class="w-full justify-content-end">
                <Button icon="pi pi-plus font-bold" severity="info" size="small" @click="formDatabase('add', null)" outlined class="h-2rem w-2rem"/>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :style="{ width: '85rem' }" :closable="false">
            <template #header>
                <div class="w-full flex flex-column">
                    <span class="text-lg font-medium uppercase">{{ title_dialog }}</span>
                    <transition-group name="p-message" tag="div">
                        <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
                    </transition-group>
                </div>
            </template>
            <div class="flex gap-6">
                <div class="w-full flex flex-column gap-3 border-1 border-gray-300 p-3 border-round">
                    <div class="w-full text-right">
                        <span class="font-medium text-xl">Market Routers</span>
                    </div>
                    <div v-for="(routers, index) in forms_router" :key="index">
                        <Divider class="font-medium" align="center">{{ routers.name_bulk }}</Divider>
                        <div class="flex align-items-center gap-3 mb-3">
                            <label for="date" class="font-semibold w-6rem">Date <small class="text-red-500">*</small></label>
                            <InputText id="date" type="date" class="flex-auto" autocomplete="off" v-model="routers.tanggal" :max="moment().format('YYYY-MM-DD')"/>
                        </div>
                        <div class="flex align-items-center gap-3 mb-5">
                            <label for="email" class="font-semibold w-6rem">Currency <small class="text-red-500">*</small></label>
                            <Dropdown :options="list_currency" filter optionLabel="name" disabled optionValue="id" placeholder="Select a Currency" class="flex-auto" v-model="routers.currency_id" ></Dropdown>
                        </div>
                        <div class="flex align-items-center gap-3 mb-3">
                            <label for="value" class="font-semibold w-6rem">Value <small class="text-red-500">*</small></label>
                            <InputNumber v-model="routers.nilai" class="flex-auto" inputId="locale-german" locale="de-DE" :maxFractionDigits="2" />
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-column gap-3 border-1 border-gray-300 p-3 border-round">
                    <div class="w-full text-right">
                        <span class="font-medium text-xl">Levy + Duty</span>
                    </div>
                    <div v-for="(item, index) in forms_levy" :key="index">
                        <Divider class="font-medium" align="center">{{ item.name_bulk }}</Divider>
                        <div class="flex align-items-center gap-3 mb-3">
                            <label for="date" class="font-semibold w-6rem">Date <small class="text-red-500">*</small></label>
                            <InputText id="date" type="date" class="flex-auto" autocomplete="off" v-model="item.tanggal" :max="moment().format('YYYY-MM-DD')"/>
                        </div>
                        <div class="flex align-items-center gap-3 mb-5">
                            <label for="email" class="font-semibold w-6rem">Currency <small class="text-red-500">*</small></label>
                            <Dropdown :options="list_currency" filter optionLabel="name" disabled optionValue="id" placeholder="Select a Currency" class="flex-auto"  v-model="item.currency_id" ></Dropdown>
                        </div>
                        <div class="flex align-items-center gap-3 mb-3">
                            <label for="value" class="font-semibold w-6rem">Value <small class="text-red-500">*</small></label>
                            <InputNumber v-model="item.nilai" class="flex-auto" :maxFractionDigits="2" inputId="locale-german" locale="de-DE"/>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-content-end gap-2 mt-3">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false" :disabled="loadingButton == true ? true : false"></Button>
                    <Button type="button" :label="loadingButton == true ? 'Saving...' : 'Save'" @click="postData()" :disabled="loadingButton == true ? true : false"></Button>
                </div>
            </template>
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
        <DataTable v-else :value="products" showGridlines  scrollHeight="430px" dataKey="id" scrollable :globalFilterFields="['date']">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <ColumnGroup type="header">
                <Row>
                    <Column header="Date" :rowspan="2" frozen sortable/>
                    <!-- RBD O -->
                    <Column sortable field="qty" headerStyle="background-color:#F9E79F; border-color:white;">
                        <template #header>
                            <small>Market Routers (USD)</small>
                        </template>
                    </Column>
                    <Column sortable field="harga" headerStyle="background-color:#F9E79F; border-color:white;">
                        <template #header>
                            <small>Levy + Duty</small>
                        </template>
                    </Column>
                    <Column sortable field="value" headerStyle="background-color:#F9E79F; border-color:white;">
                        <template #header>
                            <small>Market Excld Levy & Duty (USD)</small>
                        </template>
                    </Column>
                    <!-- RBD S -->
                    <Column sortable field="qty" headerStyle="background-color:#D6EAF8; border-color:white;">
                        <template #header>
                            <small>Market Routers (USD)</small>
                        </template>
                    </Column>
                    <Column sortable field="harga" headerStyle="background-color:#D6EAF8; border-color:white;">
                        <template #header>
                            <small>Levy + Duty</small>
                        </template>
                    </Column>
                    <Column sortable field="value" headerStyle="background-color:#D6EAF8; border-color:white;">
                        <template #header>
                            <small>Market Excld Levy & Duty (USD)</small>
                        </template>
                    </Column>
                    <!-- PFAD -->
                    <Column sortable field="qty" headerStyle="background-color:#FAE5D3; border-color:white;">
                        <template #header>
                            <small>Market Routers (USD)</small>
                        </template>
                    </Column>
                    <Column sortable field="harga" headerStyle="background-color:#FAE5D3; border-color:white;">
                        <template #header>
                            <small>Levy + Duty</small>
                        </template>
                    </Column>
                    <Column sortable field="value" headerStyle="background-color:#FAE5D3; border-color:white;">
                        <template #header>
                            <small>Market Excld Levy & Duty (USD)</small>
                        </template>
                    </Column>
                    <!-- RBDPO -->
                    <Column sortable field="qty" headerStyle="background-color:#F2D7D5; border-color:white;">
                        <template #header>
                            <small>Market Routers (USD)</small>
                        </template>
                    </Column>
                    <Column sortable field="harga" headerStyle="background-color:#F2D7D5; border-color:white;">
                        <template #header>
                            <small>Levy + Duty</small>
                        </template>
                    </Column>
                    <Column sortable field="value" headerStyle="background-color:#F2D7D5; border-color:white;">
                        <template #header>
                            <small>Market Excld Levy & Duty (USD)</small>
                        </template>
                    </Column>
                    <Column header="Rate (Jisdor)" :rowspan="2"/>
                    <Column :colspan="5">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <small>Market (IDR)</small>
                            </div>
                        </template>
                    </Column>
                </Row>
                <Row>
                    <Column :colspan="3" headerStyle="background-color:#F9E79F; border-color:white;">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <small>RBD Olein</small>
                            </div>
                        </template>
                    </Column>
                    <Column :colspan="3" headerStyle="background-color:#D6EAF8; border-color:white;">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <small>RBD Stearin</small>
                            </div>
                        </template>
                    </Column>
                    <Column :colspan="3" headerStyle="background-color:#FAE5D3; border-color:white;">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <small>PFAD</small>
                            </div>
                        </template>
                    </Column>
                    <Column :colspan="3" headerStyle="background-color:#F2D7D5; border-color:white;">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <small>RBDPO</small>
                            </div>
                        </template>
                    </Column>

                    <!-- Market IDR -->
                    <Column headerStyle="background-color:#F9E79F;">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <span>RBD Olein</span>
                            </div>
                        </template>
                    </Column>
                    <Column headerStyle="background-color:#D6EAF8;">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <span>RBD Stearin</span>
                            </div>
                        </template>
                    </Column>
                    <Column headerStyle="background-color:#FAE5D3;">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <span>PFAD</span>
                            </div>
                        </template>
                    </Column>
                    <Column headerStyle="background-color:#F2D7D5;">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <span>RBDPO</span>
                            </div>
                        </template>
                    </Column>
                    <Column headerStyle="background-color:#D5D8DC;">
                        <template #header>
                            <div class="text-center w-full flex justify-content-center">
                                <span>CPO KPBN</span>
                            </div>
                        </template>
                    </Column>
                </Row>
            </ColumnGroup>
            
            <Column field="date" style="min-width: 13rem;" frozen>
                <template #body="{ data }">
                    <div class="flex justify-content-between align-items-center gap-2">
                        <strong class="text-sm w-full">{{ data.date }}</strong>
                        <Button v-if="cek_token != null" icon="pi pi-pencil" severity="warning" text @click="formDatabase('edit',data)"/>
                    </div>
                </template>
            </Column>

            <!-- RBD Olein -->
            <Column field="routers" style="min-width: 13rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdo.routers.nilai == null ? '-' : formatCurrency(data.rbdo.routers.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="levy" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdo.levy.nilai == null ? '-' : formatCurrency(data.rbdo.levy.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="value" style="min-width: 17rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdo.eXclude == null ? '-' : formatCurrency(data.rbdo.eXclude) }}</small>
                    </div>
                </template>
            </Column>
            <!-- RBD Stearin -->
            <Column field="routers" style="min-width: 13rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbds.routers.nilai == null ? '-' : formatCurrency(data.rbds.routers.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="levy" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbds.levy.nilai == null ? '-' : formatCurrency(data.rbds.levy.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="value" style="min-width: 17rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbds.eXclude == null ? '-' : formatCurrency(data.rbds.eXclude) }}</small>
                    </div>
                </template>
            </Column>
            <!-- PFAD -->
            <Column field="routers" style="min-width: 13rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.pfad.routers.nilai == null ? '-' : formatCurrency(data.pfad.routers.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="levy" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.pfad.levy.nilai == null ? '-' : formatCurrency(data.pfad.levy.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="value" style="min-width: 17rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.pfad.eXclude == null ? '-' : formatCurrency(data.pfad.eXclude) }}</small>
                    </div>
                </template>
            </Column>
            <!-- RBDPO -->
            <Column field="routers" style="min-width: 13rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdpo.routers.nilai == null ? '-' : formatCurrency(data.rbdpo.routers.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="levy" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdpo.levy.nilai == null ? '-' : formatCurrency(data.rbdpo.levy.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="value" style="min-width: 17rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdpo.eXclude == null ? '-' : formatCurrency(data.rbdpo.eXclude) }}</small>
                    </div>
                </template>
            </Column>
            <!-- Jisdor -->
            <Column field="jisdor" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>IDR</small>
                        <small>{{ data.jisdor == null ? '-' : formatCurrency(Number(data.jisdor).toFixed(2)) }}</small>
                    </div>
                </template>
            </Column>
            <!-- Market -->
            <Column field="jisdor" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>IDR</small>
                        <small>{{ data.rbdo.market == null ? '-' : formatCurrency(Number(data.rbdo.market).toFixed(2)) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="jisdor" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>IDR</small>
                        <small>{{ data.rbds.market == null ? '-' : formatCurrency(Number(data.rbds.market).toFixed(2)) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="jisdor" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>IDR</small>
                        <small>{{ data.pfad.market == null ? '-' : formatCurrency(Number(data.pfad.market).toFixed(2)) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="jisdor" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>IDR</small>
                        <small>{{ data.rbdpo.market == null ? '-' : formatCurrency(Number(data.rbdpo.market).toFixed(2)) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="jisdor" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>IDR</small>
                        <small>{{ data.cpo_kpbn != null ? formatCurrency(Number(data.cpo_kpbn).toFixed(2)) : '-'}}</small>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>