<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // API
    import { URL_WEB } from '@/api/DataVariable';

    // Components
    import FooterPage from '@/views/finance/dashboard/components/FooterPage.vue'
    import HeaderPage from '@/views/finance/component/HeaderPage.vue'

    const route = useRoute();

    const routname = ref(route.name)
    const userName = ref(JSON.parse(localStorage.getItem('payload')))

    const currentRouteName = computed(() => route.name);

    onMounted(() => {
        tokenChecker();
    });

    const tokenChecker = () => {
        const token = localStorage.getItem('usertoken');
        const roles = localStorage.getItem('roles');
        if (roles != 'distributor') {
            if (token) {
                const tokenData = parseJwt(token);
                const expirationTime = tokenData.exp * 1000; // Convert expiration time to milliseconds
        
                if (Date.now() > expirationTime) {
                    // Token has expired, remove it from localStorage
                    localStorage.removeItem('usertoken');
                    localStorage.removeItem('payload');
                    localStorage.removeItem('roles');
                    window.location.replace(URL_WEB);
                    console.log('expired');
                } else {
                    console.log('Token activated');
                    console.log(token);
                    console.log(localStorage.getItem('payload'));
                    // config.headers['Authorization'] = `Bearer ${token}`;
                }
            }
        } else {
            console.log(token);
        }
    }

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

</script>

<template>
    <div class="min-h-screen flex flex-column gap-4 relative">
        <header-page/>
        <div class="min-h-screen flex flex-column gap-4 px-6 gap-3 bg-gray-100" style="padding-top: 6.5rem;">
            <div class="flex justify-content-between align-items-center border-1 border-gray-300 p-3 border-round" v-if="currentRouteName != 'dashboard'">
                <div class="flex align-items-center gap-3 w-full">
                    <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
                    <div class="flex flex-column gap-1">
                        <span class="font-normal uppercase text-gray-500">{{userName.name}}</span>
                        <small class="font-medium text-teal-500">{{userName.email}}</small>
                    </div>
                </div>
                <strong class="text-4xl font-light uppercase text-bluegray-300 flex gap-3 align-items-center w-full justify-content-end"><i class="pi pi-ticket text-4xl"></i>{{ currentRouteName }}</strong>
            </div>
            <router-view/>
        </div>
        <footer-page/>
    </div>
</template>