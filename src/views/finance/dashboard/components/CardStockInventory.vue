<script setup>
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';

    // API
    import {nilaiStock_DashboardController, nilaiStockKemasan_DashboardController} from '@/controller/dashboard/DashboardController2.js';
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

    // Variable
    const props = defineProps({
        stock:{
            type:Array,
            default: () => {}
        }
    });

    const list_bulk = ref([]);
    const total_bulk = ref({qty: 0, harga:0, value:0})
    const list_retail = ref([]);
    const total_retail = ref({qty: 0, harga:0, value:0})
    const grand_total_icld = ref({qty: 0, harga:0, value:0})
    const grand_total_all = ref({qty: 0, harga:0, value:0})

    // onMounted(() => {
    //     loadData()
    // });

    const loadData = async() => {
        try {
            const response = props.stock;
            const data = await nilaiStock_DashboardController(response)
            const bulk = data.list_bulk
            list_bulk.value = bulk
            total_bulk.value = data.total_bulk
            const kemasan = await nilaiStockKemasan_DashboardController(response)
            list_retail.value = kemasan.list_kemasan
            total_retail.value = kemasan.total_kemasan

            const cpo = bulk == null ? {name: 'CPO', qty: 0, harga: 0, value: 0} : bulk.find(item => item.name.toLowerCase().includes('cpo'));
            const gt = await calculateGrandTotal(cpo, data.total_bulk, kemasan.total_kemasan)
            grand_total_icld.value = gt.gt_incld;
            grand_total_all.value = gt.gt_all;
        } catch (error) {
            list_bulk.value = []
            total_bulk.value = {qty: 0, harga:0, value:0}
            list_retail.value = []
            total_retail.value = {qty: 0, harga:0, value:0}
        }
    }

    const calculateGrandTotal = async(cpo, total1, total2) => {
        console.log(total1, total2)
        const qty = Number(total1.qty) + Number(total2.qty)
        const value = Number(total1.value) + Number(total2.value)
        const harga = (Number(total1.value) + Number(total2.value)) / (Number(total1.qty) + Number(total2.qty))
        const gt_incld = {
            qty: qty,
            value: value,
            harga: harga,
        }
        const gt_all = {
            qty: qty - Number(cpo.qty),
            value: value - Number(cpo.value),
            harga: (qty - Number(cpo.qty)) > 0 ? (value - Number(cpo.value)) / (qty - Number(cpo.qty)) : 0
        }

        return {
            gt_incld: gt_incld,
            gt_all: gt_all,
        }
    }

    watch(() => props.stock, loadData, { immediate: true });

</script>

<template>
    <div class="flex md:flex-row flex-column md:align-items-start align-items-center gap-5">
        <div class="flex flex-column w-full p-4 bg-white border-round shadow-3 border-1 border-gray-300 gap-3">
            <span class="font-bold w-full">UPDATE STOCK INVENTORY</span>
            <div class="py-3 px-2 border-2 border-round border-gray-300">
                <div class="grid mt-3 px-2">
                    <div class="col-12 py-1">
                        <div class="grid text-sm font-bold font-italic border-bottom-2 border-gray-300 bg-gray-200">
                            <div class="col-4 py-2">Product</div>
                            <div class="col-3 text-center py-2">Qty (Kg)</div>
                            <div class="col-2 text-center py-2">Harga</div>
                            <div class="col-3 text-center py-2">Value</div>
                        </div>
                    </div>
                    <div class="col-12 mb-2 pb-1">
                        <div class="grid text-sm underline font-italic">
                            <div class="col-12 border-bottom-2 border-gray-300 py-2">Bulk</div>
                        </div>
                    </div>
                    <div class="col-12 py-1" v-for="(bulk, index) in list_bulk" :key="index">
                        <div :class=" index == (list_bulk.length - 1) ? 'border-bottom-2 border-gray-300' : ''" class="grid text-sm">
                            <div class="col-4 py-2">{{ bulk.name }}</div>
                            <div class="col-3 border-left-2 border-gray-300 text-right py-2">{{ bulk.qty == 0 ? '-' : formatCurrency(Number(bulk.qty).toFixed(0)) }}</div>
                            <div class="col-2 border-left-2 border-gray-300 text-right py-2">{{ bulk.harga == 0 ? '-' : formatCurrency(Number(bulk.harga).toFixed(0)) }}</div>
                            <div class="col-3 border-left-2 border-gray-300 text-right py-2">{{ bulk.value == 0 ? '-' : formatCurrency(Number(bulk.value).toFixed(0)) }}</div>
                        </div>
                    </div>
                    <div class="col-12 py-1">
                        <div class="grid text-sm font-bold font-italic border-bottom-2 border-gray-300 bg-gray-300">
                            <div class="col-4 py-2">Total Bulk</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_bulk.qty).toFixed(0))}}</div>
                            <div class="col-2 text-right py-2">{{formatCurrency(Number(total_bulk.harga).toFixed(0))}}</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_bulk.value).toFixed(0))}}</div>
                        </div>
                    </div>
                    <div class="col-12 mb-2 pb-1">
                        <div class="grid text-sm underline font-italic">
                            <div class="col-12 border-bottom-2 border-gray-300 py-2">Kemasan</div>
                        </div>
                    </div>
                    <div class="col-12 py-1" v-for="(bulk, index) in list_retail" :key="index">
                        <div :class=" index == (list_retail.length - 1) ? 'border-bottom-2 border-gray-300' : ''" class="grid text-sm">
                            <div class="col-4 py-2">{{ bulk.name }}</div>
                            <div class="col-3 border-left-2 border-gray-300 text-right py-2">{{ bulk.qty == 0 ? '-' : formatCurrency(Number(bulk.qty).toFixed(0)) }}</div>
                            <div class="col-2 border-left-2 border-gray-300 text-right py-2">{{ formatCurrency(Number(bulk.harga).toFixed(0)) }}</div>
                            <div class="col-3 border-left-2 border-gray-300 text-right py-2">{{ formatCurrency(Number(bulk.value).toFixed(0)) }}</div>
                        </div>
                    </div>
                    <div class="col-12 py-1">
                        <div class="grid text-sm font-bold font-italic border-bottom-2 border-gray-300 bg-gray-300">
                            <div class="col-4 py-2">Total Kemasan</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_retail.qty).toFixed(0))}}</div>
                            <div class="col-2 text-right py-2">{{formatCurrency(Number(total_retail.harga).toFixed(0))}}</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_retail.value).toFixed(0))}}</div>
                        </div>
                    </div>
                    <div class="col-12 py-1">
                        <div class="grid text-sm font-bold font-italic border-bottom-2 border-gray-300 bg-gray-300">
                            <div class="col-4 py-2">GRAND TOTAL (Incld Bahan Baku)</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(grand_total_icld.qty).toFixed(0))}}</div>
                            <div class="col-2 text-right py-2">{{formatCurrency(Number(grand_total_icld.harga).toFixed(0))}}</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(grand_total_icld.value).toFixed(0))}}</div>
                        </div>
                    </div>
                    <div class="col-12 py-1">
                        <div class="grid text-sm font-bold font-italic border-bottom-2 border-gray-300 bg-gray-300">
                            <div class="col-4 py-2">GRAND TOTAL PRODUK JADI</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(grand_total_all.qty).toFixed(0))}}</div>
                            <div class="col-2 text-right py-2">{{formatCurrency(Number(grand_total_all.harga).toFixed(0))}}</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(grand_total_all.value).toFixed(0))}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>