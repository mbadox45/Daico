<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // Components
    import SidebarPage from '@/views/finance/component/SidebarPage.vue'

    // Variable
    const visible = ref(false);
    const route = useRoute();
    const currentRouteName = computed(() => route.name);

    const toggleSidebar = (cond) => {
        visible.value = cond;
    };

</script>

<template>
    <div class="fixed flex px-6 bg-teal-800 align-items-center justify-content-between w-full z-5 shadow-4" style="padding-block: 10px;">
        <div class="flex gap-5 align-items-center ">
            <div class="border-circle bg-transparent border-1 text-teal-300 border-teal-300 hover:bg-teal-700 hover:text-white" style="padding: 10px;" @click="toggleSidebar(true)">
                <i class="pi pi-th-large text-xl"></i>
            </div>
            <span class="text-3xl font-semibold text-white">Daico - INL</span>
        </div>
        <span class="text-3xl uppercase font-light text-white">{{ currentRouteName }}</span>
        <sidebar-page :visible="visible" @close="toggleSidebar"/>
    </div>
</template>