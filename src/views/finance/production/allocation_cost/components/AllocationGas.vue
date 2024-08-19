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
    const load_gas = ref([])
    const load_penalty = ref([])

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            const gas = response[0].item
            const gas_penalty = response[1].item
            load_gas.value = gas
            load_penalty.value = gas_penalty
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
        <div class="flex flex-column gap-5">
            <div class="flex flex-column gap-3 p-5 border-bottom-2 border-round bg-yellow-100">
                <div class="flex justify-content-between align-items-center gap-3 font-medium uppercase pb-1 border-bottom-1">
                    <span class="w-full flex justify-content-center">BIAYA PEMAKAIAN GAS</span>
                    <span class="w-full flex justify-content-end">Qty</span>
                </div>
                <div class="flex justify-content-between text-sm font-medium" v-for="(item, index) in load_gas" :key="index">
                    <div class="w-full">{{ item.name }}</div>
                    <div class="w-auto text-center">{{ item.satuan }}</div>
                    <div class="w-full flex justify-content-between">
                        <span class="w-full text-right">{{ item.satuan == 'IDR' ? 'Rp' : item.satuan == 'USD' ? '$' : ''}}</span>
                        <span class="w-full text-right">{{ item.satuan == 'IDR' || item.satuan == 'USD' ? formatCurrency(Number(item.value).toFixed(2)) : formatCurrency(Number(item.value).toFixed(0)) }}</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-column gap-3 p-5 border-bottom-2 border-round bg-red-100">
                <div class="flex justify-content-between align-items-center gap-3 font-medium uppercase pb-1 border-bottom-1">
                    <span class="w-full flex justify-content-center">PERHITUNGAN PENALTY GAS</span>
                    <span class="w-full flex justify-content-end">Qty</span>
                </div>
                <div class="flex justify-content-between text-sm font-medium" v-for="(item, index) in load_penalty" :key="index">
                    <div class="w-full">{{ item.name }}</div>
                    <div class="w-auto text-center">{{ item.satuan }}</div>
                    <div class="w-full flex justify-content-between">
                        <span class="w-full text-right">{{ item.satuan == 'IDR' ? 'Rp' : item.satuan == 'USD' ? '$' : ''}}</span>
                        <span class="w-full text-right">{{ item.satuan == 'IDR' || item.satuan == 'USD' ? formatCurrency(Number(item.value).toFixed(2)) : formatCurrency(Number(item.value).toFixed(0)) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- <DataTable :value="load" class="text-sm" showGridlines rowGroupMode="subheader" groupRowsBy="category_id" sortMode="single" sortField="category_id" :sortOrder="1" >
            <Column field="category_id" header="Representative" bodyStyle="background-color:red;"></Column>
            <Column field="name">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>URAIAN</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <small class="font-medium font-italic">{{ data.name }}</small>
                </template>
            </Column>
            <Column field="items">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>SATUAN</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <div class="flex justify-content-center w-full">
                        <small>{{ data.satuan }}</small>
                    </div>
                </template>
            </Column>
            <Column field="items">
                <template #header>
                    <div class="flex justify-content-center w-full font-italic">
                        <small>VALUE</small>
                    </div>
                </template>
                <template #body="{data}"> 
                    <div class="flex justify-content-between w-full" v-if="data.satuan == 'USD'">
                        <small>USD</small>
                        <small>{{ Number(data.value) == 0 ? '-' : formatCurrency(Number(data.value).toFixed(5))}}</small>
                    </div>
                    <div class="flex justify-content-between w-full" v-else-if="data.satuan == 'IDR'">
                        <small>Rp</small>
                        <small>{{ Number(data.value) == 0 ? '-' : formatCurrency(Number(data.value).toFixed(2))}}</small>
                    </div>
                    <div class="flex justify-content-end w-full" v-else>
                        <small>{{ Number(data.value) == 0 ? '-' : formatCurrency(Number(data.value).toFixed(2))}}</small>
                    </div>
                </template>
            </Column>
            <template #groupheader="{data}">
                <div class="flex align-items-center justify-content-between text-lg gap-2">
                    <small class="font-bold font-italic uppercase">{{ data.category }}</small>
                </div>
            </template>
        </DataTable> -->
    </div>
</template>