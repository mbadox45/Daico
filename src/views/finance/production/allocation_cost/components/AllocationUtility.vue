<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

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

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            const refi = response.find(item => item.name == 'list_allocation_biaya')
            load.value = refi.item
            console.log(refi)
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
                    <Column header="Alokasi Biaya" :rowspan="2" />
                    <Column :colspan="2">
                        <template #header>
                            <div class="w-full flex justify-content-center"><span>Refinery</span></div>
                        </template>
                    </Column>
                    <Column :colspan="2">
                        <template #header>
                            <div class="w-full flex justify-content-center"><span>Fraksinasi</span></div>
                        </template>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <template #header><div class="w-full flex justify-content-center"><span>Qty</span></div></template>
                    </Column>
                    <Column>
                        <template #header><div class="w-full flex justify-content-center"><span>%</span></div></template>
                    </Column>
                    <Column>
                        <template #header><div class="w-full flex justify-content-center"><span>Qty</span></div></template>
                    </Column>
                    <Column>
                        <template #header><div class="w-full flex justify-content-center"><span>%</span></div></template>
                    </Column>
                </Row>
            </ColumnGroup>
            <Column field="name" />
            <Column field="name">
                <template #body="slotProps"> 
                    <div class="flex w-full justify-content-end">{{ formatCurrency(Number(slotProps.data.ref_qty).toFixed(0) )}}</div>
                </template>
            </Column>
            <Column field="name">
                <template #body="slotProps"> 
                    <div class="flex w-full justify-content-end">{{ Number(slotProps.data.ref_persen).toFixed(0) }}%</div>
                </template>
            </Column>
            <Column field="name">
                <template #body="slotProps"> 
                    <div class="flex w-full justify-content-end">{{ formatCurrency(Number(slotProps.data.frak_qty).toFixed(0)) }}</div>
                </template>
            </Column>
            <Column field="name">
                <template #body="slotProps"> 
                    <div class="flex w-full justify-content-end">{{ Number(slotProps.data.frak_persen).toFixed(0) }}%</div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>