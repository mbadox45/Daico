<script setup>
    // Vue Component
    import { ref, computed, onMounted } from "vue";
    import { FilterMatchMode } from "primevue/api";
    import moment from "moment";

    // API ========================================================================================================================================================
    import { loadAll_TankMaster, add_TankMaster, update_TankMaster, } from "@/controller/master_data/TankController.js";
    import { loadAll_LocationMaster } from "@/controller/master_data/LocationController.js";
    import { formatCurrency } from "@/controller/dummy/func_dummy.js";
    import { cek_token } from "@/api/DataVariable.js";

    // VARIABLE
    const products = ref([]);
    const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    const forms = ref({ id: null, location_id: null, name: null, capacity: null });
    const loadingTable = ref(false);

    // Dialog Configure
    const visible = ref(false);
    const status_form = ref("add");
    const title_dialog = ref("");
    const loading_save = ref(false);
    const load_lokasi = ref([]);

    // Message Configure
    const messages = ref([]);
    let count = ref(0);
    const time = ref(3000);

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData();
    });

    const loadData = async () => {
        try {
            loadingTable.value = true;
            const data = await loadAll_TankMaster();
            const list = [];
            if (data != null) {
                // console.log(data.length)
                for (let a = 0; a < data.length; a++) {
                    list.push({ id: data[a].id, name: data[a].name, capacity: Number(data[a].capacity), location: data[a].location.name, location_id: data[a].location_id,});
                }
            }
            products.value = list;
            loadingTable.value = false;
        } catch (error) {
            products.value = [];
            loadingTable.value = false;
        }
    };
    const loadDropdown = async () => {
        try {
            const data = await loadAll_LocationMaster();
            const list = [];
            if (data != null) {
                for (let a = 0; a < data.length; a++) {
                    list.push({ id: data[a].id, name: data[a].name });
                }
            }
            load_lokasi.value = list;
        } catch (error) {
            load_lokasi.value = [];
        }
    };

    const formDatabase = (cond, data) => {
        messages.value = [];
        visible.value = true;
        status_form.value = cond;
        loading_save.value = false;
        loadDropdown()
        title_dialog.value = cond == "add" ? "Tank - Tambah Data" : cond == "edit" ? "Tank - Edit Data" : "Tank - Hapus Data";
        if (cond == "add") {
            resetForm();
        } else {
            forms.value = { id: data.id, location_id: data.location_id, name: data.name, capacity: data.capacity };
        }
    };

    const resetForm = () => {
        forms.value = { id: null, location_id: null, name: null, capacity: null };
    };

    const saveData = async () => {
        status_form.value;
        if (forms.value.name != null && forms.value.name != "" && forms.value.location_id != null && forms.value.capacity != null) {
            loading_save.value = true;
            if (status_form.value == "add") {
                const response = await add_TankMaster(forms.value);
                if (response.status == true) {
                    messages.value = [{ severity: "success", content: response.msg, id: count.value++ }];
                    setTimeout(function () {
                        loading_save.value = false;
                        loadData();
                        visible.value = false;
                    }, time.value);
                } else {
                    let severity = "";
                    if (response.code == 400) {
                        severity = "warning";
                    } else {
                        severity = "error";
                    }
                    loading_save.value = false;
                    messages.value = [{ severity: severity, content: response.msg, id: count.value++ }];
                }
            } else if (status_form.value == "edit") {
                const response = await update_TankMaster(forms.value.id, forms.value);
                if (response.status == true) {
                    messages.value = [{ severity: "success", content: response.msg, id: count.value++ }];
                    setTimeout(function () {
                        loading_save.value = false;
                        loadData();
                        visible.value = false;
                    }, time.value);
                } else {
                    let severity = "";
                    if (response.code == 400) {
                        severity = "warning";
                    } else {
                        severity = "error";
                    }
                    loading_save.value = false;
                    messages.value = [{ severity: severity, content: response.msg, id: count.value++ }];
                }
            } else {
                messages.value = [{ severity: "success", content: "Data berhasil di hapus", id: count.value++ }];
            }
        } else {
            messages.value = [{ severity: "warn", content: "Mohon data diisi dengan lengkap", id: count.value++ }];
        }
    };
