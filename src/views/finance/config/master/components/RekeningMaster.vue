<script setup>
// Vue Component
import { ref, computed, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import moment from "moment";

// API ========================================================================================================================================================
import { loadAll_TipeRekeningMaster } from "@/controller/master_data/TipeRekeningController.js";
import { loadAll_JenisRekeningMaster } from "@/controller/master_data/JenisRekeningController.js";
import {
  loadAll_RekeningMaster,
  add_RekeningMaster,
  update_RekeningMaster,
} from "@/controller/master_data/RekeningController.js";
import { cek_token } from "@/api/DummyData.js";

// VARIABLE
const products = ref([]);
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const forms = ref({
  id: null,
  nama: null,
  nomor: null,
  matauang_id: null,
  tipe_id: null,
  jenis_id: null,
  keterangan: null,
});
const loadingTable = ref(false);

// Dialog Configure
const visible = ref(false);
const status_form = ref("add");
const title_dialog = ref("");
const loading_save = ref(false);
const load_jenis_rekening = ref([]);
const load_tipe_rekening = ref([]);
const load_mata_uang = ref([
  { id: 12, nama: "IDR" },
  { id: 2, nama: "USD" },
]);

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
    const data = await loadAll_RekeningMaster();
    const list = [];
    if (data != null) {
      for (let a = 0; a < data.length; a++) {
        list.push({
          id: data[a].id,
          nama: data[a].nama,
          jenis_id: data[a].jenis_id,
          jenis: data[a].jenis.nama,
          nomor: data[a].nomor,
          matauang_id: data[a].matauang_id,
          matauang: data[a].matauang.name,
          tipe_id: data[a].tipe_id,
          keterangan: data[a].keterangan,
          tipe: data[a].tipe_id != null ? data[a].tipe.nama : "-",
        });
      }
    }
    products.value = list;
    loadingTable.value = false;
  } catch (error) {
    products.value = [];
    loadingTable.value = false;
  }
};

const loadDataForDropdown = async () => {
  try {
    // tipe rekening
    const tipe = await loadAll_TipeRekeningMaster();
    const list_tipe = [];
    if (tipe != null) {
      for (let a = 0; a < tipe.length; a++) {
        list_tipe.push({ id: tipe[a].id, nama: tipe[a].nama });
      }
    }
    load_tipe_rekening.value = list_tipe;

    // tipe rekening
    const jenis = await loadAll_JenisRekeningMaster();
    const list_jenis = [];
    if (jenis != null) {
      for (let a = 0; a < jenis.length; a++) {
        list_jenis.push({ id: jenis[a].id, nama: jenis[a].nama });
      }
    }
    load_jenis_rekening.value = list_jenis;
  } catch (error) {
    load_tipe_rekening.value = [];
    load_jenis_rekening.value = [];
  }
};

const formDatabase = (cond, data) => {
  messages.value = [];
  visible.value = true;
  status_form.value = cond;
  loading_save.value = false;
  loadDataForDropdown();
  title_dialog.value =
    cond == "add"
      ? "Rekening - Tambah Data"
      : cond == "edit"
      ? "Rekening - Edit Data"
      : "Rekening - Hapus Data";
  if (cond == "add") {
    resetForm();
  } else {
    forms.value = {
      id: data.id,
      nama: data.nama,
      nomor: data.nomor,
      matauang_id: data.matauang_id,
      tipe_id: data.tipe_id,
      jenis_id: data.jenis_id,
      keterangan: data.keterangan,
    };
  }
};

const resetForm = () => {
  forms.value = {
    id: null,
    nama: null,
    nomor: null,
    matauang_id: null,
    tipe_id: null,
    jenis_id: null,
    keterangan: null,
  };
};

