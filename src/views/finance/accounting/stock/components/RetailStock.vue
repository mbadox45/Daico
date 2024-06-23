<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    
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

    const route = useRoute();
    const router = useRouter();

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
            console.log(response)
            loadingTable.value = false
        } catch (error) {
            load.value = []
            loadingTable.value = false
        }
    }

    watch(() => props.datas, loadData, { immediate: true });

</script>

<template>
    <div class="flex flex-column gap-5">
        <div class="w-full">
            <Button label="Update Data" severity="warning" size="small" @click="()=>{router.push('/form-retail-stock')}"/>
        </div>
        <div class="grid">
            <div class="col-6 flex p-2" v-for="(lokasi, index) in load" :key="index">
                <div class="border-1 w-full p-3 border-round border-gray-300 flex flex-column gap-2">
                    <span class="text-sm font-medium font-italic text-center">{{ lokasi.lokasi }}</span>
                    <DataTable :value="lokasi.items" showGridlines class="text-sm" >
                        <Column field="nama">
                            <template #header>
                                <div class="flex justify-content-start w-full font-italic uppercase">
                                    <small>Produk</small>
                                </div>
                            </template>
                            <template #body="{data}"> 
                                <small class="font-medium">{{ data.produk }}</small>
                            </template>
                        </Column>
                        <Column field="ctn">
                            <template #header>
                                <div class="flex justify-content-center w-full font-italic uppercase">
                                    <small>Ctn</small>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="w-full flex justify-content-end">
                                    <small class="font-medium">{{ data.ctn == null ? '-' : formatCurrency(Number(data.ctn).toFixed(3)) }}</small>
                                </div>
                            </template>
                        </Column>
                        <Column field="mt">
                            <template #header>
                                <div class="flex justify-content-center w-full font-italic uppercase">
                                    <small>MT</small>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="w-full flex justify-content-end">
                                    <small class="font-medium">{{ data.mt == null ? '-' : formatCurrency(Number(data.mt).toFixed(3)) }}</small>
                                </div>
                            </template>
                        </Column>
                        <Column field="pallet">
                            <template #header>
                                <div class="flex justify-content-center w-full font-italic uppercase">
                                    <small>Pallet</small>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="w-full flex justify-content-end">
                                    <small class="font-medium">{{ data.pallet == null ? '-' : formatCurrency(Number(data.pallet).toFixed(3)) }}</small>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>