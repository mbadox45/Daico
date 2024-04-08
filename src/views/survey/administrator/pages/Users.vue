<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';


// API
import UserService from '@/api/UserService';
import { formUser, listuser} from '@/api/DataVariable';


// Variable
const searchKeyword = ref('');
const layout = ref('list');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);

const dialogs = ref(false)
const titledialogs = ref(null);
const forms = ref(formUser);
const statusdialog = ref(null);
const listUsers = ref([]);
const loadings = ref(true)

const payload = JSON.parse(localStorage.getItem('payload'));
const tokens = localStorage.getItem('usertoken');
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Management', to:'/users' }, { label: 'Users', class:'font-bold', disabled:true  }]);

const toast = useToast();

// Given accsess public funtion
onMounted(() => {
    loadUser();
});

// Function Private
const loadUser = () => {
    UserService.getUsers().then(res => {
        const load = res.data;
        if (load.code == 200) {
            const data = load.data;
            console.log(data);
            data.sort((a, b) => b.id - a.id);
            const list = [];
            for (let i = 0; i < data.length; i++) {
                list[i] = {
                    id:data[i].id,
                    email:data[i].email,
                    name:data[i].name,
                    status:data[i].status,
                }
            }
            listUsers.value = list;
            loadings.value = false;
        } else {
            listUsers.value = [];
            loadings.value = false;
            console.log('kosong');
        }
    }).catch(error => {
        listUsers.value = [];
        loadings.value = false;
        console.error(error.response.status);
    })
    // console.log(tokens)
}

const filteredList = computed(() => {
    return listUsers.value.filter(item =>
        item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
});

const resetForm = () => {
    forms.value = {
        id: 0,
        name: '',
        email: '',
    }
}

const showDialog = (status, item) => {
    dialogs.value = true;
    if (status == 'add') {
        titledialogs.value = 'Create User';
        statusdialog.value = status
        resetForm()
    } else if (status == 'delete') {
        titledialogs.value = 'Delete User';
        statusdialog.value = status
        forms.value = {
            id: item.id,
            name: item.name,
            email: item.email,
        };
    } else {
        titledialogs.value = 'Edit User';
        statusdialog.value = status
        forms.value = {
            id: item.id,
            name: item.name,
            email: item.email,
        };
    }
}

const postDialog = () => {
    // console.log(forms.value)
    dialogs.value = false;
    if (statusdialog.value == 'add') {
        // console.log(statusdialog.value)
        UserService.addUser(forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
        setTimeout(() => {loadUser();}, 3000);
    } else if (statusdialog.value == 'delete') {
        // console.log(statusdialog.value)
        UserService.addUser(forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                // setTimeout(loadUser(), 3000);
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
        setTimeout(() => {loadUser();}, 3000);
    } else {
        UserService.updateUser(forms.value.id,forms.value).then(res => {
            const load = res.data;
            if (load.code == 200) {
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                // setTimeout(loadUser(), 3000);
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            }
        }).catch(error => {
            console.error(error.response.status);
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        })
        setTimeout(() => {loadUser();}, 3000);
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
            <div class="p-fluid formgrid grid" v-if="statusdialog != 'delete'">
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Distributor Name</label>
                    <InputText type="text" placeholder="CV. Maju Jaya Sempurna" v-model="forms.name"/>
                </div>
                <div class="field col-12 md:col-12">
                    <label for="firstname2">Email</label>
                    <InputText id="email" type="email" placeholder="distributor@gmail.com" v-model="forms.email"/>
                </div>
            </div>
            <div class="p-fluid grid" v-else>
                <div class="field col-12 md:col-12">
                    <span>Apakah anda ingin menghapus <strong>{{ forms.name }}</strong> ?</span>
                </div>
            </div>
            <template #footer>
                <Button v-show="statusdialog != 'delete'" label="No" icon="pi pi-times" @click="dialogs = false" class="p-button-outlined p-button-danger" />
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
                        <h5>List Users</h5>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <Button severity="info" size="small" icon="pi pi-plus" outlined label="Add Users" @click="showDialog('add','')" />
                    </div>
                </div>
                <DataView :value="filteredList" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField" v-if="listUsers.length > 0">
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
                                <img :src="'/distributor.png'" :alt="slotProps.data.name" class="my-4 md:my-0 w-9 md:w-8rem mr-5" />
                                <div class="flex-1 text-center md:text-left">
                                    <div class="font-bold text-2xl">{{ slotProps.data.name }}</div>
                                    <div class="mb-3">Distributor</div>
                                    <!-- <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" class="mb-2"></Rating> -->
                                    <div class="flex align-items-center">
                                        <i class="pi pi-envelope mr-2"></i>
                                        <span class="font-semibold">{{ slotProps.data.email }}</span>
                                    </div>
                                </div>
                                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                                    <Button icon="pi pi-pencil" label="Edit User" class="mb-2" severity="warning" outlined size="small" @click="showDialog('edit',slotProps.data)"></Button>
                                    <!-- <Button icon="pi pi-trash" label="Delete User" severity="danger" size="small" @click="showDialog('delete',slotProps.data)"></Button> -->
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
                                    <img :src="'/distributor.png'" :alt="slotProps.data.name" class="w-9 shadow-2 my-3 mx-0" />
                                    <div class="text-2xl font-bold">{{ slotProps.data.email }}</div>
                                    <div class="mb-3">{{ slotProps.data.desc }}</div>
                                </div>
                                <div class="flex align-items-center justify-content-between">
                                    <Button icon="pi pi-pencil" label="Edit User" severity="warning" outlined size="small" @click="showDialog('edit',slotProps.data)"></Button>
                                    <!-- <Button icon="pi pi-trash" label="Delete User" severity="danger" size="small" @click="showDialog('delete',slotProps.data)"></Button> -->
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