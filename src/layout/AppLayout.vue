<script setup>
import { computed, watch, onMounted, ref } from 'vue';
// import AppTopbar from './AppTopbar.vue';
// import FooterPage from '@/views/finance/dashboard/components/FooterPage.vue'
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
// import AppConfig from './AppConfig.vue';
import HeaderPage from '@/views/finance/component/HeaderPage2.vue'
import { useLayout } from '@/layout/composables/layout';
import { useRouter, useRoute } from 'vue-router';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const route = useRoute();
const outsideClickListener = ref(null);
const routname = ref(route.name)
const userName = ref(JSON.parse(localStorage.getItem('payload')))

const currentRouteName = computed(() => route.name);

onMounted(() => {
    tokenChecker();
});

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-theme-light': layoutConfig.darkTheme.value === 'light',
        'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
        'layout-overlay': layoutConfig.menuMode.value === 'overlay',
        'layout-static': layoutConfig.menuMode.value === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-input-filled': layoutConfig.inputStyle.value === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple.value
    };
});
const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive.value = false;
                layoutState.staticMenuMobileActive.value = false;
                layoutState.menuHoverActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

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
                router.push('/auth/login');
                // router.push('/auth/login');
                console.log('expired');
            } else {
                console.log('Token activated');
                console.log(token);
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

// ============================================================================
    // const base64Url = btoa(token); // Encode the token using Base64 URL-safe encoding
    // const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    // }).join(''));

    // return JSON.parse(jsonPayload);

// ============================================================================
    // // Convert the URL-safe Base64 to standard Base64
    // const base64Url = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    // // Add padding if necessary
    // const padding = base64Url.length % 4 === 2 ? '==' : base64Url.length % 4 === 1 ? '=' : '';
    // const base64 = base64Url + padding;

    // // Decode and parse JSON payload
    // const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    // }).join(''));

    // return JSON.parse(jsonPayload);
}
</script>

<template>
    <div class="layout-wrapper bg-gray-100" :class="containerClass">
        <header-page/>
        <!-- <app-topbar></app-topbar> -->
        <div class="layout-sidebar">
            <app-sidebar></app-sidebar>
        </div>
        <div class="layout-main-container bg-bluegray-50">
            <div class="layout-main min-h-screen">
                <div class="flex justify-content-between align-items-center border-1 border-gray-300 p-3 mb-5 border-round" v-if="currentRouteName != 'dashboard'">
                    <div class="flex align-items-center gap-3 w-full">
                        <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
                        <div class="flex flex-column gap-1">
                            <span class="font-normal uppercase text-gray-500">{{userName.name}}</span>
                            <small class="font-medium text-teal-500">{{userName.email}}</small>
                        </div>
                    </div>
                    <strong class="text-4xl font-light uppercase text-bluegray-300 flex gap-3 align-items-center w-full justify-content-end"><i class="pi pi-ticket text-4xl"></i>{{ currentRouteName }}</strong>
                </div>
                <router-view></router-view>
            </div>
            <!-- <footer-page/> -->
            <app-footer></app-footer>
        </div>
        <!-- <app-config></app-config> -->
        <!-- <div class="layout-mask"></div> -->
    </div>
</template>

<style lang="scss" scoped></style>
