<script setup>
    // Vue Component
    import { ref, computed, onMounted } from "vue";
    import { FilterMatchMode } from "primevue/api";
    import moment from "moment";

    // API ========================================================================================================================================================
    import { loadAll_SettingMaster, add_SettingMaster, update_SettingMaster, } from "@/controller/master_data/SettingController.js";
    import { cek_token } from "@/api/DataVariable.js";

    // VARIABLE
    const products = ref([]);
    const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    const forms = ref({ id: null, setting_value: null, setting_name: null });
    const loadingTable = ref(false);

    // Dialog Configure
    const visible = ref(false);
    const status_form = ref("add");
    const title_dialog = ref("");
    const loading_save = ref(false);

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
            const data = await loadAll_SettingMaster();
            const list = [];
            if (data != null) {
                for (let a = 0; a < data.length; a++) {
                    list.push({ id: data[a].id, setting_name: data[a].setting_name, setting_value: data[a].setting_value  });
                }
            }
            products.value = list;
            loadingTable.value = false;
        } catch (error) {
            products.value = [];
            loadingTable.value = false;
        }
    };

    const formDatabase = (cond, data) => {
        messages.value = [];
        visible.value = true;
        status_form.value = cond;
        loading_save.value = false;
        title_dialog.value = cond == "add" ? "Setting - Tambah Data" : cond == "edit" ? "Setting - Edit Data" : "Setting - Hapus Data";
        if (cond == "add") {
            resetForm();
        } else {
            forms.value = { id: data.id, setting_value: data.setting_value, setting_name: data.setting_name };
        }
    };

    const resetForm = () => {
        forms.value = { id: null, setting_value: null, setting_name: null };
    };

    const saveData = async () => {
        status_form.value;
        if (forms.value.setting_value != null && forms.value.setting_value != "" && forms.value.setting_name != null && forms.value.setting_name != "") {
            loading_save.value = true;
            if (status_form.value == "add") {
                const response = await add_SettingMaster(forms.value);
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
                const response = await update_SettingMaster(forms.value.id, {setting_value: forms.value.setting_value});
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
        <span class="font-medium text-xl">Master Setting</span>
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
                    <label for="name" class="font-semibold">Setting Name <small class="text-red-500">*</small></label>
                    <InputText id="name" v-model="forms.setting_name" :disabled="status_form == 'edit' ? true : false" class="flex-auto" placeholder="contoh: coa_bahan_baku" autocomplete="off"/>
                </div>
                <div class="flex flex-column gap-1">
                    <label for="value" class="font-semibold">Setting Value <small class="text-red-500">*</small></label>
                    <InputText id="value" v-model="forms.setting_value" class="flex-auto" placeholder="contoh: 1000 atau 1000, 1000-SBY" autocomplete="off"/>
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
        <DataTable v-else v-model:filters="filters" :value="products" dataKey="id" scrollable scrollHeight="480px" :globalFilterFields="['setting_name', 'setting_value']">
            <template #empty> No setting found. </template>
            <template #loading> Loading setting data. Please wait. </template>
            <Column field="setting_name">
                <template #header>
                    <div class="flex w-full font-italic uppercase">
                        <small>Setting Name</small>
                    </div>
                </template>
                <template #body="{ data }">
                    <small class="font-medium">{{ data.setting_name }}</small>
                </template>
            </Column>
            <Column field="setting_value">
                <template #header>
                    <div class="flex w-full font-italic uppercase">
                        <small>Setting value</small>
                    </div>
                </template>
                <template #body="{ data }">
                    <small class="font-medium">{{ data.setting_value }}</small>
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
