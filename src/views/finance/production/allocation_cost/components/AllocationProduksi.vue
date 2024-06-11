<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {formatCurrency} from '@/views/load_data/func_dummy.js'

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
    const tot_prod = ref(0)
    const tot_all_prod = ref(0)

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            const refi = response.find(item => item.name == 'Allocation Produksi')
            const items = refi.items
            const data = [
                {name: 'Refinery', prod: items.ref_prod, prod_all: items.ref_all_prod, iv_56: items.ref_rbd_iv56, iv_57: items.ref_rbd_iv57, iv_58: items.ref_rbd_iv58, iv_60: items.ref_rbd_iv60},
                {name: 'Fraksinasi', prod: items.frak_prod, prod_all: items.frak_all_prod, iv_56: items.frak_rbd_iv56, iv_57: items.frak_rbd_iv57, iv_58: items.frak_rbd_iv58, iv_60: items.frak_rbd_iv60},
                {name: 'Packaging', prod: items.pack_prod, prod_all: items.pack_all_prod, iv_56: items.pack_rbd_iv56, iv_57: items.pack_rbd_iv57, iv_58: items.pack_rbd_iv58, iv_60: items.frak_rbd_iv60},
            ]
            load.value = data;
            tot_prod.value = items.tot_prod
            tot_all_prod.value = items.tot_all_prod
            console.log(load.value)
            loadingTable.value = false
        } catch (error) {
            load.value = {}
            loadingTable.value = false
        }
    }

    watch(() => props.datas, loadData, { immediate: true });

</script>

<template>
    <div class="w-full">
        <DataTable :value="load" class="text-sm" showGridlines tableStyle="min-width: 50rem">
            <ColumnGroup type="header">
                <Row>
                    <Column :rowspan="2" :colspan="2">
                        <template #header>
                            <div class="flex justify-content-center w-full font-italic">
                                <small>Production</small>
                            </div>
                        </template>
                    </Column>
                    <Column :rowspan="2">
                        <template #header>
                            <div class="flex justify-content-center w-full font-italic">
                                <small>All Production</small>
                            </div>
                        </template>
                    </Column>
                    <Column :colspan="8">
                        <template #header>
                            <div class="flex justify-content-center w-full font-italic">
                                <small>Production Fraksinasi + Packaging</small>
                            </div>
                        </template>
                    </Column>
                </Row>
                <Row>
                    <Column :colspan="2">
                        <template #header>
                            <div class="flex justify-content-center w-full font-italic">
                                <small>RBD Olein IV-56</small>
                            </div>
                        </template>
                    </Column>
                    <Column :colspan="2">
                        <template #header>
                            <div class="flex justify-content-center w-full font-italic">
                                <small>RBD Olein IV-57</small>
                            </div>
                        </template>
                    </Column>
                    <Column :colspan="2">
                        <template #header>
                            <div class="flex justify-content-center w-full font-italic">
                                <small>RBD Olein IV-58</small>
                            </div>
                        </template>
                    </Column>
                    <Column :colspan="2">
                        <template #header>
                            <div class="flex justify-content-center w-full font-italic">
                                <small>RBD Olein IV-60</small>
                            </div>
                        </template>
                    </Column>
                </Row>
            </ColumnGroup>
            <Column field="name">
                <template #body="{data}"> 
                    <small class="font-medium font-italic">{{ data.name }}</small>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.prod) == 0 ? 0 : formatCurrency(Number(data.prod).toFixed(2))+' %' }}</small>
                    </div>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.prod_all) == 0 ? 0 : formatCurrency(Number(data.prod_all).toFixed(2) )}}</small>
                    </div>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.iv_56) == 0 ? '-' : formatCurrency(Number(data.iv_56).toFixed(2) )}}</small>
                    </div>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.iv_56) == 0 ? '-' : formatCurrency(((Number(data.iv_56)/Number(data.prod_all)) * 100).toFixed(2))+' %' }}</small>
                    </div>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.iv_57) == 0 ? '-' : formatCurrency(Number(data.iv_57).toFixed(2) )}}</small>
                    </div>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.iv_57) == 0 ? '-' : formatCurrency(((Number(data.iv_57)/Number(data.prod_all)) * 100).toFixed(2))+' %' }}</small>
                    </div>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.iv_58) == 0 ? '-' : formatCurrency(Number(data.iv_58).toFixed(2) )}}</small>
                    </div>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.iv_58) == 0 ? '-' : formatCurrency(((Number(data.iv_58)/Number(data.prod_all)) * 100).toFixed(2))+' %' }}</small>
                    </div>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.iv_60) == 0 ? '-' : formatCurrency(Number(data.iv_60).toFixed(2) )}}</small>
                    </div>
                </template>
            </Column>
            <Column field="name">
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.iv_60) == 0 ? '-' : formatCurrency(((Number(data.iv_60)/Number(data.prod_all)) * 100).toFixed(2))+' %' }}</small>
                    </div>
                </template>
            </Column>
            <ColumnGroup type="footer">
                <Row>
                    <Column>
                        <template #footer>
                            <small class="font-bold font-italic">TOTAL</small>
                        </template>
                    </Column>
                    <Column footerStyle="text-align:right">
                        <template #footer>
                            <small class="font-medium font-italic">{{Number(tot_prod) == 0 ? '-' : formatCurrency(Number(tot_prod).toFixed(2))+' %'}}</small>
                        </template>
                    </Column>
                    <Column footerStyle="text-align:right">
                        <template #footer>
                            <small class="font-medium font-italic">{{Number(tot_all_prod) == 0 ? '-' : formatCurrency(Number(tot_all_prod).toFixed(2))}}</small>
                        </template>
                    </Column>
                    <Column :colspan="8" footerStyle="background-color:gray;"/>
                </Row>
            </ColumnGroup>
        </DataTable>
    </div>
</template>