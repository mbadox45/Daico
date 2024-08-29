<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import { cek_token } from "@/api/DataVariable.js";

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
            load.value = response.list
            total_qty.value = response.tot_qty
            total_total.value = response.tot_jumlah
            total_harga.value = response.tot_harga
            loadingTable.value = false
        } catch (error) {
            load.value = []
            loadingTable.value = false
        }
    }

    watch(() => props.datas, loadData, { immediate: true });

</script>

<template>
    <div class="flex flex-column w-full gap-4">
        <div class="flex gap-3 justify-content-between align-items-center">
            <span class="font-bold text-xl font-italic w-full">QTY OLAH & BEBAN PENGOLAHAN + BLENDING + DOWNGRADE</span>
        </div>
        <DataTable :value="load" class="text-sm" showGridlines rowGroupMode="subheader" groupRowsBy="category" sortMode="single" sortField="category" :sortOrder="1" >
            <Column field="category" bodyStyle="background-color:red;"></Column>
            <Column field="name">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>Product</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <div class="w-full flex align-items-center">
                        <small class="font-medium font-italic w-full flex align-items-center gap-2">
                            <span>{{ data.nama }}</span>
                        </small>
                    </div>
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