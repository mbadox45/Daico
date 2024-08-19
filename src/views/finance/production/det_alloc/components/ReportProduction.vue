<script setup>
    import { ref, onMounted, defineProps, watch } from 'vue';
    import { FilterMatchMode } from 'primevue/api';

    // Components
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";

    // Variable
    const props = defineProps({
        datas:{
            type:Array,
            default: () => {}
        }
    });

    const load = ref([]);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});

    // Function
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        // loadingTable.value = true
        try {
            const response = props.datas;
            load.value = response
            // loadingTable.value = false
        } catch (error) {
            load.value = []
            // loadingTable.value = false
        }
    }

    watch(() => props.datas, loadData, { immediate: true });
</script>

<template>
    <div class="flex flex-column gap-4">
        <div class="flex align-items-center gap-3">
            <span class="font-bold text-2xl font-italic w-full">Laporan Produksi</span>
            <div class="p-inputgroup p-fluid">
                <span class="p-inputgroup-addon bg-white">
                    <i class="pi pi-search"></i>
                </span>
                <InputText type="text" placeholder="Search by Date" class="w-full" v-model="filters['global'].value"/>
            </div>
        </div>
        <div class="w-full">
            <DataTable :value="load" v-model:filters="filters" rowGroupMode="subheader" showGridlines scrollHeight="430px" scrollable groupRowsBy="kategori" sortMode="single" sortField="id_kategori" :sortOrder="1" tableStyle="min-width: 50rem" :globalFilterFields="['kategori', 'name', 'satuan', 'qty']">
                <Column field="kategori" header="Representative" style="min-width: 200px"></Column>
                <Column style="min-width: 150px">
                    <template #header>
                        <div class="flex w-full justify-content-center">
                            <span class="font-bold font-italic text-sm">Uraian</span>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="flex align-items-center gap-2">
                            <span class="font-normal text-xs"><span v-html="data.name"></span></span>
                        </div>
                    </template>
                </Column>
                <Column>
                    <template #header>
                        <div class="flex w-full justify-content-center">
                            <span class="font-bold font-italic text-sm">UoM</span>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="flex align-items-center w-full justify-content-center gap-2">
                            <span class="font-semibold text-xs">{{ data.satuan }}</span>
                        </div>
                    </template>
                </Column>
                <Column>
                    <template #header>
                        <div class="flex w-full justify-content-center">
                            <span class="font-bold font-italic text-sm">Plant</span>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="flex align-items-center w-full justify-content-center gap-2">
                            <span class="font-semibold text-xs">{{ data.plant }}</span>
                        </div>
                    </template>
                </Column>
                <Column style="min-width: 150px">
                    <template #header>
                        <div class="flex w-full justify-content-center">
                            <span class="font-bold font-italic text-sm">QTY</span>
                        </div>
                    </template>
                    <template #body="{data}">
                        <div class="flex align-items-center w-full justify-content-end gap-2">
                            <span class="font-semibold text-xs">{{ data.qty }}</span>
                        </div>
                    </template>
                </Column>
                <template #groupheader="slotProps">
                    <div class="flex align-items-center gap-2">
                        <span class="font-bold font-italic">{{ slotProps.data.kategori }}</span>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>