<script setup>
// Vue Component
import { ref, computed, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import moment from "moment";

// API ========================================================================================================================================================
import {
  loadAll_AllocMaster,
  add_AllocMaster,
  update_AllocMaster,
} from "@/controller/master_data/AllocController.js";

// VARIABLE
const searchKeyword = ref("");
const products = ref([]);
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const forms = ref({ id: null, nama: null });
const loadingTable = ref(false);

// Dialog Configure
const visible = ref(false);
const status_form = ref("add");
const title_dialog = ref("");

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
    const data = await loadAll_AllocMaster();
    const list = [];
    if (data != null) {
      for (let a = 0; a < data.length; a++) {
        list.push({ id: data[a].id, nama: data[a].nama });
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
  title_dialog.value =
    cond == "add"
      ? "Allocation - Tambah Data"
      : cond == "edit"
      ? "Allocation - Edit Data"
      : "Allocation - Hapus Data";
  if (cond == "add") {
    resetForm();
  } else {
    forms.value = {
      id: data.id,
      nama: data.nama,
    };
  }
};

const resetForm = () => {
  forms.value = { id: null, nama: null };
};

const saveData = async () => {
  status_form.value;
  if (forms.value.nama != null) {
    if (status_form.value == "add") {
      const response = await add_AllocMaster(forms.value);
      if (response.status == true) {
        messages.value = [
          { severity: "success", content: response.msg, id: count.value++ },
        ];
        setTimeout(function () {
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
        messages.value = [
          { severity: severity, content: response.msg, id: count.value++ },
        ];
      }
    } else if (status_form.value == "edit") {
      const response = await update_AllocMaster(forms.value.id, forms.value);
      if (response.status == true) {
        messages.value = [
          { severity: "success", content: response.msg, id: count.value++ },
        ];
        setTimeout(function () {
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
        messages.value = [
          { severity: severity, content: response.msg, id: count.value++ },
        ];
      }
    } else {
      messages.value = [
        { severity: "success", content: "Data berhasil di hapus", id: count.value++ },
      ];
    }
  } else {
    messages.value = [
      { severity: "warn", content: "Mohon data diisi dengan lengkap", id: count.value++ },
    ];
  }
};
</script>

<template>
  <div class="flex-auto flex flex-column gap-3 p-3 bg-white shadow-3">
    <span class="font-medium text-xl">Data Allocation</span>
    <div class="flex justify-content-between align-items-center gap-5">
      <div class="w-auto flex gap-2">
        <Button
          icon="pi pi-plus"
          severity="info"
          size="small"
          @click="formDatabase('add', null)"
        />
      </div>
      <div class="p-inputgroup p-fluid">
        <span class="p-inputgroup-addon bg-white">
          <i class="pi pi-search"></i>
        </span>
        <InputText
          type="text"
          placeholder="Search"
          class="w-full"
          v-model="filters['global'].value"
        />
      </div>
    </div>
    <!-- Dialog -->
    <Dialog
      v-model:visible="visible"
      modal
      :header="title_dialog"
      :style="{ width: '50rem' }"
    >
      <transition-group name="p-message" tag="div">
        <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{
          msg.content
        }}</Message>
      </transition-group>
      <div class="flex flex-column gap-3">
        <label for="username" class="font-semibold"
          >Nama Allocation <small class="text-red-500">*</small></label
        >
        <InputText
          id="username"
          v-model="forms.nama"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex justify-content-end gap-2 mt-5">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button type="button" label="Save" @click="saveData"></Button>
      </div>
    </Dialog>

    <!-- Table -->
    <div
      v-if="loadingTable == true"
      class="flex flex-column-reverse justify-content-center align-items-center gap-3"
    >
      <div>
        <span class="text-xl font-normal">Loading...</span>
      </div>
      <div>
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="4"
          animationDuration="1s"
          aria-label="Custom ProgressSpinner"
        />
      </div>
    </div>
    <DataTable
      v-else
      v-model:filters="filters"
      :value="products"
      dataKey="id"
      scrollable
      scrollHeight="450px"
      :globalFilterFields="['nama', 'nama_category2']"
    >
      <template #empty> No allocation found. </template>
      <template #loading> Loading allocation data. Please wait. </template>
      <Column field="nama" style="min-width: 8rem">
        <template #body="{ data }">
          <div
            class="flex flex-column md:flex-row align-items-center p-3 w-full border-1 border-round border-gray-300"
          >
            <img
              :src="'/images/supply-chain.png'"
              :alt="data.nama"
              class="my-4 md:my-0 w-6 md:w-4rem mr-5"
            />
            <div class="flex-1 text-center md:text-left">
              <div class="font-bold text-2xl">{{ data.nama }}</div>
              <div class="flex align-items-center">
                <i class="pi pi-shield mr-2 text-green-300"></i>
                <span class="font-normal text-gray-600">Allocation</span>
              </div>
            </div>
            <div
              class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0"
            >
              <Button
                icon="pi pi-pencil"
                severity="warning"
                size="small"
                @click="formDatabase('edit', data)"
              ></Button>
            </div>
          </div>
          <!-- <strong class="text-sm">{{ data.nama }}</strong> -->
        </template>
      </Column>
    </DataTable>
  </div>
</template>
