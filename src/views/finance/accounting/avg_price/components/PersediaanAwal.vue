<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import { cek_token } from "@/api/DataVariable.js";

    const route = useRoute();
    const router = useRouter();

    const props = defineProps({
        date:{
            type:String,
            default: '',
        },
        datas:{
            type:Array,
            default: () => []
        }
    });

    // VARIABLE
    const tombol_add = ref(false) 
    const tombol_update = ref(false)
    const rute = ref('')
    // const rute = ref({})
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
            const tanggal = props.date;
            console.log(tanggal)
            load.value = response.list
            if (load.value.length > 0) {
                tombol_update.value = true
                tombol_add.value = false
                // rute.value = {name:'form average price', query: { tgl: tanggal }, params:{status:'update', data:response.list}}
                rute.value = `/form-avg-price/update?tgl=${tanggal}`
            } else {
                rute.value = `/form-avg-price/add`
                // rute.value = {name:'form average price', params:{status:'add'}}
                tombol_add.value = true
                tombol_update.value = false
            }
            total_qty.value = response.tot_qty
            total_total.value = response.tot_jumlah
            total_harga.value = response.tot_harga
            loadingTable.value = false
        } catch (error) {
            load.value = []
            total_qty.value = 0
            total_total.value = 0
            total_harga.value = 0
            loadingTable.value = false
        }
    }

    watch(() => [() => props.datas, () => props.date],
    ([newDatas, newDate]) => {
        loadData();
    }, { immediate: true });

</script>

<template>
    <div class="flex flex-column w-full gap-4">
        <div class="flex gap-3 justify-content-between align-items-center">
            <span class="font-bold text-xl font-italic w-full">Persediaan Awal</span>
            <div :class="cek_token != null ? 'flex' : 'hidden'" class="justify-content-end w-full">
                <Button label="Tambah Data" v-show="tombol_add == true" severity="info" size="small" class="py-2" @click="()=>{router.push(rute)}"/>
                <Button label="Update Data" v-show="tombol_update == true" severity="warning" size="small" class="py-2" @click="()=>{router.push(rute)}"/>
            </div>
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
                            <Button v-if="cek_token != null" icon="pi pi-pencil" text severity="warning" size="small" class="p-1"/>
                            <span>{{ data.nama }}</span>
                        </small>
                        <small class="font-medium font-italic w-full flex justify-content-end">{{ moment(data.tanggal).format('MMM YYYY') }}</small>
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