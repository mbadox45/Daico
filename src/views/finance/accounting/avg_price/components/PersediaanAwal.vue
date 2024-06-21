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
            default: () => []
        }
    });

    // VARIABLE
    const loadingTable = ref(false)
    const load = ref([])
    const total_qty = ref(0)
    const total_harga = ref(0)
    const total_total = ref(0)

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            load.value = response.data
            total_qty.value = response.total_qty
            total_total.value = response.total_harga
            total_harga.value = Number(response.total_harga) == 0 && Number(response.total_qty) == 0 ? 0 : Number(response.total_harga) / Number(response.total_qty)
            loadingTable.value = false
        } catch (error) {
            load.value = []
            loadingTable.value = false
        }
    }

    watch(() => props.datas, loadData, { immediate: true });

</script>

<template>
    <div class="w-full">
        <DataTable :value="load" class="text-sm" showGridlines rowGroupMode="subheader" groupRowsBy="category_id" sortMode="single" sortField="category_id" :sortOrder="1" >
            <Column field="category_id" header="Representative" bodyStyle="background-color:red;"></Column>
            <Column field="name">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>Product</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <small class="font-medium font-italic">{{ data.product }}</small>
                </template>
            </Column>
            <Column field="items">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>Qty</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.qty) == 0 ? '-' : formatCurrency(Number(data.qty).toFixed(2))}}</small>
                    </div>
                </template>
            </Column>
            <Column field="items">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>Rp / Kg</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.harga) == 0 ? '-' : formatCurrency(Number(data.harga).toFixed(2))}}</small>
                    </div>
                </template>
            </Column>
            <Column field="items">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>Jumlah</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.jumlah) == 0 ? '-' : formatCurrency(Number(data.jumlah).toFixed(2))}}</small>
                    </div>
                </template>
            </Column>
            <template #groupheader="{data}">
                <div class="flex align-items-center justify-content-between text-lg gap-2">
                    <small class="font-bold font-italic uppercase">* {{ data.category }}</small>
                </div>
            </template>
            <ColumnGroup type="footer">
                <Row>
                    <Column>
                        <template #footer>
                            <small class="font-bold font-italic">TOTAL</small>
                        </template>
                    </Column>
                    <Column>
                        <template #footer>
                            <div class="flex justify-content-end w-full">
                                <small class="font-bold">{{Number(total_qty) == 0 ? '-' : formatCurrency(Number(total_qty).toFixed(2))}}</small>
                            </div>
                        </template>
                    </Column>
                    <Column>
                        <template #footer>
                            <div class="flex justify-content-end w-full">
                                <small class="font-bold">{{Number(total_harga) == 0 ? '-' : formatCurrency(Number(total_harga).toFixed(2))}}</small>
                            </div>
                        </template>
                    </Column>
                    <Column>
                        <template #footer>
                            <div class="flex justify-content-end w-full">
                                <small class="font-bold">{{Number(total_total) == 0 ? '-' : formatCurrency(Number(total_total).toFixed(2))}}</small>
                            </div>
                        </template>
                    </Column>
                </Row>
            </ColumnGroup>
        </DataTable>
    </div>
</template>