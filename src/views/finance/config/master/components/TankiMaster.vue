<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API ========================================================================================================================================================
    import {formatCurrency} from '@/views/load_data/func_dummy.js'
    import {loadTank, loadLocation, addTank, updateTank} from '@/views/load_data/master_config.js'

    const route = useRoute();
    const router = useRouter();

    // VARIABLE
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const loadingTable = ref(false)
    const load = ref([])
    const list_location = ref([])
    const forms = ref(
        {id: null, location_id: null, name: null, capacity: null}
    )

    const messages = ref([]);
    let count = ref(0);

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        loadingTable.value = true
        try {
            messages.value = []
            const response = await loadTank();
            const data = []
            for (let i = 0; i < response.length; i++) {
                data.push({
                    id: response[i].id,
                    name: response[i].name,
                    capacity: Number(response[i].capacity),
                    location: response[i].location.name,
                    location_id: response[i].location_id,
                })
            }
            list_location.value = await loadLocation();
            load.value = data
            loadingTable.value = false
        } catch (error) {
            load.value = []
            loadingTable.value = false
        }
    }

    const loadToEdit = (data) => {
        forms.value = {
            id: data.id, location_id: data.location_id, name: data.name, capacity: data.capacity
        }
    }

    const resetForm = () => {
        forms.value = {
            id: null, location_id: null, name: null, capacity: null
        }
    }

    const postData = async() => {
        loadingTable.value = true
        try {
            if (forms.value.location_id != null && forms.value.name != null && forms.value.capacity != null) {
                let response;
                if (forms.value.id != null) {
                    response = await updateTank(forms.value.id, forms.value)
                } else {
                    response = await addTank(forms.value)
                }
                if (response.success == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di update', id: count.value++ }
                    ];
                    loadData()
                    resetForm()
                } else {
                    messages.value = [
                        { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
                    ];
                }
            } else {
                messages.value = [
                    { severity: 'warn', content: 'Mohon data diisi dengan lengkap', id: count.value++ }
                ];
            }
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
            messages.value = [
                { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
            ];
        }
    }

</script>
<template>
    <div class="flex flex-column gap-5">
        <div class="flex flex-column">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex gap-3 border-1 p-3 border-round border-gray-300 align-items-end">
                <div class="flex flex-column gap-1 w-full">
                    <label class="text-sm">Tank</label>
                    <InputText type="text" v-model="forms.name" class="w-full" placeholder="Tank"/>
                </div>
                <div class="flex flex-column gap-1 w-full">
                    <label class="text-sm">Capacity</label>
                    <InputNumber v-model="forms.capacity" class="w-full" placeholder="Capacity" :maxFractionDigits="0" inputId="locale-german" locale="de-DE" />
                </div>
                <div class="flex flex-column gap-1 w-full">
                    <label class="text-sm">Location</label>
                    <Dropdown v-model="forms.location_id" filter :options="list_location" optionLabel="name" optionValue="id" placeholder="Select a Location" class="w-full md:w-56"/>
                </div>
                <div class="flex">
                    <Button icon="pi pi-save" size="large" severity="success" text class="h-3rem w-3rem" @click="postData"/>
                    <Button icon="pi pi-refresh" size="large" severity="secondary" text class="h-3rem w-3rem" @click="resetForm"/>
                </div>
            </div>
        </div>
        <div class="flex flex-column gap-4 p-3 border-1 border-round border-gray-300">
            <div class="flex flex-column gap-1 w-full">
                <div class="p-inputgroup p-fluid">
                    <span class="p-inputgroup-addon bg-white">
                        <i class="pi pi-search"></i>
                    </span>
                    <InputText type="text" placeholder="Search" class="w-full" v-model="filters['global'].value"/>
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
            <DataTable v-else :value="load" v-model:filters="filters" showGridlines class="text-sm" scrollable scrollHeight="240px" >
                <Column field="name">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic uppercase">
                            <small>Tanki</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <div class="w-full flex justify-content-center">
                            <small class="font-medium">{{ data.name }}</small>
                        </div>
                    </template>
                </Column>
                <Column field="location">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic uppercase">
                            <small>Lokasi</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <div class="w-full flex justify-content-center">
                            <small class="font-medium">{{ data.location }}</small>
                        </div>
                    </template>
                </Column>
                <Column field="capacity">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic uppercase">
                            <small>Kapasitas</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <div class="w-full flex justify-content-center">
                            <small class="font-medium">{{ formatCurrency(data.capacity) }}</small>
                        </div>
                    </template>
                </Column>
                <Column field="capacity">
                    <template #header>
                        <div class="flex justify-content-center w-full font-italic uppercase">
                            <small>Aksi</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <div class="w-full flex justify-content-center">
                            <Button class="h-1rem" text severity="warning" icon="pi pi-pencil" @click="loadToEdit(data)"/>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>