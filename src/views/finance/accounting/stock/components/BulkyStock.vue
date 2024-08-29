<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API ========================================================================================================================================================
    import {formatCurrency} from '@/views/load_data/func_dummy.js'
    import { cek_token } from "@/api/DataVariable.js";

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
    <div class="w-full flex flex-column gap-6">
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
            <div :class="cek_token == null ? 'hidden' : 'flex'" class="justify-content-between gap-5">
                <Button label="Update Data" severity="warning" size="small" class="h-2rem" @click="()=>{router.push('/form-bulky-stock')}"/>
                <div>
                    <Button type="button" icon="pi pi-cog" @click="toggle" aria-haspopup="true" severity="info" rounded aria-controls="overlay_menu"  class="h-2rem w-2rem"/>
                    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
                </div>
            </div>
            <div class="p-3 flex flex-column gap-3">
                <div class="grid text-sm font-semibold font-italic bg-gray-200">
                    <div class="col-1 text-center border-1 border-gray-300">No Tank</div>
                    <div class="col-3 text-center border-1 border-gray-300">Produk</div>
                    <div class="col-1 text-center border-1 border-gray-300">Kapasitas</div>
                    <div class="col-1 text-center border-1 border-gray-300">Stock MT</div>
                    <div class="col-1 text-center border-1 border-gray-300">Stock</div>
                    <div class="col-1 text-center border-1 border-gray-300">Space</div>
                    <div class="col-1 text-center border-1 border-gray-300">Umur</div>
                    <div class="col-3 text-center border-1 border-gray-300">Remarks</div>
                </div>
                <div class="grid text-xs font-normal font-italic" v-for="(item, index) in load" :key="index" :class="item.tank_name == 'Total' ? 'bg-gray-200' : 'bg-white'">
                    <div v-if="item.tank_name == 'Total'" class="col-4 font-bold border-1 border-gray-300">TOTAL</div>
                    <div v-if="item.tank_name != 'Total'" class="col-1 text-center border-1 border-gray-300">{{item.tank_name}}</div>
                    <div v-if="item.tank_name != 'Total'" class="col-3 border-1 border-gray-300">{{item.nama_produk}}</div>
                    <div class="col-1 text-right border-1 border-gray-300">{{ item.capacity }}</div>
                    <div class="col-1 text-right border-1 border-gray-300">{{ formatCurrency(Number(item.stok_mt).toFixed(0)) }}</div>
                    <div class="col-1 text-right border-1 border-gray-300">{{ formatCurrency(Number(item.stok_exc_btm_mt).toFixed(0)) }}</div>
                    <div class="col-1 text-right border-1 border-gray-300">{{ formatCurrency(Number(item.space).toFixed(0)) }}</div>
                    <div v-if="item.tank_name != 'Total'" class="col-1 text-right border-1 border-gray-300">{{ formatCurrency(Number(item.umur).toFixed(0)) }}</div>
                    <div v-if="item.tank_name != 'Total'" class="col-3 border-1 border-gray-300">{{item.remarks}}</div>
                    <div v-if="item.tank_name == 'Total'" class="col-4 text-center border-1 border-gray-300"></div>
                </div>
            </div>
        </div>
    </div>
</template>