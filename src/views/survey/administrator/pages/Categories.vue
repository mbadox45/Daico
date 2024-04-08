<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';


// API
import {formCategory, listKategori} from '@/api/DataVariable';
import CategoryService from '@/api/CategoryService';


// Variable
const searchKeyword = ref('');
const layout = ref('list');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);

const dialogs = ref(false)
const titledialogs = ref(null);
const forms = ref(formCategory);
const statusdialog = ref(null);
const listCategory = ref([]);
const loadings = ref(true)

const payload = JSON.parse(localStorage.getItem('payload'));
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Management', to:'/categories' }, { label: 'Categories', class:'font-bold', disabled:true  }]);

const toast = useToast();

// Given accsess public funtion
onMounted(() => {
    loadCategory()
});

// Function Private
const loadCategory = () => {
    CategoryService.getCategories().then(res => {
        const load = res.data;
        if (load.code == 200) {
            const data = load.data;
            console.log(load);
            const list = [];
            for (let i = 0; i < data.length; i++) {
                list[i] = {
                    id:data[i].id,
                    name:data[i].name,
                    status:data[i].status,
                }
            }
            listCategory.value = list;
            loadings.value = false;
        } else {
            listCategory.value = [];
            loadings.value = false;
        }
    }).catch(error => {
        listCategory.value = [];
        loadings.value = false;
        console.error(error.response.status);
    })
}

const filteredList = computed(() => {
    return listCategory.value.filter(item =>
        item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
});

const resetForm = () => {
    forms.value = {
        id: 0,
        name: '',
    }
}

const showDialog = (status, id) => {
    dialogs.value = true;
    if (status == 'add') {
        titledialogs.value = 'Create Category';
        statusdialog.value = status
        resetForm()
    } else {
        statusdialog.value = status
        titledialogs.value = 'Edit Category';
        forms.value = {
            id: id.id,
            name: id.name,
        }
    }
}

const postDialog = () => {
    dialogs.value = false;
    if (statusdialog.value == 'add') {
        CategoryService.addCategory(forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                loadCategory();
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
    } else if (statusdialog.value == 'delete') {
        CategoryService.activeCategory(forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                loadCategory();
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
    } else {
        CategoryService.updateCategory(forms.value.id,forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                loadCategory();
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
    }
}

</script>

<template>
    <div class="grid">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="{ width: '450px' }" :modal="true">
            <template #header>
                <h4>{{titledialogs}}</h4>
            </template>
            <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Category</label>
                    <InputText id="email" type="text" placeholder="Kategori" v-model="forms.name"/>
                </div>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="dialogs = false" class="p-button-outlined p-button-danger" />
                <Button label="Save" icon="pi pi-save" @click="postDialog" class="p-button-outlined p-button-success" autofocus :disabled="disablebtnchangepass" />
            </template>
        </Dialog>
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-6 md:col-6 sm:col-6">
                        <h5>List Categories</h5>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <Button severity="info" size="small" icon="pi pi-plus" outlined label="Add Category" @click="showDialog('add','')" />
                    </div>
                </div>
                <DataView :value="filteredList" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField" v-if="listCategory.length > 0">
                    <template #header>
                        <div class="grid grid-nogutter">
                            <div class="col-12 text-left">
                                <InputText v-model="searchKeyword" placeholder="Search by name ..." style="width: 100%" />
                            </div>
                        </div>
                    </template>
                    <template #list="slotProps">
                        <div class="col-12">
                            <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                                <img :src="'/category.png'" :alt="slotProps.data.name" class="my-4 md:my-0 w-4 md:w-4rem mr-5" />
                                <div class="flex-1 text-center md:text-left">
                                    <div class="font-bold text-2xl">{{ slotProps.data.name }}</div>
                                </div>
                                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                                    <Button icon="pi pi-pencil" label="Edit Category" class="mb-2" severity="warning" outlined size="small" @click="showDialog('edit',slotProps.data)"></Button>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #grid="slotProps">
                        <div class="col-12 md:col-4">
                            <div class="card m-3 border-1 surface-border">
                                <div class="flex align-items-center justify-content-between">
                                    <div class="flex align-items-center">
                                        <i class="pi pi-tag mr-2"></i>
                                        <span class="font-semibold">{{ slotProps.data.category }}</span>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <img :src="'/category.png'" :alt="slotProps.data.name" class="w-4 shadow-2 my-3 mx-0" />
                                    <div class="text-2xl font-bold">{{ slotProps.data.name }}</div>
                                </div>
                                <div class="flex align-items-center justify-content-between">
                                    <Button icon="pi pi-pencil" label="Edit Category" severity="warning" outlined size="small" @click="showDialog('edit',slotProps.data)"></Button>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
                <div class="text-center mb-5 mt-2" v-else>
                    <span class="text-lg">{{ loadings == true ? '' : 'Data not found' }} </span>
                </div>
                <div class="flex align-items-center justify-content-center mb-3" v-if="loadings == true">
                    <div class="">
                        <ProgressSpinner aria-label="Loading" style="width: 50px; height: 50px" />
                    </div>
                    <div class="text-gray-500 font-semibold">Please wait ...</div>
                </div>
            </div>
        </div>
    </div>
</template>