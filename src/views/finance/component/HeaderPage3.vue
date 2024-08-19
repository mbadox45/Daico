<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';
    
    import {URL_WEB_Portal} from '@/api/DataVariable.js';

    // Components
    import SidebarPage from '@/views/finance/component/SidebarPage.vue'
    
    // Variable
    const visible = ref(false);
    const route = useRoute();
    const router = useRouter();
    const menu = ref(true);
    const currentRouteName = computed(() => route.name);

    const { layoutConfig, onMenuToggle } = useLayout();

    const onSettingsClick = () => {
        window.location.replace(URL_WEB_Portal);
    };

</script>

<template>
    <div class="fixed flex px-5 pt-3 bg-bluegray-50 w-full z-5" style="padding-block: 10px;">
        <div class="bg-white flex justify-content-between align-items-center gap-5 w-full px-5 py-2 shadow-3 border-round">
            <div class="flex flex-column py-1 w-full">
                <span class="text-xl font-medium text-teal-800">DAICO</span>
                <span class="text-xs font-semibold text-gray-400">Daily Inventory Costing</span>
            </div>
            <div class="flex gap-2 align-items-center justify-content-end w-full">
                <div class="flex w-auto align-items-center gap-2">
                    <i class="pi pi-desktop text-lg text-gray-400 mt-1"></i>
                    <span class="font-normal text-sm text-gray-400 uppercase">{{currentRouteName}}</span>
                    <!-- <span class="font-normal text-sm text-gray-400">{{moment().format(' DD MMM YYYY')}}</span> -->
                </div>
                <Divider layout="vertical" />
                <button class="p-link layout-menu-button layout-topbar-button text-center text-teal-800 hover:text-teal-500 border-circle p-2 mr-4 w-auto" v-tooltip.bottom="'Menu'"  @click="onMenuToggle()">
                    <i class="pi pi-bars text-xl"></i>
                </button>
                <button class="p-link layout-menu-button layout-topbar-button text-center text-teal-800 hover:text-teal-500 border-circle p-2 w-auto" v-tooltip.bottom="'Sign In'"  @click="onSettingsClick()">
                    <i class="pi pi-sign-in text-xl"></i>
                </button>
            </div>
        </div>
    </div>
</template>