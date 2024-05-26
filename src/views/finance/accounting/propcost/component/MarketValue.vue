<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {database} from '@/api/DummyData.js'
    import {m_router, levy_duty} from '@/api/dummy/variable_form.js'
    import CurrencyOdoo from '@/api/odoo_api/currency/CurrencyOdoo.js';
    import BulkyMaster from '@/api/master/BulkyMaster.js';
    import MarketRouters from '@/api/market_value/MarketRouters.js';
    import LevyDuty from '@/api/market_value/LevyDuty.js';
    import RateOdoo from '@/api/odoo_api/currency/RateOdoo.js';
    import KpbnCpo from '@/api/cpo/KpbnCpo.js';

    // VARIABLE
    const products = ref([]);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const list_bulan = ref([]);
    const bulan = ref(Number(moment().format('M')));
    const tahun = ref(Number(moment().format('yyyy')));
    const tgls = ref(moment().format('DD'))
    const list_tahun = ref([]);
    const op = ref();
    const list_currency = ref([]);
    const list_bulk = ref([]);
    const loadingTable = ref(false)
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
        loadTahun();
        loadBulan();
        loadCurrency()
        loadBulky()
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
        let dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tgls.value}`;
        try {
            loadingTable.value = true
            let final_date_in_this_month = moment(dateString).endOf('month').format('DD')
            
            let days;
            if (moment(dateString).format('YYYY-MM') == moment().format('YYYY-MM') ) {
                const dates = Number(moment(dateString).format('D'));
                if (dates == 1) {
                    const months = Number(moment(dateString).format('M'));
                    if (months == 1) {
                        const years = Number(moment(dateString).format('YYYY')) - 1;
                        const tanggalan =  moment(`${years}-${(Number(months)-1).toString().padStart(2, '0')}-01`).endOf('month').format('DD')
                        dateString = `${years}-${(Number(months)-1).toString().padStart(2, '0')}-${tanggalan}`
                        days = Number(tanggalan);
                        
                    } else {
                        dateString = `${tahun.value}-${months.toString().padStart(2, '0')}-${(dates - 1).toString().padStart(2, '0')}`;
                        days = Number(moment(dateString).format('D'));
                    }
                } else {
                    // dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tgls.value}`;
                    dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${(Number(tgls.value)).toString().padStart(2, '0')}`;
                    days = Number(moment(dateString).format('D'));
                }
            } else {
                const tanggalan =  moment(`${tahun.value}-${bulan.value.toString().padStart(2, '0')}-01`).endOf('month').format('DD')
                dateString = `${tahun.value}-${bulan.value.toString().padStart(2, '0')}-${tanggalan}`;
                days = Number(tanggalan);
            }

            // Rate Jisdor (Odoo API)
            const res_jisdor = await RateOdoo.postRate({tanggal:dateString, mata_uang:'USD'});
            const load_jisdor = res_jisdor.data;
            const data_jisdor = load_jisdor.data;
            
            // routers
            const data_routers = await loadM_Router(dateString);
            // levy+duty
            const data_levy = await loadLevyDuty(dateString);
            // cpo kpbn
            const cpo = await loadAvgCPO(dateString);

            const list = []
            for (let i = 0; i < days; i++) {

                // cpo
                const cpo_kpbn = cpo == null ? null : cpo.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}`)

                // Jisdor
                const jisdor = data_jisdor == null ? null : data_jisdor.find(item => item.name == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}`)
    
                // Filter Data By Date & Bulk ID
                // market routers
                const rm_pfad = data_routers == null ? null : data_routers.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}` && item.id_bulky == 2)
                const rm_rbdpo = data_routers == null ? null : data_routers.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}` && item.id_bulky == 3)
                const rm_rbdo = data_routers == null ? null : data_routers.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}` && item.id_bulky == 4)
                const rm_rbds = data_routers == null ? null : data_routers.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+ (i+1)}` && item.id_bulky == 5)
                // levy duty
                const ld_pfad = data_levy == null ? null : data_levy.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}` && item.id_bulky == 2)
                const ld_rbdpo = data_levy == null ? null : data_levy.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}` && item.id_bulky == 3)
                const ld_rbdo = data_levy == null ? null : data_levy.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}` && item.id_bulky == 4)
                const ld_rbds = data_levy == null ? null : data_levy.find(item => item.tanggal == `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}` && item.id_bulky == 5)
    
                // console.log(dr, dl)
                list[i] = {
                    date: `${(i+1) > 9 ? (i+1) : '0' + (i+1)}-${moment(dateString).format('MMM YYYY')}`,
                    tanggal: `${moment(dateString).format('YYYY-MM')}-${(i+1) > 9 ? (i+1) : '0'+(i+1)}`,
                    jisdor: jisdor == null ? null : jisdor.rate,
                    cpo_kpbn: cpo_kpbn == null ? null : cpo_kpbn.avg,
                    pfad: {
                        routers: {
                            id: rm_pfad == null ? null : rm_pfad.id,
                            id_bulky: rm_pfad == null ? null : rm_pfad.id_bulky,
                            nilai: rm_pfad == null ? null : rm_pfad.nilai,
                            tanggal: rm_pfad == null ? null : rm_pfad.tanggal,
                            currency_id: rm_pfad == null ? null : rm_pfad.currency_id,
                            created_at: rm_pfad == null ? null : rm_pfad.created_at,
                            updated_at: rm_pfad == null ? null : rm_pfad.updated_at,
                        },
                        levy: {
                            id: ld_pfad == null ? null : ld_pfad.id,
                            id_bulky: ld_pfad == null ? null : ld_pfad.id_bulky,
                            nilai: ld_pfad == null ? null : ld_pfad.nilai,
                            tanggal: ld_pfad == null ? null : ld_pfad.tanggal,
                            currency_id: ld_pfad == null ? null : ld_pfad.currency_id,
                            created_at: ld_pfad == null ? null : ld_pfad.created_at,
                            updated_at: ld_pfad == null ? null : ld_pfad.updated_at,
                        }
                    },
                    rbdpo: {
                        routers: {
                            id: rm_rbdpo == null ? null : rm_rbdpo.id,
                            id_bulky: rm_rbdpo == null ? null : rm_rbdpo.id_bulky,
                            nilai: rm_rbdpo == null ? null : rm_rbdpo.nilai,
                            tanggal: rm_rbdpo == null ? null : rm_rbdpo.tanggal,
                            currency_id: rm_rbdpo == null ? null : rm_rbdpo.currency_id,
                            created_at: rm_rbdpo == null ? null : rm_rbdpo.created_at,
                            updated_at: rm_rbdpo == null ? null : rm_rbdpo.updated_at,
                        },
                        levy: {
                            id: ld_rbdpo == null ? null : ld_rbdpo.id,
                            id_bulky: ld_rbdpo == null ? null : ld_rbdpo.id_bulky,
                            nilai: ld_rbdpo == null ? null : ld_rbdpo.nilai,
                            tanggal: ld_rbdpo == null ? null : ld_rbdpo.tanggal,
                            currency_id: ld_rbdpo == null ? null : ld_rbdpo.currency_id,
                            created_at: ld_rbdpo == null ? null : ld_rbdpo.created_at,
                            updated_at: ld_rbdpo == null ? null : ld_rbdpo.updated_at,
                        }
                    },
                    rbdo: {
                        routers: {
                            id: rm_rbdo == null ? null : rm_rbdo.id,
                            id_bulky: rm_rbdo == null ? null : rm_rbdo.id_bulky,
                            nilai: rm_rbdo == null ? null : rm_rbdo.nilai,
                            tanggal: ld_rbdo == null ? null : ld_rbdo.tanggal,
                            currency_id: rm_rbdo == null ? null : rm_rbdo.currency_id,
                            created_at: rm_rbdo == null ? null : rm_rbdo.created_at,
                            updated_at: rm_rbdo == null ? null : rm_rbdo.updated_at,
                        },
                        levy: {
                            id: ld_rbdo == null ? null : ld_rbdo.id,
                            id_bulky: ld_rbdo == null ? null : ld_rbdo.id_bulky,
                            nilai: ld_rbdo == null ? null : ld_rbdo.nilai,
                            tanggal: ld_rbdo == null ? null : ld_rbdo.tanggal,
                            currency_id: ld_rbdo == null ? null : ld_rbdo.currency_id,
                            created_at: ld_rbdo == null ? null : ld_rbdo.created_at,
                            updated_at: ld_rbdo == null ? null : ld_rbdo.updated_at,
                        }
                    },
                    rbds: {
                        routers: {
                            id: rm_rbds == null ? null : rm_rbds.id,
                            id_bulky: rm_rbds == null ? null : rm_rbds.id_bulky,
                            nilai: rm_rbds == null ? null : rm_rbds.nilai,
                            tanggal: rm_rbds == null ? null : rm_rbds.tanggal,
                            currency_id: rm_rbds == null ? null : rm_rbds.currency_id,
                            created_at: rm_rbds == null ? null : rm_rbds.created_at,
                            updated_at: rm_rbds == null ? null : rm_rbds.updated_at,
                        },
                        levy: {
                            id: ld_rbds == null ? null : ld_rbds.id,
                            id_bulky: ld_rbds == null ? null : ld_rbds.id_bulky,
                            nilai: ld_rbds == null ? null : ld_rbds.nilai,
                            tanggal: rm_rbds == null ? null : rm_rbds.tanggal,
                            currency_id: ld_rbds == null ? null : ld_rbds.currency_id,
                            created_at: ld_rbds == null ? null : ld_rbds.created_at,
                            updated_at: ld_rbds == null ? null : ld_rbds.updated_at,
                        }
                    },
                }
            }
            // console.log(list);
            products.value = list;
            period.value = dateString;
            loadingTable.value = false
        } catch (error) {
            period.value = dateString;
            loadingTable.value = false
            products.value = []
        }
    }

    const formDatabase = (cond, data) => {
        messages.value = []
        visible.value = true
        status_form.value = cond;
        console.log(data)
        title_dialog.value = 'Form Market Value' ;
        if (cond == 'add') {
            addForms()
        } else {
            editForms(data)
        }
        console.log(forms_levy.value)
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

    const loadCurrency = async() => {
        try {
            list_currency.value = []
            const response = await CurrencyOdoo.getAll();
            const load = response.data;
            const data = load.data;
            for (let i = 0; i < data.length; i++) {
                list_currency.value.push({
                    id: data[i].id,
                    name: `${data[i].name} (${data[i].symbol})`,
                })
            }
        } catch (error) {
            list_currency.value = []
        }
    }

    const loadBulky = async() => {
        try {
            list_bulk.value = [];
            const response = await BulkyMaster.getAll()
            const load = response.data;
            const data = load.mBulky;
            for (let a = 0; a < data.length; a++) {
                list_bulk.value.push({
                    id:data[a].id,
                    name:data[a].name,
                })
            }
        } catch (error) {
            list_bulk.value = []
        }
    }

    const opByPeriod = (event) => {
        op.value.toggle(event);

    }

    const loadByPeriod = () => {
        op.value.toggle();
        loadData()
    }

    const loadAvgCPO = async(tgl) => {
        try {
            const response = await KpbnCpo.getByDate({tanggal: tgl})
            const load = response.data;
            const data = load.data;
            return data
        } catch (error) {
            return null;
        }
    }

    const loadM_Router = async(tgl) => {
        try {
            const res_routers = await MarketRouters.getByDate({tanggal:tgl})
            const load_routers = res_routers.data;
            const data_routers = load_routers.data;
            return data_routers
        } catch (error) {
            return null;
        }
    }

    const loadLevyDuty = async(tgl) => {
        try {
            const res_levy = await LevyDuty.getByDate({tanggal:tgl})
            const load_levy = res_levy.data;
            const data_levy = load_levy.data;
            return data_levy
        } catch (error) {
            return null
        }
    }

    const formatCurrency = (amount) =>  {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return parts.join(',');
    }

    const formatCurrencyUSD = (amount) =>  {
        // Convert the number to a string and insert commas every three digits from the right
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine the integer part with the decimal part (if any)
        return parts.join(',');
    }

    const actionRouter = async(post) => {
        try {
            let load;
            if (post.cond == 'add') {
                const response = await MarketRouters.addPost(post)
                load = response.data;
            } else {
                const response = await MarketRouters.updatePost(post, post.id)
                load = response.data;
            }
            const status = load.status
            return status
        } catch (error) {
            return false;
        }
    }

    const actionLevy = async(post) => {
        try {
            let load;
            if (post.cond == 'add') {
                const response = await LevyDuty.addPost(post)
                load = response.data
            } else {
                const response = await updatePost.addPost(post, post.id)
                load = response.data
            }
            const status = load.status
            return status
        } catch (error) {
            return false;
        }
    }

    const postData = async() => {
        try {
            const routers = forms_router.value
            let count_routers = 0;
            for (let i = 0; i < routers.length; i++) {
                if (routers[i].nilai == null) {
                    continue;
                }
                count_routers = count_routers + 1;
            }

            const levy = forms_levy.value
            let count_levy = 0;
            for (let i = 0; i < levy.length; i++) {
                if (levy[i].nilai == null) {
                    continue;
                }
                count_levy = count_levy + 1;
            }

            if (count_levy >= levy.length && count_routers >= routers.length) {
                for (let i = 0; i < routers.length; i++) {
                    const response = await actionRouter(routers[i])
                    console.log(response)
                    console.log(routers[i].cond)
                }

                const levy = forms_levy.value
                for (let i = 0; i < levy.length; i++) {
                    const response = await actionLevy(levy[i])
                    console.log(response)
                    console.log(levy[i].cond)
                }
                messages.value = [
                    { severity: 'success', content: 'Data berhasil disimpan', id: count.value++ }
                ];
                setTimeout(function() {
                    loadData()
                    visible.value = false
                }, time.value);
            } else {
                messages.value = [
                    { severity: 'warn', content: 'Mohon data dilengkapi !', id: count.value++ }
                ];
            }
        } catch (error) {
            messages.value = [
                { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
            ];
            setTimeout(function() {
                loadData()
                visible.value = false
            }, time.value);
        }
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
            <div class="w-full text-right">
                <small class="font-medium text-red-500">Period : {{ moment(period).format('MMMM YYYY') }}</small>
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '85rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
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
                            <Dropdown :options="list_currency" filter optionLabel="name" optionValue="id" placeholder="Select a Currency" class="flex-auto" v-model="routers.currency_id" ></Dropdown>
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
                            <Dropdown :options="list_currency" filter optionLabel="name" optionValue="id" placeholder="Select a Currency" class="flex-auto"  v-model="item.currency_id" ></Dropdown>
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
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    <Button type="button" label="Save" @click="postData()"></Button>
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
        <DataTable v-else v-model:filters="filters" :value="products" showGridlines  scrollHeight="430px" dataKey="id" scrollable :globalFilterFields="['date']">
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
                        <Button icon="pi pi-pencil" severity="warning" text @click="formDatabase('edit',data)"/>
                    </div>
                </template>
            </Column>

            <!-- RBD Olein -->
            <Column field="routers" style="min-width: 13rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdo.routers.nilai == null ? '-' : formatCurrencyUSD(data.rbdo.routers.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="levy" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdo.levy.nilai == null ? '-' : formatCurrencyUSD(data.rbdo.levy.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="value" style="min-width: 17rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdo.levy.nilai == null && data.rbdo.routers.nilai == null ? '-' : formatCurrencyUSD((Number(data.rbdo.routers.nilai) - Number(data.rbdo.levy.nilai)).toFixed(2)) }}</small>
                    </div>
                </template>
            </Column>
            <!-- RBD Stearin -->
            <Column field="routers" style="min-width: 13rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbds.routers.nilai == null ? '-' : formatCurrencyUSD(data.rbds.routers.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="levy" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbds.levy.nilai == null ? '-' : formatCurrencyUSD(data.rbds.levy.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="value" style="min-width: 17rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbds.levy.nilai == null && data.rbds.routers.nilai == null ? '-' : formatCurrencyUSD((Number(data.rbds.routers.nilai) - Number(data.rbds.levy.nilai)).toFixed(2)) }}</small>
                    </div>
                </template>
            </Column>
            <!-- PFAD -->
            <Column field="routers" style="min-width: 13rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.pfad.routers.nilai == null ? '-' : formatCurrencyUSD(data.pfad.routers.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="levy" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.pfad.levy.nilai == null ? '-' : formatCurrencyUSD(data.pfad.levy.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="value" style="min-width: 17rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.pfad.levy.nilai == null && data.pfad.routers.nilai == null ? '-' : formatCurrencyUSD((Number(data.pfad.routers.nilai) - Number(data.pfad.levy.nilai)).toFixed(2)) }}</small>
                    </div>
                </template>
            </Column>
            <!-- RBDPO -->
            <Column field="routers" style="min-width: 13rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdpo.routers.nilai == null ? '-' : formatCurrencyUSD(data.rbdpo.routers.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="levy" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdpo.levy.nilai == null ? '-' : formatCurrencyUSD(data.rbdpo.levy.nilai) }}</small>
                    </div>
                </template>
            </Column>
            <Column field="value" style="min-width: 17rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>USD</small>
                        <small>{{ data.rbdpo.levy.nilai != null && data.rbdpo.routers.nilai != null ? formatCurrencyUSD((Number(data.rbdpo.routers.nilai) - Number(data.rbdpo.levy.nilai)).toFixed(2)) : '-' }}</small>
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
                        <small>{{ data.jisdor != null && data.rbdo.levy.nilai != null && data.rbdo.routers.nilai != null ? formatCurrency((Number(data.jisdor).toFixed(2) * (Number(data.rbdo.routers.nilai) - Number(data.rbdo.levy.nilai)).toFixed(2) / 1000).toFixed(2)) : '-' }}</small>
                    </div>
                </template>
            </Column>
            <Column field="jisdor" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>IDR</small>
                        <small>{{ data.jisdor != null && data.rbds.levy.nilai != null && data.rbds.routers.nilai != null ? formatCurrency((Number(data.jisdor).toFixed(2) * (Number(data.rbds.routers.nilai) - Number(data.rbds.levy.nilai)).toFixed(2) / 1000).toFixed(2)) : '-' }}</small>
                    </div>
                </template>
            </Column>
            <Column field="jisdor" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>IDR</small>
                        <small>{{ data.jisdor != null && data.pfad.levy.nilai != null && data.pfad.routers.nilai != null ? formatCurrency((Number(data.jisdor).toFixed(2) * (Number(data.pfad.routers.nilai) - Number(data.pfad.levy.nilai)).toFixed(2) / 1000).toFixed(2)) : '-' }}</small>
                    </div>
                </template>
            </Column>
            <Column field="jisdor" style="min-width: 10rem;">
                <template #body="{ data }">
                    <div class="flex justify-content-between">
                        <small>IDR</small>
                        <small>{{ data.jisdor != null && data.rbdpo.levy.nilai!== null && data.rbdpo.routers.nilai != null ? formatCurrency((Number(data.jisdor).toFixed(2) * (Number(data.rbdpo.routers.nilai) - Number(data.rbdpo.levy.nilai)).toFixed(2) / 1000).toFixed(2)) : '-' }}</small>
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