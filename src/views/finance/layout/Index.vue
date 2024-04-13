<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    const route = useRoute();

    const currentRouteName = computed(() => route.name);

    // Components
    import FooterPage from '@/views/finance/dashboard/components/FooterPage.vue'
    import HeaderPage from '@/views/finance/component/HeaderPage.vue'

</script>

<template>
    <div class="min-h-screen flex flex-column relative">
        <header-page/>
        <div class="min-h-screen flex flex-column pb-3 px-6 gap-3 bg-gray-50" style="padding-top: 6rem;">
            <div class="flex justify-content-between align-items-center">
                <strong class="text-4xl font-light uppercase text-bluegray-300">{{ currentRouteName }}</strong>
                <Image src="/images/inl.png" width="60"/>
            </div>
            <router-view/>
        </div>
        <footer-page/>
    </div>
</template>