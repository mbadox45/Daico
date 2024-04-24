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

const link = () => {
    location.replace(`${URL_WEB_Portal}`);
}
</script>

<template>
    <div class="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden bg-no-repeat bg-cover bg-center" style="background-image: url('/layout/bg1.jpg');">
        <Toast position="top-center"/>
        <div class="md:flex align-items-center justify-content-center w-full h-full px-3 lg:px-8 md:px-6 sm:px-4">
            <!-- <div class="w-full py-6 sm:py-2 px-5 sm:px-4" style="border-radius: 53px">
                <div class="text-center">
                    <img src="/layout/inl.png" alt="PT.INL" class="w-10rem flex-shrink-0"/>
                    <div class="text-900 text-3xl font-medium mt-3">Survey - INL</div>
                    <div>
                        <span class="text-600 font-medium">PT. Industri Nabati Lestari</span>
                    </div>
                </div>

            </div> -->
            <div class="w-full md:w-6 shadow-5 py-6 px-5 md:px-6 sm:px-4 bg-gray-100 flex flex-column gap-3" style="border-radius: 40px">
                <div class="flex flex-column align-items-center gap-1">
                    <img src="/layout/inl.png" alt="PT.INL" class="w-10rem flex-shrink-0"/>
                    <div class="text-900 text-3xl font-medium mt-3">DAICO</div>
                    <div>
                        <span class="text-600 font-medium">Daily Inventory Costing</span>
                    </div>
                </div>
                <div>
                    <label v-if="isLoading == true" class="block text-900 text-xl font-medium mb-2">Loading ...</label>
                    <Button label="Please Sign In to Portal APPS" text class="w-full p-3 text-xl border-none" rounded @click="link"></Button>
                    <Divider class="mt-5"/>
                    <div class="text-center hidden md:block">
                        <strong>DAICO</strong> <span class="mx-1">&copy;</span> 2024 - PT. Industri Nabati Lestari
                    </div>
                    <div class="text-center block md:hidden">
                        <h5>DAICO</h5> <span class="mx-1">&copy;</span> 2024 - PT. Industri Nabati Lestari
                    </div>
                </div>
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