</script>

<template>
    <div class="flex-auto flex flex-column gap-3 p-3 bg-white shadow-3">
        <span class="font-medium text-xl">Master Tank</span>
        <div class="flex justify-content-between align-items-center gap-5">
            <div :class="cek_token == null ? 'hidden' : 'flex'" class="w-auto gap-2">
                <Button icon="pi pi-plus" severity="info" size="small" @click="formDatabase('add', null)" />
            </div>
            <div class="p-inputgroup p-fluid">
                <span class="p-inputgroup-addon bg-white"> <i class="pi pi-search"></i> </span>
                <InputText type="text" placeholder="Search" class="w-full" v-model="filters['global'].value" />
            </div>
        </div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal :header="title_dialog" :style="{ width: '50rem' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex flex-column gap-3">
                <div class="flex flex-column gap-1">
                    <label for="name" class="font-semibold">Name <small class="text-red-500">*</small></label>
                    <InputText id="name" v-model="forms.name" class="flex-auto" placeholder="100" autocomplete="off"/>
                </div>
                <div class="flex flex-column gap-1">
                    <label for="value" class="font-semibold">Capacity <small class="text-red-500">*</small></label>
                    <InputNumber id="value" v-model="forms.capacity" inputId="locale-german" locale="de-DE" class="flex-auto" :minFractionDigits="2" placeholder="1.000,00"/>
                    <!-- <InputText id="value" v-model="forms.setting_value" class="flex-auto" placeholder="contoh: 1000 atau 1000, 1000-SBY" autocomplete="off"/> -->
                </div>
                <div class="flex flex-column gap-1">
                    <label for="lokasi" class="font-semibold">Location <small class="text-red-500">*</small></label>
                    <Dropdown v-model="forms.location_id" :options="load_lokasi" filter optionLabel="name" optionValue="id" placeholder="Select a Location" class="flex-auto"></Dropdown>
                    <!-- <InputText id="lokasi" v-model="forms.location_id" class="flex-auto" placeholder="contoh: 1000 atau 1000, 1000-SBY" autocomplete="off"/> -->
                </div>
            </div>
            <template #footer>
                <div class="flex justify-content-end gap-2 mt-3">
                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false" ></Button>
                    <Button type="button" :label="loading_save == true ? 'Saving...' : 'Save'" :disabled="loading_save" @click="saveData"></Button>
                </div>
            </template>
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
        <DataTable v-else v-model:filters="filters" :value="products" dataKey="id" scrollable scrollHeight="480px" :globalFilterFields="['name', 'location', 'capacity']">
            <template #empty> No tank found. </template>
            <template #loading> Loading tank data. Please wait. </template>
            <Column field="name">
                <template #header>
                    <div class="flex w-full font-italic uppercase">
                        <small>Tank</small>
                    </div>
                </template>
                <template #body="{ data }">
                    <small class="font-medium">{{ data.name }}</small>
                </template>
            </Column>
            <Column field="setting_name">
                <template #header>
                    <div class="flex w-full font-italic uppercase">
                        <small>Location</small>
                    </div>
                </template>
                <template #body="{ data }">
                    <small class="font-medium">{{ data.location }}</small>
                </template>
            </Column>
            <Column field="setting_value">
                <template #header>
                    <div class="flex w-full font-italic uppercase">
                        <small>Capacity</small>
                    </div>
                </template>
                <template #body="{ data }">
                    <small class="font-medium">{{ formatCurrency(data.capacity) }}</small>
                </template>
            </Column>
            <Column field="nama">
                <template #body="{ data }">
                    <div class="w-full flex justify-content-end">
                        <Button icon="pi pi-pencil" severity="warning" text size="small" @click="formDatabase('edit', data)"></Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
