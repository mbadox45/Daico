<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import moment from 'moment';

    // API ========================================================================================================================================================
    import {master} from '@/api/dummy/variable_form.js';
    import RetailProdMaster from '@/api/master/RetailProdMaster.js';

    // VARIABLE
    const searchKeyword = ref('');
    const products = ref([]);
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const forms = ref({
            id: null,
            name: null,
            nama: null,
        })
    const loadingTable = ref(false)
    
    // Dialog Configure
    const visible = ref(false);
    const status_form = ref('add');
    const title_dialog = ref('');

    // Message Configure
    const messages = ref([]);
    let count = ref(0);
    const time = ref(3000)

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const filteredList = computed(() => {
        return products.value.filter(item =>
            item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
        );
    });

    const loadData = async() => {
        try {
            loadingTable.value = true
            products.value = [];
            const response = await RetailProdMaster.getAll()
            const load = response.data;
            // console.log(load)
            const data = load.mBulky;
            for (let a = 0; a < data.length; a++) {
                products.value.push({
                    id:data[a].id,
                    nama:data[a].name,
                    name:data[a].name,
                })
            }
            loadingTable.value = false
        } catch (error) {
            products.value = []
            loadingTable.value = false
        }
    }

    const formDatabase = (cond, data) => {
        messages.value = []
        visible.value = true
        status_form.value = cond;
        title_dialog.value = cond == 'add' ? 'Bulky - Tambah Data' : cond == 'edit' ? 'Bulky - Edit Data' : 'Bulky - Hapus Data' ;
        if (cond == 'add') {
            resetForm()
        } else {
            forms.value = {
                id: data.id,
                name: data.name,
                nama: data.nama
            }
        }
    }

    const resetForm = () => {
        forms.value = {
            id: null,
            name: null,
            nama: null,
        }
    }

    const saveData = async () => {
        status_form.value
        if (forms.value.name != null) {
            forms.value.nama = forms.value.name
            if (status_form.value == 'add') {
                const response = await RetailProdMaster.addPost(forms.value);
                const load = response.data;
                if (load.success == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di tambahkan', id: count.value++ }
                    ];
                    setTimeout(function() {
                        loadData()
                        visible.value = false
                    }, time.value);
                } else {
                    messages.value = [
                        { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
                    ];
                }
            } else if (status_form.value == 'edit') {
                const response = await RetailProdMaster.updatePost(forms.value.id, forms.value);
                const load = response.data;
                if (load.success == true) {
                    messages.value = [
                        { severity: 'success', content: 'Data berhasil di update', id: count.value++ }
                    ];
                    setTimeout(function() {
                        loadData()
                        visible.value = false
                    }, time.value);
                } else {
                    messages.value = [
                        { severity: 'error', content: 'Proses gagal, silahkan hubungi tim IT', id: count.value++ }
                    ];
                }
            } else {
                messages.value = [
                    { severity: 'success', content: 'Data berhasil di hapus', id: count.value++ }
                ];
            }
        } else {
            messages.value = [
                { severity: 'warn', content: 'Mohon data diisi dengan lengkap', id: count.value++ }
            ];
        }
    }
</script>

<template>
    <div class="flex-auto flex flex-column gap-3 p-3 bg-white shadow-3">
        <span class="font-medium text-xl">Master Retail Produksi</span>
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-auto flex gap-2">
                <Button icon="pi pi-plus" severity="info" size="small" @click="formDatabase('add', null)"/>
            </div>
            <div class="p-inputgroup p-fluid ">
                <span class="p-inputgroup-addon bg-white">
                    <i class="pi pi-search"></i>
                </span>
                <InputText type="text" placeholder="Search" class="w-full" v-model="searchKeyword"/>
                <!-- <InputText type="text" placeholder="Search" class="w-full" v-model="filters['global'].value"/> -->
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '50rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex flex-column gap-3">
                <label for="username" class="font-semibold">Name <small class="text-red-500">*</small></label>
                <InputText id="username" v-model="forms.name" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="saveData"></Button>
            </div>
        </Dialog>

        <!-- Table -->
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <DataView v-else :value="filteredList" :layout="'list'" :paginator="true" :rows="10">
            <template #list="slotProps">
                <div class="col-12">
                    <div class="flex flex-column md:flex-row align-items-center p-3 w-full border-1 my-2 border-round border-gray-300">
                        <img :src="'/images/liquid-drop.png'" :alt="slotProps.data.name" class="my-4 md:my-0 w-6 md:w-4rem mr-5" />
                        <div class="flex-1 text-center md:text-left">
                            <div class="font-bold text-2xl">{{ slotProps.data.name }}</div>
                            <div class="flex align-items-center">
                                <i class="pi pi-filter-fill mr-2 text-green-300"></i>
                                <span class="font-normal text-gray-600">Retail</span>
                            </div>
                        </div>
                        <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                            <Button icon="pi pi-pencil" severity="warning" size="small" @click="formDatabase('edit',slotProps.data)"></Button>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>