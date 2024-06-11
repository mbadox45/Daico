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

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            const refi = response.find(item => item.name == 'Allocation Utility')
            load.value = refi.items
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
                    <Column header="Alokasi Biaya" :rowspan="2" />
                    <Column header="Refinery" :colspan="2" />
                    <Column header="Fraksinasi" :colspan="2" />
                </Row>
                <Row>
                    <Column header="Qty" field="lastYearSale" />
                    <Column header="%" field="thisYearSale" />
                    <Column header="Qty" field="lastYearProfit" />
                    <Column header="%" field="thisYearProfit" />
                </Row>
            </ColumnGroup>
            <Column field="name" />
            <Column field="name">
                <template #body="slotProps"> {{ formatCurrency(Number(slotProps.data.ref.qty).toFixed(0) )}} </template>
            </Column>
            <Column field="name">
                <template #body="slotProps"> {{ Number(slotProps.data.ref.persen*100).toFixed(0) }}% </template>
            </Column>
            <Column field="name">
                <template #body="slotProps"> {{ formatCurrency(Number(slotProps.data.frak.qty).toFixed(0)) }}</template>
            </Column>
            <Column field="name">
                <template #body="slotProps"> {{ Number(slotProps.data.frak.persen*100).toFixed(0) }}% </template>
            </Column>
        </DataTable>
    </div>
</template>