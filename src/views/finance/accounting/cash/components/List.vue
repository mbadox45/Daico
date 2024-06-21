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
            load.value = response.list_rekening
            load_rekening_on_hand.value = response.list_on_hand
            total_cash_inl.value = response.total
            total_cash_on_hand.value = response.total_on_hand
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
        <div>
            <p class="font-italic">REKENING UNIT KERJA</p>
            <DataTable :value="load" class="text-sm" >
                <Column field="nama">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>NAMA REKENING</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.nama }}</small>
                    </template>
                </Column>
                <Column field="nomor">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>NO REKENING</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.nomor }}</small>
                    </template>
                </Column>
                <Column field="nomor">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>JENIS REKENING</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.jenis }}</small>
                    </template>
                </Column>
                <Column field="matauang">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>MATA UANG</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.matauang }}</small>
                    </template>
                </Column>
                <Column field="keterangan">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>KETERANGAN</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.keterangan }}</small>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>VALUE</small>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="w-full flex justify-content-end">
                            <small class="font-medium">{{ formatCurrency(Number(data.value).toFixed(0)) }}</small>
                        </div>
                    </template>
                </Column>
                <ColumnGroup type="footer">
                    <Row>
                        <Column colspan="4">
                            <template #footer>
                                <small class="font-bold font-italic"></small>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <small class="font-bold font-italic">Jumlah Cash PT INL</small>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ formatCurrency(Number(total_cash_inl).toFixed(0)) }}</small>
                                </div>
                            </template>
                        </Column>
                    </Row>
                </ColumnGroup>
            </DataTable>
        </div>
        <div >
            <p class="font-italic uppercase">Rekening Cash on Hand</p>
            <DataTable :value="load_rekening_on_hand" class="text-sm" >
                <Column field="nama">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic uppercase">
                            <small>Tipe Rekening</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <small class="font-medium">{{ data.nama }}</small>
                    </template>
                </Column>
                <Column field="value">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic">
                            <small>VALUE</small>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="w-full flex justify-content-end">
                            <small class="font-medium">{{ formatCurrency(Number(data.value).toFixed(0)) }}</small>
                        </div>
                    </template>
                </Column>
                <ColumnGroup type="footer">
                    <Row>
                        <Column>
                            <template #footer>
                                <small class="font-bold font-italic">Jumlah Cash on Hand</small>
                            </template>
                        </Column>
                        <Column>
                            <template #footer>
                                <div class="w-full flex justify-content-end">
                                    <small class="font-bold">{{ formatCurrency(Number(total_cash_on_hand).toFixed(0)) }}</small>
                                </div>
                            </template>
                        </Column>
                    </Row>
                </ColumnGroup>
            </DataTable>
        </div>
    </div>
</template>