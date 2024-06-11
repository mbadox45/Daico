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
            const gas = response.find(item => item.name == 'Allocation Gas')
            const gas_penalty = response.find(item => item.name == 'Allocation Gas Pinalty')
            const items_gas = gas.items
            const items_gas_penalty = gas_penalty.items
            const list = [
                {category_id: 0, category: 'BIAYA PEMAKAIAN GAS', id: 0, name: 'Incoming *based on Pertagas', satuan: 'mmbtu', value: items_gas.incoming_on_pertagas},
                {category_id: 0, category: 'BIAYA PEMAKAIAN GAS', id: 1, name: 'Harga Gas', satuan: 'USD', value: items_gas.harga_gas},
                {category_id: 0, category: 'BIAYA PEMAKAIAN GAS', id: 2, name: 'Nilai Biaya Tagihan', satuan: 'USD', value: items_gas.tagihan_usd},
                {category_id: 0, category: 'BIAYA PEMAKAIAN GAS', id: 3, name: 'Kurs', satuan: 'IDR', value: items_gas.kurs},
                {category_id: 0, category: 'BIAYA PEMAKAIAN GAS', id: 4, name: 'Nilai Biaya Tagihan', satuan: 'IDR', value: items_gas.tagihan_rp},
                {category_id: 1, category: 'PERHITUNGAN PENALTY GAS', id: 0, name: 'Incoming *based on Pertagas', satuan: 'mmbtu', value: items_gas_penalty.incoming_on_pertagas},
                {category_id: 1, category: 'PERHITUNGAN PENALTY GAS', id: 1, name: '+/(-) Pamakaian Gas', satuan: 'mmbtu', value: items_gas_penalty.minimum_pakai},
                {category_id: 1, category: 'PERHITUNGAN PENALTY GAS', id: 2, name: 'Minimum Pemakaian', satuan: 'mmbtu', value: items_gas_penalty.pemakaian_gas},
                {category_id: 1, category: 'PERHITUNGAN PENALTY GAS', id: 3, name: 'Harga Gas', satuan: 'USD', value: items_gas_penalty.harga_gas},
                {category_id: 1, category: 'PERHITUNGAN PENALTY GAS', id: 4, name: 'Nilai Biaya Penalty', satuan: 'USD', value: items_gas_penalty.tagihan_pinalty_usd},
                {category_id: 1, category: 'PERHITUNGAN PENALTY GAS', id: 5, name: 'Kurs', satuan: 'IDR', value: items_gas_penalty.kurs},
                {category_id: 1, category: 'PERHITUNGAN PENALTY GAS', id: 6, name: 'Nilai Biaya Penalty', satuan: 'IDR', value: items_gas_penalty.tagihan_pinalty_rp},
            ]
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
        </DataTable>
    </div>
</template>