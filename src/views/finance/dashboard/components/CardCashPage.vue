<script setup>
    // Vue Component
    import { ref, computed, defineProps, onMounted, watch } from 'vue';
    import moment from 'moment';

    // Controller
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    // import {nilaiCash_DashboardController} from '@/controller/dashboard/DashboardController2.js';
    import {RekeningUnitKerja} from '@/controller/accounting/RekeningUnitController.js'


    // Variable
    const props = defineProps({
        cash:{
            type:Array,
            default: () => {}
        }
    });

    const load_data = ref([])
    const total_cash = ref(0)
    const total_cash_on_hand = ref(0)
    const loadingData = ref(false)

    
    // onMounted(() => {
    //     loadProduct(props.cash)
    // });
    
    const loadProduct = async() => {
        loadingData.value = true
        try {
            const response = await RekeningUnitKerja();
            load_data.value = response.list_on_hand
            total_cash.value = response.total
            total_cash_on_hand.value = response.total_on_hand
            loadingData.value = false
        } catch (error) {
            load_data.value = []
            total_cash.value = 0
            total_cash_on_hand.value = 0
            loadingData.value = false
        }
    }

    // Function
    watch(() => props.cash, loadProduct, { immediate: true });

</script>
<template>
    <div class="flex flex-column bg-white p-4 w-full border-round shadow-4 gap-4">
        <span class="font-semibold text-2xl flex flex-row-reverse justify-content-between gap-2 border-bottom-1 pb-2 align-items-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
            </svg>
            <span>Saldo Cash</span>
        </span>
        <div v-if="loadingData == true" class="w-full h-15rem flex align-items-center justify-content-center">
            <ProgressSpinner />
        </div>
        <div v-else class="flex flex-column gap-3 w-full">
            <DataTable :value="load_data" class="text-sm" >
                <Column field="nama">
                    <template #header>
                        <div class="flex w-full font-italic underline uppercase">
                            <small>Rekening Cash on Hand :</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.nama }}</small>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <div class="flex justify-content-end w-full font-italic">
                            <small></small>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="w-full flex justify-content-end">
                            <small class="font-medium">{{ formatCurrency(Number(data.value).toFixed(0)) }}</small>
                        </div>
                    </template>
                </Column>
                <ColumnGroup type="footer">
                    <Row>
                        <Column>
                            <template #footer>
                                <small class="font-bold font-italic">Jumlah Cash on Hand</small>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ formatCurrency(Number(total_cash_on_hand).toFixed(0)) }}</small>
                                </div>
                            </template>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <template #footer>
                                <small class="font-bold font-italic">SALDO CASH TOTAL</small>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ formatCurrency(Number(total_cash).toFixed(0)) }}</small>
                                </div>
                            </template>
                        </Column>
                    </Row>
                </ColumnGroup>
            </DataTable>
        </div>
    </div>
</template>