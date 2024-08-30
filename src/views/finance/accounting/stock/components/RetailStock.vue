<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {formatCurrency} from '@/views/load_data/func_dummy.js'
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

    const route = useRoute();
    const router = useRouter();

    // VARIABLE
    const loadingTable = ref(false)
    const load = ref([])
    const load_total = ref([])
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
            load.value = response.list
            load_total.value = response.list_stock
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
        <div :class="cek_token == null ? 'hidden' : 'flex'" class="w-full">
            <Button label="Update Data" severity="warning" size="small" @click="()=>{router.push('/form-retail-stock')}"/>
        </div>
        <div class="grid">
            <div class="lg:col-6 col-12 flex p-2" v-for="(totals, index) in load_total" :key="index">
                <div class="border-2 w-full p-3 border-round border-gray-300 flex flex-column gap-2">
                    <span class="text-sm font-medium font-italic text-center">{{ totals.lokasi }}</span>
                    <DataTable :value="totals.items" showGridlines class="text-sm" >
                        <Column field="nama" headerClass="bg-gray-300">
                            <template #header>
                                <div class="flex justify-content-start w-full font-italic uppercase">
                                    <small>Produk</small>
                                </div>
                            </template>
                            <template #body="{data}"> 
                                <small class="font-medium">{{ data.produk }}</small>
                            </template>
                        </Column>
                        <Column field="ctn" headerClass="bg-gray-300">
                            <template #header>
                                <div class="flex justify-content-center w-full font-italic uppercase">
                                    <small>Ctn</small>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="w-full flex justify-content-end">
                                    <small class="font-medium">{{ data.ctn == null ? '-' : formatCurrency(Number(data.ctn).toFixed(1)) }}</small>
                                </div>
                            </template>
                        </Column>
                        <Column field="mt" headerClass="bg-gray-300">
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
                        <ColumnGroup type="footer">
                            <Row>
                                <Column>
                                    <template #footer>
                                        <small class="font-bold font-italic uppercase">Total</small>
                                    </template>
                                </Column>
                                <Column>
                                    <template #footer>
                                        <div class="flex justify-content-end">
                                            <small class="font-bold font-italic uppercase">{{formatCurrency(Number(totals.tot_ctn).toFixed(2))}}</small>
                                        </div>
                                    </template>
                                </Column>
                                <Column>
                                    <template #footer>
                                        <div class="flex justify-content-end">
                                            <small class="font-bold font-italic uppercase">{{formatCurrency(Number(totals.tot_mt).toFixed(2))}}</small>
                                        </div>
                                    </template>
                                </Column>
                            </Row>
                        </ColumnGroup>
                    </DataTable>
                </div>
            </div>
            <div class="lg:col-6 col-12 flex p-2" v-for="(lokasi, index) in load" :key="index">
                <div class="border-2 w-full p-3 border-round border-gray-300 flex flex-column gap-2">
                    <span class="text-sm font-medium font-italic text-center">{{ lokasi.lokasi }}</span>
                    <DataTable :value="lokasi.items" showGridlines class="text-sm" >
                        <Column field="nama" headerClass="bg-gray-300">
                            <template #header>
                                <div class="flex justify-content-start w-full font-italic uppercase">
                                    <small>Produk</small>
                                </div>
                            </template>
                            <template #body="{data}"> 
                                <small class="font-medium">{{ data.produk }}</small>
                            </template>
                        </Column>
                        <Column field="ctn" headerClass="bg-gray-300">
                            <template #header>
                                <div class="flex justify-content-center w-full font-italic uppercase">
                                    <small>Ctn</small>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="w-full flex justify-content-end">
                                    <small class="font-medium">{{ data.ctn == null ? '-' : formatCurrency(Number(data.ctn).toFixed(1)) }}</small>
                                </div>
                            </template>
                        </Column>
                        <Column field="mt" headerClass="bg-gray-300">
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
                        <Column field="pallet" headerClass="bg-gray-300">
                            <template #header>
                                <div class="flex justify-content-center w-full font-italic uppercase">
                                    <small>Pallet</small>
                                </div>
                            </template>
                            <template #body="{data}">
                                <div class="w-full flex justify-content-end">
                                    <small class="font-medium">{{ data.pallet == null ? '-' : formatCurrency(Number(data.pallet).toFixed(1)) }}</small>
                                </div>
                            </template>
                        </Column>
                        <ColumnGroup type="footer">
                            <Row>
                                <Column>
                                    <template #footer>
                                        <small class="font-bold font-italic uppercase">Total</small>
                                    </template>
                                </Column>
                                <Column>
                                    <template #footer>
                                        <div class="flex justify-content-end">
                                            <small class="font-bold font-italic uppercase">{{formatCurrency(Number(lokasi.tot_ctn).toFixed(2))}}</small>
                                        </div>
                                    </template>
                                </Column>
                                <Column>
                                    <template #footer>
                                        <div class="flex justify-content-end">
                                            <small class="font-bold font-italic uppercase">{{formatCurrency(Number(lokasi.tot_mt).toFixed(2))}}</small>
                                        </div>
                                    </template>
                                </Column>
                                <Column>
                                    <template #footer>
                                        <div class="flex justify-content-end">
                                            <small class="font-bold font-italic uppercase">{{formatCurrency(Number(lokasi.tot_pallet).toFixed(2))}}</small>
                                        </div>
                                    </template>
                                </Column>
                            </Row>
                            <Row>
                                <Column>
                                    <template #footer>
                                        <small class="font-bold font-italic uppercase">Kapasitas WH</small>
                                    </template>
                                </Column>
                                <Column>
                                    <template #footer>
                                        <div class="flex justify-content-end">
                                            <small class="font-bold font-italic uppercase">{{formatCurrency(Number(lokasi.kapasitas_wh.ctn).toFixed(2))}}</small>
                                        </div>
                                    </template>
                                </Column>
                                <Column>
                                    <template #footer>
                                        <div class="flex justify-content-end">
                                            <small class="font-bold font-italic uppercase">{{formatCurrency(Number(lokasi.kapasitas_wh.mt).toFixed(2))}}</small>
                                        </div>
                                    </template>
                                </Column>
                                <Column>
                                    <template #footer>
                                        <div class="flex justify-content-end">
                                            <small class="font-bold font-italic uppercase">{{formatCurrency(Number(lokasi.kapasitas_wh.pallet).toFixed(2))}}</small>
                                        </div>
                                    </template>
                                </Column>
                            </Row>
                        </ColumnGroup>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>