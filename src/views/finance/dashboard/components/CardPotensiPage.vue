<script setup>
    // Vue Component
    import { ref, computed } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API
    import {potensi_margin} from '@/api/dummy/potensi_margin.js'

    // Variable
    const list_potensi_margin = ref([])
    const pm = potensi_margin
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});

    // Function
    const loadProduct = () => {
        list_potensi_margin.value = []
        for (let i = 0; i < pm.length; i++) {
            list_potensi_margin.value.push({
                type: pm[i].type,
                diff: pm[i].diff,
                idr_kpbn: changeValue(Math.round(pm[i].idr_kpbn)),
                usd_kpbn: changeValue(Math.round(pm[i].usd_kpbn)),
                idr_olah: changeValue(Math.round(pm[i].idr_olah)),
                usd_olah: changeValue(Math.round(pm[i].usd_olah)),
            })
        }
        // console.log(list_potensi_margin.value)
    }

    const changeValue = (value) => {
        return value > 0 ? value : value == 0 ? null : `(${value*(-1)})`
    } 

    loadProduct()
</script>

<template>
    <div class="flex flex-column gap-3 py-2">
        <div class="p-3 border-1 border-round border-gray-300 flex flex-column gap-5 bg-white">
            <span class="font-semibold text-xl text-center w-full border-bottom-1 pb-3 border-gray-300">Average CPO</span>
            <!-- Produk Kemasan -->
            <DataTable :value="list_potensi_margin" rowGroupMode="subheader" groupRowsBy="type" sortMode="single" sortField="type" :sortOrder="1">
                <template #empty> No customers found. </template>
                <template #loading> Loading customers data. Please wait. </template>
                <template #groupheader="slotProps">
                    <div class="flex align-items-center gap-2 w-full">
                        <!-- <img :alt="slotProps.data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.data.representative.image}`" width="32" style="vertical-align: middle" /> -->
                        <strong class="uppercase text-lg">{{ slotProps.data.type }}</strong>
                    </div>
                </template>
                <ColumnGroup type="header">
                    <Row>
                        <Column header="Diff" :rowspan="2" />
                        <Column :colspan="2">
                            <template #header>
                                <div class="text-center w-full flex justify-content-center">
                                    <span>Avg CPO KPBN to Production Cost</span>
                                </div>
                            </template>
                        </Column>
                        <Column :colspan="2">
                            <template #header>
                                <div class="text-center w-full flex justify-content-center">
                                    <span>Avg CPO Olah to Production Cost</span>
                                </div>
                            </template>
                        </Column>
                    </Row>
                    <Row>
                        <Column field="idr_kpbn">
                            <template #header>
                                <div class="text-center w-full flex justify-content-center">
                                    <span>IDR</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="usd_kpbn">
                            <template #header>
                                <div class="text-center w-full flex justify-content-center">
                                    <span>USD</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="idr_olah">
                            <template #header>
                                <div class="text-center w-full flex justify-content-center">
                                    <span>IDR</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="usd_olah">
                            <template #header>
                                <div class="text-center w-full flex justify-content-center">
                                    <span>USD</span>
                                </div>
                            </template>
                        </Column>
                    </Row>
                </ColumnGroup>
                <Column field="type">
                    <template #body="{ data }">
                        <strong class="text-sm font-medium">{{ data.type }}</strong>
                    </template>
                </Column>
                <Column field="diff">
                    <template #body="{ data }">
                        <strong class="text-sm font-medium">{{ data.diff }}</strong>
                    </template>
                </Column>
                <Column field="idr_kpbn">
                    <template #body="{ data }">
                        <div class="text-center w-full flex justify-content-end">
                            {{ data.idr_kpbn }}
                        </div>
                    </template>
                </Column>
                <Column field="usd_kpbn">
                    <template #body="{ data }">
                        <div class="text-center w-full flex justify-content-end">
                            {{ data.usd_kpbn }}
                        </div>
                    </template>
                </Column>
                <Column field="idr_olah">
                    <template #body="{ data }">
                        <div class="text-center w-full flex justify-content-end">
                            {{ data.idr_olah }}
                        </div>
                    </template>
                </Column>
                <Column field="usd_olah">
                    <template #body="{ data }">
                        <div class="text-center w-full flex justify-content-end">
                            {{ data.usd_olah }}
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>