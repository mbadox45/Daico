<script setup>
    // Vue Component
    import { ref, computed, onMounted, defineProps, watch } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API ========================================================================================================================================================
    import {formatCurrency} from '@/views/load_data/func_dummy.js'
    import {loadLocation, addLocation, updateLocation} from '@/views/load_data/master_config.js'

    const route = useRoute();
    const router = useRouter();

    // VARIABLE
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const loadingTable = ref(false)
    const load = ref([])
    const list_location = ref([])
    const forms = ref(
        {id: null, name: null}
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
            // list_location.value = await loadLocation();
            load.value = await loadLocation()
            loadingTable.value = false
        } catch (error) {
            load.value = []
            loadingTable.value = false
        }
    }

    const loadToEdit = (data) => {
        forms.value = {
            id: data.id, name: data.name,
        }
    }

    const resetForm = () => {
        messages.value = []
        forms.value = {
            id: null, name: null,
        }
    }

    const postData = async() => {
        loadingTable.value = true
        try {
            if (forms.value.name != null) {
                let response;
                if (forms.value.id != null) {
                    response = await updateLocation(forms.value.id, forms.value)
                } else {
                    response = await addLocation(forms.value)
                }
                if (response.success == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di update', id: count.value++ }
                    ];
                    loadData()
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
                    <label class="text-sm">Location</label>
                    <InputText type="text" v-model="forms.name" class="w-full" placeholder="Location"/>
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
                            <small>Lokasi</small>
                        </div>
                    </template>
                    <template #body="{data}"> 
                        <div class="w-full flex justify-content-center">
                            <small class="font-medium">{{ data.name }}</small>
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