const saveData = async () => {
  status_form.value;
  if (forms.value.nama != null && forms.value.nama != "" && forms.value.nomor != null && forms.value.nomor != "" && forms.value.matauang_id != null && forms.value.jenis_id != null && forms.value.keterangan != null && forms.value.keterangan != "" ) {
    loading_save.value = true;
    if (status_form.value == "add") {
      const response = await add_RekeningMaster(forms.value);
      if (response.status == true) {
        messages.value = [
          { severity: "success", content: response.msg, id: count.value++ },
        ];
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
        messages.value = [
          { severity: severity, content: response.msg, id: count.value++ },
        ];
      }
    } else if (status_form.value == "edit") {
      const response = await update_RekeningMaster(forms.value.id, forms.value);
      if (response.status == true) {
        messages.value = [
          { severity: "success", content: response.msg, id: count.value++ },
        ];
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
    <span class="font-medium text-xl">Master Rekening</span>
    <div class="flex justify-content-between align-items-center gap-5">
      <div :class="cek_token == null ? 'hidden' : 'flex'" class="w-auto gap-2">
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
        <div class="flex gap-2">
          <small class="text-red-500 text-semibold">*</small>
          <span>Wajib diisi</span>
        </div>
        <div class="flex flex-column gap-1">
          <label for="username" class="font-semibold"
            >Nama Rekening <small class="text-red-500">*</small></label
          >
          <InputText
            id="username"
            v-model="forms.nama"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-column gap-1">
          <label for="nomor" class="font-semibold"
            >Nomor <small class="text-red-500">*</small></label
          >
          <InputText
            id="nomor"
            v-model="forms.nomor"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-column gap-1">
          <label for="uang" class="font-semibold"
            >Mata Uang <small class="text-red-500">*</small></label
          >
          <Dropdown
            v-model="forms.matauang_id"
            id="uang"
            :options="load_mata_uang"
            filter
            optionLabel="nama"
            optionValue="id"
            placeholder="Select a Tipe Rekening"
            class="flex-auto"
          ></Dropdown>
        </div>
        <div class="flex flex-column gap-1">
          <label for="tipe" class="font-semibold"
            >Tipe Rekening <small class="text-red-500"></small
          ></label>
          <Dropdown
            v-model="forms.tipe_id"
            id="tipe"
            :options="load_tipe_rekening"
            filter
            optionLabel="nama"
            optionValue="id"
            placeholder="Select a Tipe Rekening"
            class="flex-auto"
          ></Dropdown>
        </div>
        <div class="flex flex-column gap-1">
          <label for="jenis" class="font-semibold"
            >Jenis Rekening <small class="text-red-500">*</small></label
          >
          <Dropdown
            v-model="forms.jenis_id"
            id="jenis"
            :options="load_jenis_rekening"
            filter
            optionLabel="nama"
            optionValue="id"
            placeholder="Select a Jenis Rekening"
            class="flex-auto"
          ></Dropdown>
        </div>
        <div class="flex flex-column gap-1">
          <label for="keterangan" class="font-semibold">Keterangan <small class="text-red-500">*</small></label>
          <Textarea v-model="forms.keterangan" class="flex-auto" rows="5" cols="30" id="keterangan"/>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
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
    <DataTable v-else v-model:filters="filters" :value="products" dataKey="id" scrollable scrollHeight="480px" :globalFilterFields="['nama', 'nomor', 'matauang', 'jenis', 'tipe', 'keterangan']">
      <template #empty> No rekening found. </template>
      <template #loading> Loading rekening data. Please wait. </template>
      <Column field="nama">
        <template #header>
          <div class="flex w-full font-italic uppercase">
            <small>Rekening</small>
          </div>
        </template>
        <template #body="{ data }">
          <small class="font-medium">{{ data.nama }}</small>
        </template>
      </Column>
      <Column field="nama">
        <template #header>
          <div class="flex w-full font-italic uppercase">
            <small>Nomor Rekening</small>
          </div>
        </template>
        <template #body="{ data }">
          <small class="font-medium">{{ data.nomor }}</small>
        </template>
      </Column>
      <Column field="nama">
        <template #header>
          <div class="flex w-full font-italic uppercase">
            <small>Mata Uang</small>
          </div>
        </template>
        <template #body="{ data }">
          <small class="font-medium">{{ data.matauang }}</small>
        </template>
      </Column>
      <Column field="nama">
        <template #header>
          <div class="flex w-full font-italic uppercase">
            <small>Jenis Rekening</small>
          </div>
        </template>
        <template #body="{ data }">
          <small class="font-medium">{{ data.jenis }}</small>
        </template>
      </Column>
      <Column field="nama">
        <template #header>
          <div class="flex w-full font-italic uppercase">
            <small>Tipe Rekening</small>
          </div>
        </template>
        <template #body="{ data }">
          <small class="font-medium">{{ data.tipe }}</small>
        </template>
      </Column>
      <Column field="nama">
        <template #header>
          <div class="flex w-full font-italic uppercase">
            <small>Keterangan</small>
          </div>
        </template>
        <template #body="{ data }">
          <small class="font-medium">{{ data.keterangan }}</small>
        </template>
      </Column>
      <Column field="nama">
        <template #header>
        </template>
        <template #body="{ data }">
          <Button icon="pi pi-pencil" severity="warning" size="small" @click="formDatabase('edit', data)"></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
