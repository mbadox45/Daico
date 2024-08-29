<script setup>
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';

    // API
    import {nilaiStock_DashboardController} from '@/controller/dashboard/DashboardController2.js';
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

    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        try {
            const response = props.stock;
            const data = await nilaiStock_DashboardController(response)
            list_bulk.value = data.list_bulk
            total_bulk.value = data.total_bulk
        } catch (error) {
            list_bulk.value = []
            total_bulk.value = {qty: 0, harga:0, value:0}
            list_retail.value = []
            total_retail.value = {qty: 0, harga:0, value:0}
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
                    <div class="col-12 pb-1">
                        <div class="grid text-sm underline font-italic">
                            <div class="col-12 py-2">Bulk</div>
                        </div>
                    </div>
                    <div class="col-12 py-1" v-for="(bulk, index) in list_bulk" :key="index">
                        <div :class=" index == (list_bulk.length - 1) ? 'border-bottom-2 border-gray-300' : ''" class="grid text-sm">
                            <div class="col-4 py-2">{{ bulk.name }}</div>
                            <div class="col-3 text-right py-2">{{ bulk.qty == 0 ? '-' : formatCurrency(Number(bulk.qty).toFixed(0)) }}</div>
                            <div class="col-2 text-right py-2">{{ bulk.harga == 0 ? '-' : formatCurrency(Number(bulk.harga).toFixed(0)) }}</div>
                            <div class="col-3 text-right py-2">{{ bulk.value == 0 ? '-' : formatCurrency(Number(bulk.value).toFixed(0)) }}</div>
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
                    <div class="col-12 pb-1">
                        <div class="grid text-sm underline font-italic">
                            <div class="col-12 py-2">Kemasan</div>
                        </div>
                    </div>
                    <div class="col-12 py-1" v-for="(bulk, index) in list_bulk" :key="index">
                        <div :class=" index == (list_bulk.length - 1) ? 'border-bottom-2 border-gray-300' : ''" class="grid text-sm">
                            <div class="col-4 py-2">{{ bulk.name }}</div>
                            <div class="col-3 text-right py-2">{{ bulk.qty == 0 ? '-' : formatCurrency(Number(bulk.qty).toFixed(0)) }}</div>
                            <div class="col-2 text-right py-2">{{ formatCurrency(Number(bulk.harga).toFixed(0)) }}</div>
                            <div class="col-3 text-right py-2">{{ formatCurrency(Number(bulk.value).toFixed(0)) }}</div>
                        </div>
                    </div>
                    <div class="col-12 py-1">
                        <div class="grid text-sm font-bold font-italic border-bottom-2 border-gray-300 bg-gray-300">
                            <div class="col-4 py-2">Total Kemasan</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_bulk.qty).toFixed(0))}}</div>
                            <div class="col-2 text-right py-2">{{formatCurrency(Number(total_bulk.harga).toFixed(0))}}</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_bulk.value).toFixed(0))}}</div>
                        </div>
                    </div>
                    <div class="col-12 py-1">
                        <div class="grid text-sm font-bold font-italic border-bottom-2 border-gray-300 bg-gray-300">
                            <div class="col-4 py-2">GRAND TOTAL (Incld Bahan Baku)</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_bulk.qty).toFixed(0))}}</div>
                            <div class="col-2 text-right py-2">{{formatCurrency(Number(total_bulk.harga).toFixed(0))}}</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_bulk.value).toFixed(0))}}</div>
                        </div>
                    </div>
                    <div class="col-12 py-1">
                        <div class="grid text-sm font-bold font-italic border-bottom-2 border-gray-300 bg-gray-300">
                            <div class="col-4 py-2">GRAND TOTAL PRODUK JADI</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_bulk.qty).toFixed(0))}}</div>
                            <div class="col-2 text-right py-2">{{formatCurrency(Number(total_bulk.harga).toFixed(0))}}</div>
                            <div class="col-3 text-right py-2">{{formatCurrency(Number(total_bulk.value).toFixed(0))}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>