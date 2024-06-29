<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API ========================================================================================================================================================
    import {formatCurrency} from '@/views/load_data/func_dummy.js'

    // Components
    import TankiMaster from '@/views/finance/config/master/components/TankiMaster.vue'
    import LokasiMaster from '@/views/finance/config/master/components/LokasiMaster.vue'

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

    const visible = ref(false);
    const header_dialog = ref('')
    const status_dialog = ref('')
    const menu = ref();
    const items = ref([
    {
        label: 'Master Data',
        items: [
            {
                label: 'Tanki',
                icon: 'pi pi-database',
                command: () => {
                    visible.value = true;
                    header_dialog.value = 'Master Tanki';
                    status_dialog.value = 'tanki'
                }
            },
            {
                label: 'Lokasi',
                icon: 'pi pi-map-marker',
                command: () => {
                    visible.value = true;
                    header_dialog.value = 'Master Lokasi';
                    status_dialog.value = 'lokasi'
                }
            }
        ]
    }
    ]);

    const toggle = (event) => {
        menu.value.toggle(event);
    };

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
        <div class="flex flex-column gap-3">
            <Dialog v-model:visible="visible" modal :header="header_dialog" :style="{ width: '55rem' }">
                <tanki-master v-if="status_dialog == 'tanki'"/>
                <lokasi-master v-else/>
                <template #footer>
                    <div class="flex justify-content-end gap-2 mt-2">
                        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    </div>
                </template>
            </Dialog>
            <div class="flex justify-content-between gap-5">
                <Button label="Update Data" severity="warning" size="small" class="h-2rem" @click="()=>{router.push('/form-bulky-stock')}"/>
                <div>
                    <Button type="button" icon="pi pi-cog" @click="toggle" aria-haspopup="true" severity="info" rounded aria-controls="overlay_menu"  class="h-2rem w-2rem"/>
                    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
                </div>
            </div>
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
                        <small class="font-medium">{{ data.product }}</small>
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
                            <small class="font-medium">{{ formatCurrency(Number(data.stok_mt).toFixed(0)) }}</small>
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
                            <small class="font-medium">{{ formatCurrency(Number(data.stok_exc_btm_mt).toFixed(0)) }}</small>
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
                            <small class="font-medium">{{ formatCurrency(Number(data.space).toFixed(0)) }}</small>
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
                            <small class="font-medium">{{ formatCurrency(Number(data.umur).toFixed(0)) }}</small>
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
                            <small class="font-medium">{{ data.remarks }}</small>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>