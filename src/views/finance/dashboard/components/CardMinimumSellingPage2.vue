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
    
    // onMounted(() => {
    //     loadProduct()
    // });
    
    
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
    <div class="flex flex-column p-4 bg-white shadow-4 w-full border-round gap-5">
        <div class="font-semibold border-round flex flex-column md:flex-row md:justify-content-between gap-2 md:align-items-center text-red-600">
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
            <div class="w-full border-round border-2 border-gray-300 p-3 flex flex-column gap-4">
                <span class="font-italic font-bold text-pink-700 uppercase">Bulky</span>
                <div class="grid p-3">
                    <div class="col-12">
                        <div class="grid bg-pink-700 text-white font-bold text-sm border-round-top">
                            <div class="col-4 h-full flex align-items-center"><span>CATEGORY</span></div>
                            <div class="col-4 h-full border-left-2 border-gray-200 pb-0">
                                <div class="grid">
                                    <div class="col-12 text-center">LOCO</div>
                                    <div class="col-6 bg-red-100 border-1 border-pink-700 text-pink-700 text-center">Rp.</div>
                                    <div class="col-6 bg-blue-100 border-1 border-pink-700 text-pink-700 text-center">USD</div>
                                </div>
                            </div>
                            <div class="col-4 h-full border-left-2 border-gray-200 pb-0">
                                <div class="grid">
                                    <div class="col-12 text-center">FOB (DMO)</div>
                                    <div class="col-6 bg-red-100 border-1 border-pink-700 text-pink-700 text-center">Rp.</div>
                                    <div class="col-6 bg-blue-100 border-1 border-pink-700 text-pink-700 text-center">USD</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 py-0" v-for="(item, index) in bulky" :key="index">
                        <div :class="index == (bulky.length - 1) ? 'border-bottom-2 border-round-bottom' : ''" class="grid text-xs border-left-2 border-right-2 border-pink-700">
                            <div class="col-4 h-full border-right-2 border-gray-300 flex align-items-center font-bold font-italic pb-0">
                                <div class="grid w-full">
                                    <div class="col-12">
                                        <span>{{ item.name }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-for="(items, indexes) in item.items" :key="indexes" :class="indexes == 0 ? 'border-right-2' : ''" class="col-4 h-full border-gray-300 pb-0 pr-0 mr-0">
                                <div class="grid flex align-items-center font-semibold w-full mr-0 pr-0">
                                    <div class="col-6 flex justify-content-between pr-0 gap-3"><span>Rp.</span> <span>{{ formatCurrency(Number(items.value_idr).toFixed(0)) }}</span></div>
                                    <div class="col-6 flex justify-content-between pr-0 gap-3"><span>USD</span> <span>{{ formatCurrency(Number(items.value_usd).toFixed(0)) }}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-3 w-full border-round border-2 border-gray-300 flex flex-column gap-3">
                <span class="font-italic font-bold text-pink-700 uppercase">Retail</span>
                <div class="grid p-3">
                    <div class="col-12 pb-0">
                        <div class="grid bg-pink-700 text-white font-bold text-sm border-round-top">
                            <div class="col-5 h-full flex align-items-center"><span>Category</span></div>
                            <div class="col-2 h-full flex align-items-center"><span>Rp/Kg</span></div>
                            <div class="col-2 h-full flex align-items-center"><span>Rp/Box</span></div>
                            <div class="col-3 h-full flex align-items-center"><span>Rp/Box(+PPN)</span></div>
                        </div>
                    </div>
                    <div class="col-12 pb-0">
                        <div v-for="(item, index) in retail" :key="index" :class="index == (retail.length-1) ? 'border-bottom-2 border-round-bottom' : ''" class="grid pb-0 text-xs border-left-2 border-right-2 border-pink-700">
                            <div class="col-5 h-full flex align-items-center font-bold font-italic"><span>{{item.name}}</span></div>
                            <div class="col-2 h-full flex align-items-center justify-content-between font-medium gap-5"><span>Rp.</span><span>{{item.rp_kemasan}}</span></div>
                            <div class="col-2 h-full flex align-items-center justify-content-between font-medium gap-5"><span>Rp.</span><span>{{item.rp_box}}</span></div>
                            <div class="col-3 h-full flex align-items-center justify-content-between font-medium gap-5"><span>Rp.</span><span>{{item.rp_ppn}}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>