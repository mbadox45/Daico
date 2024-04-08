<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter, useRoute } from 'vue-router';

const { layoutConfig, onMenuToggle } = useLayout();

// API
import UserService from '@/api/UserService';

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const displayConfirmation = ref(false);
const displayPassword = ref(false);
const router = useRouter();
const route = useRoute();
const route_name = computed(() => route.name)
const roles = localStorage.getItem('roles');
const payload = JSON.parse(localStorage.getItem('payload'));
const formUpdate = ref({name: payload.name, email: payload.email, password:'', c_password:''})

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const viewUpdate = () => {
    displayPassword.value = true
    formUpdate.value = {name: payload.name, email: payload.email, password:'', c_password:''}
    console.log(payload);
};

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    // const roles = localStorage.getItem('roles');
    if (roles == 'distributor') {
        try {
            const resp = UserService.logoutUser();
            const load = resp.data;
            if (load.code == 200) {
                localStorage.removeItem('usertoken');
                localStorage.removeItem('payload');
                localStorage.removeItem('roles');
                router.push('/auth/login');
            }
        } catch (error) {
            localStorage.removeItem('usertoken');
            localStorage.removeItem('payload');
            localStorage.removeItem('roles');
            router.push('/auth/login');
        }
    } else {
        localStorage.removeItem('usertoken');
        localStorage.removeItem('payload');
        localStorage.removeItem('roles');
        window.close();
    }
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
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
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar bg-cyan-200 dark">
        <Dialog v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true" position="topright" :draggable="false">
            <template #header>
                <h4>Sign Out</h4>
            </template>
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color:red;" />
                <span class="font-semibold">Do you want to exit this app?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayConfirmation = false" class="p-button-text p-button-secondary" />
                <Button label="Yes" icon="pi pi-check" @click="onSettingsClick" class="p-button-danger" autofocus />
            </template>
        </Dialog>
        <router-link to="/" class="layout-topbar-logo justify-content-center">
            <!-- <img src="/layout/inl.png" alt="PT Industri Nabati Lestari" /> -->
            <!-- <img :src="logoUrl" alt="logo" /> -->
            <span class="ml-2 text-cyan-800">SURVEY - INL</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button text-cyan-800" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button text-cyan-800" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button> -->
            <!-- <button :class="`p-link layout-topbar-button text-cyan-800`" v-show="roles != 'admin'" @click="viewUpdate">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button> -->
            <button @click="displayConfirmation = true" class="p-link layout-topbar-button text-cyan-800">
                <i class="pi pi-sign-out"></i>
                <span>Sign Out</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
