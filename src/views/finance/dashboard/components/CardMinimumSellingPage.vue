<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';

    // Controller
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import {minimumSellingPrice_DashboardController, nilaiKurs_DashboardController} from '@/controller/dashboard/DashboardController2.js';


    // Variable
    const props = defineProps({
        sell:{
            type:Array,
            default: () => {}
        }
    });

    const retail = ref([])
    const bulky = ref([])
    const loadingData = ref(false)
    const gpm = ref(5);
    const coloring = ref(["red", "green", "gray", "teal", "yellow", "blue", "orange"])

    // Function
    
    onMounted(() => {
        loadProduct()
    });
    
    
    const loadProduct = async() => {
        loadingData.value = true
        try {
            bulky.value = await calculationGPM(props.sell)
            retail.value = await calculationGPMRetail(props.sell)
            loadingData.value = false
        } catch (error) {
            bulky.value = []
            retail.value = []
            loadingData.value = false
        }
    }
    
    const calculationGPM = async(data) => {
        try {
            const response = await minimumSellingPrice_DashboardController(data)
            const kurs = await nilaiKurs_DashboardController(data);
            const mandiri = kurs == null ? 0 : Number(kurs.mandiri) == 0 ? 0 : Number(kurs.mandiri)
            const bulk = response.bulky
            const list = []
            for (let i = 0; i < bulk.length; i++) {
                const loco = bulk[i].rp_kg == 0 || bulk[i].rp_kg == null ? 0 : bulk[i].rp_kg * (1 + (gpm.value / 100));
                const loco_usd = mandiri == 0 ? 0 : loco / mandiri * 1000
                let dmo = 0
                if (bulk[i].name.toLowerCase().includes('rbd olein') || bulk[i].name.toLowerCase().includes('rbdpo')) {
                    dmo = 212-79
                } else if (bulk[i].name.toLowerCase().includes('rbd stearin')) {
                    dmo = 290-79
                } else {
                    dmo = 299-81
                }
                const fob = loco + dmo
                const fob_usd = mandiri == 0 ? 0 : fob / mandiri * 1000
                list.push({
                    name: bulk[i].name,
                    items : [
                        {name: 'Loco', value_idr: loco, value_usd: loco_usd},
                        {name: 'FOB (DMO)', value_idr: fob, value_usd: fob_usd},
                    ]
                })
            }
            return list
        } catch (error) {
            return []
        }

    }

    const calculationGPMRetail = async(data) => {
        try {
            const response = await minimumSellingPrice_DashboardController(data)
        //     const kurs = await nilaiKurs_DashboardController(data);
        //     const mandiri = kurs == null ? 0 : Number(kurs.mandiri) == 0 ? 0 : Number(kurs.mandiri)
            const produk = response.retail
            const list = []
            for (let i = 0; i < produk.length; i++) {
                const rp_kemasan = produk[i].rp_kg * (1 + (Number(gpm.value) / 100))
                const rp_box = produk[i].rp_box * (1 + (Number(gpm.value) / 100))
                const rp_ppn = produk[i].rp_ppn * (1 + (Number(gpm.value) / 100))
                list.push({
                    name: produk[i].name,
                    rp_kemasan: formatCurrency(Number(rp_kemasan).toFixed(0)),
                    rp_box: formatCurrency(Number(rp_box).toFixed(0)),
                    rp_ppn: formatCurrency(Number(rp_ppn).toFixed(0)),
                })
            }
            return list
            // return response;
        } catch (error) {
            return []
        }

    }

    watch(() => props.sell, loadProduct, { immediate: true });

</script>
<template>
    <div class="flex flex-column p-4 bg-yellow-100 w-full border-round gap-5">
        <div class="font-semibold shadow-4 bg-white p-3 border-round flex flex-column md:flex-row md:justify-content-between gap-2 md:align-items-center text-red-600">
            <span class="text-sm md:text-xl w-full">MINIMUM SELLING PRICE (EXCL. LEVY DUTY) --> GPM {{ gpm }}% Base On CPO Olah INL</span>
            <div class="w-full md:w-3">
                <div class="p-inputgroup p-fluid">
                    <span class="p-inputgroup-addon ">
                        <i class="pi pi-percentage text-red-500"></i>
                    </span>
                    <InputNumber v-model="gpm" placeholder="GPM Value" :min="0" :max="100" class=""/>
                    <Button icon="pi pi-save" severity="danger" @click="loadProduct"/>
                </div>
            </div>
        </div>
        <div class="flex flex-column gap-4 md:gap-4 w-full">
            <div class="w-full border-round flex flex-column gap-4">
                <div class="grid p-2">
                    <div class="p-2 col-12 md:col-4" v-for="(item, index) in bulky" :key="index">
                        <div :class="`bg-${coloring[index]}-100`" class="p-3 border-round shadow-4 flex justify-content-between align-items-center gap-5">
                            <div class="flex gap-2 flex-column w-full">
                                <span :class="`text-${coloring[index]}-800`" class="text-md font-semibold font-italic border-bottom-1 pb-1">{{ item.name }}</span>
                                <div class="flex gap-3">
                                    <div v-for="(items, indexes) in item.items" :key="indexes" class="w-full flex flex-column gap-1">
                                        <span :class="`text-${coloring[index]}-800`" class="font-bold text-sm underline">{{ items.name }}</span>
                                        <span class="w-full flex justify-content-between font-bold text-xs md:text-sm"><span>Rp. </span><span>{{ formatCurrency(Number(items.value_idr).toFixed(0)) }}</span></span>
                                        <span class="w-full flex justify-content-between font-bold text-xs md:text-sm"><span>USD </span><span>{{ formatCurrency(Number(items.value_usd).toFixed(0)) }}</span></span>
                                    </div>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" :class="`text-${coloring[index]}-800`" class="bi bi-kanban w-2 h-2" viewBox="0 0 16 16">
                                <path d="M13.5 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm-11-1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                <path d="M6.5 3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm-4 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm8 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-3 shadow-4 bg-white w-full border-round flex flex-column gap-2">
                <span class="font-italic font-medium uppercase">Retail</span>
                <DataTable :value="retail" class="text-sm" >
                    <template #empty> No retail found. </template>
                    <Column field="nama">
                        <template #header>
                            <div class="flex w-full font-italic underline uppercase">
                                <small>Retail</small>
                            </div>
                        </template>
                        <template #body="{data}"> 
                            <small class="font-medium">{{ data.name }}</small>
                        </template>
                    </Column>
                    <Column field="value">
                        <template #header>
                            <div class="flex justify-content-end w-full font-italic">
                                <small>Rp/Kemasan</small>
                            </div>
                        </template>
                        <template #body="{data}">
                            <div class="w-full flex justify-content-end">
                                <small class="font-medium">{{ data.rp_kemasan }}</small>
                            </div>
                        </template>
                    </Column>
                    <Column field="value">
                        <template #header>
                            <div class="flex justify-content-end w-full font-italic">
                                <small>Rp/Box</small>
                            </div>
                        </template>
                        <template #body="{data}">
                            <div class="w-full flex justify-content-end">
                                <small class="font-medium">{{ data.rp_box }}</small>
                            </div>
                        </template>
                    </Column>
                    <Column field="value">
                        <template #header>
                            <div class="flex justify-content-end w-full font-italic">
                                <small>Rp/Box(+PPN)</small>
                            </div>
                        </template>
                        <template #body="{data}">
                            <div class="w-full flex justify-content-end">
                                <small class="font-medium">{{ data.rp_ppn }}</small>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>