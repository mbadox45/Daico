<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';

    // API
    import CategoryProdMaster from '@/api/master/CategoryProdMaster.js';
    import PlantMaster from '@/api/master/PlantMaster.js';
    import Laporan_Produksi from '@/api/det_alloc/Laporan_Produksi.js';

    const router = useRouter();
    const route = useRoute();

    // Variable
    const tgl_now = ref(moment().format('YYYY-MM'))
    const forms = ref([{
        id: null,
        id_plant: null,
        id_uraian: null,
        tanggal: tgl_now.value,
        value: null,
    }])
    const list_category = ref([])
    const list_plant = ref([])
    const loadingTable = ref(false)
    const time = ref(3000)

    onMounted(()=>{
        loadData();
    })

    const loadData = async() => {
        loadingTable.value = true
        try {
            const category = await loadCategory();
            const plant = await loadPlant();
            console.log(category, plant)
            if (category != null && plant != null) {
                let lc = []
                for (let i = 0; i < category.length; i++) {
                    const uraian = category[i].uraian;
                    for (let u = 0; u < uraian.length; u++) {
                        lc.push({
                            id: uraian[u].id,
                            nama: uraian[u].nama,
                        })
                    }
                }
                list_category.value = lc;
                list_plant.value = plant;

                // list Form
                const list = [];
                for (let i = 0; i < category.length; i++) {
                    const uraian = category[i].uraian;
                    for (let j = 0; j < uraian.length; j++) {
                        for (let k = 0; k < plant.length; k++) {
                            list.push({
                                id: null,
                                id_plant: plant[k].id,
                                id_uraian: uraian[j].id,
                                uraian: uraian[j].nama,
                                satuan: uraian[j].satuan,
                                id_category: category[i].id,
                                category: category[i].nama,
                                tanggal: tgl_now.value,
                                value: null,
                            })
                        }
                    }
                }
                console.log(list);
                forms.value = list;
            } else {
                
            }
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
        }
    }

    const loadListCategory = async() => {
        const category = await loadCategory();
        const list = []
        for (let i = 0; i < category.length; i++) {
            const uraian = category[i].uraian;
            for (let u = 0; u < uraian.length; u++) {
                list.push({
                    id: uraian[u].id,
                    nama: uraian[u].nama,
                })
            }
        }
        return list
    }

    const loadCategory = async() => {
        try {
            const response = await CategoryProdMaster.getAll();
            const load = response.data;
            const data = load.data;
            return data;
        } catch (error) {
            return null;
        }
    }

    const loadPlant = async() => {
        try {
            const response = await PlantMaster.getAll();
            const load = response.data;
            const data = load.Plant;
            return data;
        } catch (error) {
            return null;
        }
    }

    const postData = async() => {
        console.log(tgl_now.value)
    }

</script>
<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="flex justify-content-between align-items-center gap-2 w-full">
                <span class="font-medium text-xl uppercase">Form Detail Allocation </span>
                <div class="flex gap-2">
                    <Button label="Back" icon="pi pi-times" size="small" class="px-3 py-2" severity="danger" outlined @click="()=>{router.push('/det-alloc')}"/>
                    <Button label="Save" icon="pi pi-save" size="small" class="px-3 py-2" severity="success" @click="postData"/>
                </div>
            </div>
        </div>
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <form v-else class="flex flex-column gap-2">
            <div class="flex justify-content-end gap-1">
                <small class="font-medium">Note :</small>
                <small class="text-red-500">Apabila tidak ada nilai, bisa masukan nilai <span class="font-bold">0</span></small>
            </div>
            <DataTable :value="forms" rowGroupMode="subheader" groupRowsBy="category" sortMode="single" sortField="id_category" :sortOrder="1" tableStyle="min-width: 50rem">
                <Column field="category" header="Type"></Column>
                <template #groupheader="{data}">
                    <div class="flex align-items-center justify-content-between gap-2">
                        <span class="uppercase font-bold capitalize font-italic underline w-full">{{ data.category }}</span>
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon bg-white">
                                Tanggal
                            </span>
                            <InputText id="tanggal" v-model="tgl_now" type="month" class="w-full" autocomplete="off" />
                        </div>
                    </div>
                </template>
                <Column field="id_uraian" class="">
                    <template #header>
                        <span class="text-sm font-bold">Uraian</span>
                    </template>
                    <template #body="{data}">
                        <div class="w-full">
                            <Dropdown v-model="data.id_uraian" :options="list_category" optionLabel="nama" optionValue="id" placeholder="Select a Category" class="w-full" disabled/>
                        </div>
                    </template>
                </Column>
                <Column field="id_plant" class="">
                    <template #header>
                        <span class="text-sm font-bold">Plant</span>
                    </template>
                    <template #body="{data}">
                        <div class="w-full">
                            <Dropdown v-model="data.id_plant" :options="list_plant" optionLabel="nama" optionValue="id" placeholder="Select a Plant" class="w-full" disabled/>
                        </div>
                    </template>
                </Column>
                <Column field="real" style="width: 8rem;">
                    <template #header>
                        <span class="text-sm font-bold">UoM</span>
                    </template>
                    <template #body="{data}">
                        <div class="w-full">
                            <InputText id="tanggal" v-model="data.satuan" class="w-full" autocomplete="off" disabled />
                        </div>
                    </template>
                </Column>
                <Column field="real">
                    <template #header>
                        <span class="text-sm font-bold">Value</span>
                    </template>
                    <template #body="{data}">
                        <div class="w-full">
                            <InputNumber id="dmo" v-model="data.value" class="w-full" placeholder="Value" :maxFractionDigits="2" inputId="locale-german" locale="de-DE" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </form>
    </div>
</template>