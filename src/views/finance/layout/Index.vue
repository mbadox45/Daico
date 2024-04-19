<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    const route = useRoute();

    const routname = ref(route.name)

    const currentRouteName = computed(() => route.name);

    // Components
    import FooterPage from '@/views/finance/dashboard/components/FooterPage.vue'
    import HeaderPage from '@/views/finance/component/HeaderPage.vue'

</script>

<template>
    <div class="min-h-screen flex flex-column gap-4 relative">
        <header-page/>
        <div class="min-h-screen flex flex-column gap-4 px-6 gap-3 bg-gray-100" style="padding-top: 6.5rem;">
            <div class="flex justify-content-between align-items-center border-1 border-gray-300 p-3 border-round" v-if="currentRouteName != 'dashboard'">
                <div class="flex align-items-center gap-3 w-full">
                    <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
                    <div class="flex flex-column gap-1">
                        <span class="font-normal uppercase text-gray-500">Rio Teguh Ardiarta</span>
                        <small class="font-medium text-teal-500">Analyst Application CRM</small>
                    </div>
                </div>
                <strong class="text-4xl font-light uppercase text-bluegray-300 flex gap-3 align-items-center w-full justify-content-end"><i class="pi pi-ticket text-4xl"></i>{{ currentRouteName }}</strong>
                <!-- <Image src="/images/inl.png" width="60"/> -->
            </div>
            <router-view/>
        </div>
        <footer-page/>
    </div>
</template>