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
    const load_rekening_on_hand = ref([])
    const total_cash_inl = ref(0)
    const total_cash_on_hand = ref(0)

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = props.datas;
            load.value = response
            loadingTable.value = false
        } catch (error) {
            load.value = []
            loadingTable.value = false
        }
    }

    watch(() => props.datas, loadData, { immediate: true });

</script>

<template>
    <div class="w-full flex flex-column gap-5">
        <div >
            <p class="font-italic uppercase">Rekening Cash on Hand</p>
            <DataTable :value="load" showGridlines class="text-sm" >
                <Column field="nama">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic uppercase">
                            <small>Lokasi</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.location }}</small>
                    </template>
                </Column>
                <Column field="nama">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic uppercase">
                            <small>No Tank</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.name }}</small>
                    </template>
                </Column>
                <Column field="nama">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic uppercase">
                            <small>Produk</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.name }}</small>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>Kapaistas</small>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="w-full flex justify-content-end">
                            <small class="font-medium">{{ formatCurrency(Number(data.capacity).toFixed(0)) }}</small>
                        </div>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>Stok MT</small>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="w-full flex justify-content-end">
                            <small class="font-medium">{{ formatCurrency(Number(data.capacity).toFixed(0)) }}</small>
                        </div>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>Stock</small>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="w-full flex justify-content-end">
                            <small class="font-medium">{{ formatCurrency(Number(data.capacity).toFixed(0)) }}</small>
                        </div>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>Space</small>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="w-full flex justify-content-end">
                            <small class="font-medium">{{ formatCurrency(Number(data.capacity).toFixed(0)) }}</small>
                        </div>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>Umur</small>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="w-full flex justify-content-end">
                            <small class="font-medium">{{ formatCurrency(Number(data.capacity).toFixed(0)) }}</small>
                        </div>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>Remarks</small>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="w-full flex justify-content-end">
                            <small class="font-medium">{{ formatCurrency(Number(data.capacity).toFixed(0)) }}</small>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>