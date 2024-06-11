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
            const refi = response.find(item => item.name == 'Allocation')
            const items = refi.items
            const list = []
            for (let i = 0; i < items.length; i++) {
                const item = items[i].items;
                for (let j = 0; j < item.length; j++) {
                    list.push({
                        category_id: items[i].id,
                        category: items[i].name,
                        items: item[j].name,
                        value: item[j].value,
                        tot_alloc: items[i].tot_alloc,
                        tot_rak: items[i].tot_rak,
                        tot_ref: items[i].tot_ref,
                        total: items[i].total,
                    })
                }
            }
            load.value = list
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
        <DataTable :value="load" class="text-sm" showGridlines rowGroupMode="subheader" groupRowsBy="category_id" sortMode="single" sortField="category_id" :sortOrder="1" >
            <Column field="category_id" header="Representative" bodyStyle="background-color:red;"></Column>
            <Column field="items">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>URAIAN</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <small class="font-medium font-italic">{{ data.items }}</small>
                </template>
            </Column>
            <Column field="items">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>QTY</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <div class="flex justify-content-end w-full">
                        <small>{{ Number(data.value) == 0 ? '-' : formatCurrency(Number(data.value).toFixed(2))}}</small>
                    </div>
                </template>
            </Column>
            <template #groupheader="{data}">
                <div class="flex align-items-center justify-content-between text-lg gap-2">
                    <small class="font-bold font-italic uppercase">{{ data.category }}</small>
                    <small class="font-bold font-italic">{{ Number(data.total) == 0 ? '-' : formatCurrency(Number(data.total).toFixed(2)) }}</small>
                </div>
            </template>
            <template #groupfooter="{data}">
                <div class="flex flex-column gap-2">
                    <div class="flex justify-content-between underline font-medium font-italic w-full"><small>Cost Allocation:</small><small></small></div>
                    <div class="flex justify-content-between font-medium w-full"><small>- Refinery</small><small>{{ Number(data.tot_ref) == 0 ? '-' : formatCurrency(Number(data.tot_ref).toFixed(2)) }}</small></div>
                    <div class="flex justify-content-between font-medium w-full"><small>- Fraksinasi</small><small>{{ Number(data.tot_rak) == 0 ? '-' : formatCurrency(Number(data.tot_ref).toFixed(2)) }}</small></div>
                    <div class="flex justify-content-between font-medium font-italic w-full"><small>Total Pemakaian Air (Allocation)</small><small>{{ Number(data.tot_alloc) == 0 ? '-' : formatCurrency(Number(data.tot_alloc).toFixed(2)) }}</small></div>
                </div>
            </template>
        </DataTable>
    </div>
</template>