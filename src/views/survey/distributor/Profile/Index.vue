<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute  } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const payload = JSON.parse(localStorage.getItem('payload'));
const token = localStorage.getItem('usertoken');
const formUpdate = ref({name: payload.name, email: payload.email, password:'', c_password:''})

// API
import UserService from '@/api/UserService';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const msg = ref('');

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Update Password', to:'/update-password', class:'font-bold', disabled:true }]);

const params = route.params.id;

onMounted(() => {
    // loadSurvey()
    console.log(token)
});

const resetForm = () => {
    formUpdate.value = {name: payload.name, email: payload.email, password:'', c_password:''}
}

const submitUpdate = () => {
    try {
        if (formUpdate.value.password != '' && formUpdate.value.c_password != '') {
            if (formUpdate.value.password == formUpdate.value.c_password) {
                const f_update = `{
                    "password" : "${formUpdate.value.password}",
                    "c-password": "${formUpdate.value.c_password}"
                }`
                UserService.updateUser(f_update).then(res => {
                    const load = res.data;
                    resetForm();
                    msg.value = 'success';
                })
            } else {
                msg.value = 'failed';
                // toast.add({ severity: 'warn', summary: 'Caution', detail: `Password & Re-Password are not the same`, life: 3000 });
            }
        } else {
            msg.value = 'error';
            // toast.add({ severity: 'danger', summary: 'Attention', detail: 'Please complete the form', life: 3000 });
        }
    } catch (error) {
        if (error.response && error.response.status === 500) {
            msg.value = 'error';
        } else {
            msg.value = 'error';
        }
        // toast.add({ severity: 'danger', summary: 'Attention', detail: 'Please complete the form', life: 3000 });
    }
};

</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid">
                    <div class="col-6 md:col-6 sm:col-6">
                        <h5>Update Password</h5>
                    </div>
                </div>
                <Message v-show="msg == 'success'" severity="success">Update Password Successfully</Message>
                <Message v-show="msg == 'failed'" severity="warn">Password & Re-Password are not the same</Message>
                <Message v-show="msg == 'error'" severity="error">Please complete the form</Message>
                <form @submit.prevent="submitUpdate">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Name</label>
                            <InputText id="text" type="text" v-model="formUpdate.name" disabled/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Email</label>
                            <InputText id="text" type="email" v-model="formUpdate.email" disabled/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Password</label>
                            <Password id="password1" v-model="formUpdate.password" placeholder="Password" :feedback="false" :toggleMask="true" class="w-full" inputClass="w-full" inputStyle="padding:1rem"></Password>
                            <small class="text-pink-500">Min. 8 Characters, at least one uppercase letter, one lowercase letter, one symbol, and one number</small>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Re-Password</label>
                            <Password id="password1" v-model="formUpdate.c_password" placeholder="Re-Password" :feedback="false" :toggleMask="true" class="w-full" inputClass="w-full" inputStyle="padding:1rem"></Password>
                            <small class="text-pink-500">Min. 8 Characters, at least one uppercase letter, one lowercase letter, one symbol, and one number</small>
                        </div>
                    </div>
                    <div class="flex justify-content-end">
                        <Button label="Save" icon="pi pi-check" type="submit" severity="success" autofocus />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>