<script setup>
    // Vue Component
    import { ref, computed, onMounted } from "vue";
    import { FilterMatchMode } from "primevue/api";
    import moment from "moment";

    // API ========================================================================================================================================================
    import { loadAll_BulkyMarketMaster } from "@/controller/master_data/BulkyMarketController.js";
    import { loadAll_RetailMarketMaster } from "@/controller/master_data/RetailMarketController.js";
    import { loadAll_MainProductMaster, add_MainProductMaster, update_MainProductMaster } from "@/controller/master_data/MainProductController.js";
    // import { loadAll_SubProductMaster, add_SubProductMaster, update_SubProductMaster, } from "@/controller/master_data/SubProductController.js";
    import { cek_token } from "@/api/DataVariable.js";

    // VARIABLE
    const expandedRows = ref([]);
    const products = ref([]);
    const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    const forms = ref({ id: null, nama: null, product_type: null, productable_id: null, product_id: null });
    const loadingTable = ref(false);

    // Dialog Configure
    const visible = ref(false);
    const status_form = ref("add");
    const title_dialog = ref("");
    const loading_save = ref(false);
    const load_master_bulk = ref([]);
    const load_master_retail = ref([]);
    const load_type = ref([{id:'bulk', nama:'Bulk'}, {id:'retail', nama:'Retail'}]);

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
            const data = await loadAll_MainProductMaster();
            const list = [];
            if (data != null) {
                for (let a = 0; a < data.length; a++) {
                    const type = data[a].productable_type == "App\\Models\\MasterBulky" ? "bulk" : "retail";
                    list.push({ id: data[a].id, no: a+1, nama: data[a].nama, product: `${data[a].productable.name} (${data[a].nama})`, productable_id: data[a].productable_id, product_type: type, sub_product: data[a].sub_product });
                }
            }
            products.value = list;
            loadingTable.value = false;
        } catch (error) {
            products.value = [];
            loadingTable.value = false;
        }
    };

    const loadBulky = async() => {
        // Product
        const product = await loadAll_BulkyMarketMaster()
        load_master_bulk.value = []
        for (let a = 0; a < product.length; a++) {
            load_master_bulk.value.push({id: product[a].id, name: product[a].name})
        }
    }

    const loadRetail = async() => {
        // Product
        const product = await loadAll_RetailMarketMaster()
        load_master_retail.value = []
        for (let a = 0; a < product.length; a++) {
            load_master_retail.value.push({id: product[a].id, name: product[a].name})
        }
    }

    const formDatabase = (cond, data) => {
        messages.value = [];
        visible.value = true;
        status_form.value = cond;
        loading_save.value = false;
        title_dialog.value = cond == "add" ? "Product - Tambah Data" : cond == "edit" ? "Product - Edit Data" : "Product - Hapus Data";
        loadBulky()
        loadRetail()
        if (cond == "add") {
            resetForm();
        } else {
            forms.value = { id: data.id, nama: data.nama, product_type: data.product_type, productable_id: data.productable_id, product_id: data.product_id };
        }
    };

    const resetForm = () => {
        forms.value = { id: null, nama: null, product_type: null, productable_id: null, product_id: null };
    };

    const saveData = async () => {
        status_form.value;
        if (forms.value.nama != null && forms.value.nama != "" && forms.value.product_type != null && forms.value.productable_id != null) {
            loading_save.value = true;
            if (status_form.value == "add") {
                const response = await add_MainProductMaster(forms.value);
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
                const response = await update_MainProductMaster(forms.value.id, forms.value);
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
        <span class="font-medium text-xl">Master Product</span>
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
                    <label for="username" class="font-semibold">Product Name<small class="text-red-500">*</small></label>
                    <InputText id="username" v-model="forms.nama" class="flex-auto" autocomplete="off"/>
                </div>
                <!-- <div class="flex flex-column gap-1">
                    <label for="product" class="font-semibold">Product <small class="text-red-500">*</small></label>
                    <Dropdown v-model="forms.product_id" :options="load_produk" filter optionLabel="nama" optionValue="id" placeholder="Select a Location" class="flex-auto"></Dropdown>
                </div> -->
                <div class="flex flex-column gap-1">
                    <label for="product" class="font-semibold">Product Type <small class="text-red-500">*</small></label>
                    <Dropdown v-model="forms.product_type" :options="load_type" filter optionLabel="nama" optionValue="id" placeholder="Select a Location" class="flex-auto"></Dropdown>
                </div>
                <div class="flex flex-column gap-1">
                    <label for="product" class="font-semibold">Master - <span class="capitalize">{{ forms.product_type }}</span> <small class="text-red-500">*</small></label>
                    <Dropdown v-model="forms.productable_id" :options="forms.product_type != null && forms.product_type != '' ? forms.product_type == 'bulk' ? load_master_bulk : load_master_retail : null" filter optionLabel="name" optionValue="id" placeholder="Select a Location" class="flex-auto"></Dropdown>
                </div>
            </div>
            <div class="flex justify-content-end gap-2 mt-5">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false" ></Button>
                <Button type="button" :label="loading_save == true ? 'Saving...' : 'Save'" :disabled="loading_save" @click="saveData"></Button>
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
        <DataTable v-else v-model:expandedRows="expandedRows" v-model:filters="filters" :value="products" dataKey="id" scrollable scrollHeight="480px" :globalFilterFields="['nama', 'product', 'product_type']">
            <template #empty> No product found. </template>
            <template #loading> Loading product data. Please wait. </template>
            <Column expander style="width: 5rem" />
            <Column field="nama">
                <template #header>
                    <div class="flex w-full font-italic uppercase">
                        <small>No</small>
                    </div>
                </template>
                <template #body="{ data }">
                    <small class="font-medium">{{ data.no }}</small>
                </template>
            </Column>
            <Column field="nama">
                <template #header>
                    <div class="flex w-full font-italic uppercase">
                        <small>Product</small>
                    </div>
                </template>
                <template #body="{ data }">
                    <small class="font-medium">{{ data.product }}</small>
                </template>
            </Column>
            <Column field="nama">
                <template #header>
                    <div class="flex w-full font-italic uppercase">
                        <small>Product Type</small>
                    </div>
                </template>
                <template #body="{ data }">
                    <small class="font-medium capitalize">{{ data.product_type }}</small>
                </template>
            </Column>
            <Column field="nama">
                <template #body="{ data }">
                    <div class="w-full flex justify-content-end">
                        <Button icon="pi pi-pencil" severity="warning" text size="small" @click="formDatabase('edit', data)"></Button>
                    </div>
                </template>
            </Column>
            <template #expansion="{ data }">
                <DataTable :value="data.sub_product" class="p-datatable-sm" :globalFilterFields="['nama']" >
                    <Column field="nama">
                        <template #header>
                            <span class="text-xs uppercase">Sub Product</span>
                        </template>
                        <template #body="{ data }">
                            <span class="text-sm">{{ data.nama }}</span>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </DataTable>
    </div>
</template>
