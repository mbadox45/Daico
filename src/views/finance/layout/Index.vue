<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import FooterPage from '@/layout/AppFooter.vue'
import HeaderPage from '@/views/finance/component/HeaderPage3.vue'
import AppSidebar from '@/layout/AppSidebar.vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter, useRoute } from 'vue-router';


const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const route = useRoute();
const outsideClickListener = ref(null);
const routname = ref(route.name)
const loadingView = ref(false);

const currentRouteName = computed(() => route.name);

onMounted(() => {
    loadProduct();
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

const loadProduct = () => {
    loadingView.value = true
    setTimeout(function() {
        loadingView.value = false;
    }, 3000);
}

</script>

<template>
    <div class="min-h-screen flex w-full align-items-center justify-content-center" v-if="loadingView">
        <div class="flex flex-column align-items-center gap-3">
            <img src="/images/inl.png" alt="PT Industri Nabati Lestari" width="100">
            <span class="uppercase font-normal text-gray-500 text-lg">Daily Inventory Costing</span>
            <ProgressBar mode="indeterminate" style="height: 10px; width: 300px; background-color: white;"></ProgressBar>
            <small class="font-light text-gray-400">Supported By: ICT PT Industri Nabati Lestari</small>
        </div>
    </div>
    <div v-else class="layout-wrapper bg-gray-100" :class="containerClass">
        <header-page/>
        <div class="layout-sidebar">
            <app-sidebar></app-sidebar>
        </div>
        <div class="layout-main-container bg-bluegray-50">
            <div class="layout-main ">
                <router-view></router-view>
            </div>
            <footer-page/>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
