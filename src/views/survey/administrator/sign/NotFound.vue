<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter  } from 'vue-router';
    import VerifyService from '@/api/VerifyService';

    const router = useRouter();

    const idUser = ref(null);
    const loadings = ref(true);

    const pushBack = () => {
        router.back();
    }
</script>

<template>
    <div class="flex align-items-center justify-content-center h-screen w-">
        <div class="px-4 py-6 md:px-6 lg:px-8 w-full">
            <div class="text-700 text-center">
                <div class="text-blue-600 font-bold mb-3"><i class="text-6xl pi pi-desktop mr-2"></i></div>
                <div class="text-900 font-bold text-5xl mb-3">404</div>
                <div class="text-700 text-2xl mb-5">Not Found</div>
                <Button @click="pushBack()" label="Back" icon="pi pi-chevron-left" class="font-bold px-5 py-3 p-button-raised p-button-rounded p-button-secondary white-space-nowrap"></Button>
                <div class="text-gray-400 font-bold mt-5">SURVEY &nbsp; | &nbsp; PT INDUSTRI NABATI LESTARI</div>
            </div>
        </div>
    </div>
</template>