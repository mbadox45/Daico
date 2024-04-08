<script setup>
// Vue Component
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

// HTML Components
import AppConfig from '@/layout/AppConfig.vue';

// API
import AuthService from '@/api/AuthService';
import { URL_WEB, URL_WEB_Portal } from '@/api/DataVariable';

const toast = useToast();
const router = useRouter();
const { layoutConfig } = useLayout();
const email = ref(null);
const password = ref(null);
const checked = ref(false);
const isLoading = ref(false);

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const link = (item) => {
    if (item == 'sso') {
        location.replace(`${URL_WEB_Portal}`);
    } else {
        window.open(
            'https://drive.google.com/file/d/1wp1BctZVqXMtmhxyYBhNufwY8oUkVlsi/view',
            '_blank' // <- This is what makes it open in a new window.
        );
        // router.push('/forgot-password');
    }
}

const onSubmit = (e) => {
    e.preventDefault();
    if (email.value && password.value) {
        const post = {
            email: email.value,
            password: password.value,
        }
        isLoading.value = true
        try {
            AuthService.postSignIn(post).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    toast.add({ severity: 'success', summary: 'Successfully', detail: `Login successfully`, life: 3000 });
                    const token = load.data.accessToken;
                    const data = load.data.user;
                    const roles = "distributor";
                    const payload = {
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        type: "distributor",
                    }
                    console.log(payload);
                    localStorage.setItem('roles', roles);
                    localStorage.setItem('usertoken', token);
                    localStorage.setItem('payload', JSON.stringify(payload));
                    window.location.replace(`${URL_WEB}beranda`);
                    // window.location.replace("http://localhost:8086/beranda");
                } else {
                    toast.add({ severity: 'warn', summary: 'Attention', detail: 'The password or email you entered is incorrect, please try again', life: 3000 });
                    console.log(load);
                }
            }).catch(error => {
                console.error(error.response.status);
                toast.add({ severity: 'warn', summary: 'Attention', detail: 'The password or email you entered is incorrect, please try again', life: 3000 });
            })
        } catch (error) {
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Invalid process, please contact the ICT team', life: 3000 });
            // console.error(error.response.status);
        } finally {
            isLoading.value = false
        }
    } else {
        toast.add({ severity: 'warn', summary: 'Attention', detail: 'Please complete the data', life: 3000 });
    }
};
</script>

<template>
    <!-- <div class="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden bg-no-repeat bg-cover"> -->
    <div class="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden bg-no-repeat bg-cover bg-center" style="background-image: url('/layout/bg1.jpg');">
        <Toast position="top-center"/>
        <div class="md:flex align-items-center justify-content-center w-full h-full px-3 lg:px-8 md:px-6 sm:px-4">
            <!-- <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"> -->
            <div class="w-full py-6 sm:py-2 px-5 sm:px-4" style="border-radius: 53px">
                <div class="text-center">
                    <img src="/layout/inl.png" alt="PT.INL" class="w-10rem flex-shrink-0"/>
                    <div class="text-900 text-3xl font-medium mt-3">Survey - INL</div>
                    <div>
                        <span class="text-600 font-medium">PT. Industri Nabati Lestari</span>
                    </div>
                </div>

            </div>
            <Divider layout="vertical" class="hidden md:block"/>
            <div class="w-full shadow-5 py-6 px-5 md:px-6 sm:px-4 bg-white" style="border-radius: 40px">

                <form @submit="onSubmit">
                    <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                    <InputText id="email1" type="email" placeholder="Email address" class="w-full mb-5" style="padding: 1rem" v-model="email" autocomplete="off" />

                    <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                    <Password id="password1" v-model="password" placeholder="Password" :feedback="false" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>

                    <div class="flex align-items-center justify-content-between mb-5 gap-5">
                        <div class="flex align-items-center">
                            <a class="font-medium no-underline cursor-pointer hover:text-primary-600" @click="link('password')" ><i class="pi pi-book mr-2"></i> Manual Book</a>
                        </div>
                        <!-- <a class="font-medium no-underline ml-2 text-right cursor-pointer" @click="link('password')"></a> -->
                    </div>
                    <label v-if="isLoading == true" class="block text-900 text-xl font-medium mb-2">Loading ...</label>
                    <Button label="Sign In" class="w-full p-3 text-xl bg-blue-800 border-none" type="submit" rounded></Button>
                    <Divider class="mt-5"/>
                    <div class="text-center hidden md:block">
                        <strong>Survey - INL</strong> <span class="mx-1">&copy;</span> 2023 - PT. Industri Nabati Lestari
                    </div>
                    <div class="text-center block md:hidden">
                        <h5>Survey - INL</h5> <span class="mx-1">&copy;</span> 2023 - PT. Industri Nabati Lestari
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
