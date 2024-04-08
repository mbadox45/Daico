<script setup>
// Vue Component
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const mainText = ref('white')
const hoverText = ref('gray-600')


</script>

<template>
    <section id="portofolio" class="flex flex-column">
        <div class="relative">
            <div class="h-screen flex flex-column bg-white align-items-center px-8 py-5">
                <Divider align="center">
                    <h3 class="text-6xl font-light uppercase">My Portofolio</h3>
                </Divider>

                <div class="flex flex-row gap-3">
                    <div class="transition-all border-round-xl transition-duration-500 transition-ease-in fadeinleft animation-duration-1000 animation-ease-in shadow-2 hover:shadow-6 h-30rem w-30rem bg-gray-700 block hover:hidden hover:bg-yellow-500 text-gray-700 hover:text-yellow-500 p-1 flex flex-column justify-content-center align-items-center">
                        <div class="bg-white gap-4 flex flex-column justify-content-center align-items-center w-full h-full">
                            <i class="pi pi-code text-8xl"></i>
                            <span class="font-normal uppercase text-2xl">Web Application</span>
                        </div>
                    </div>
                    <div class="shadow-2 hover:shadow-6 transition-all transition-ease-in-out transition-duration-1000 h-30rem w-30rem bg-gray-700 hover:bg-yellow-500 text-gray-700 hover:text-yellow-500 p-1 flex flex-column justify-content-center align-items-center">
                        <div class="bg-white gap-4 flex flex-column justify-content-center align-items-center w-full h-full">
                            <i class="pi pi-mobile text-8xl"></i>
                            <span class="font-normal uppercase text-2xl">Mobile Application</span>
                        </div>
                    </div>
                    <div class="shadow-2 hover:shadow-6 transition-all transition-ease-in-out transition-duration-1000 h-30rem w-30rem bg-gray-700 hover:bg-yellow-500 text-gray-700 hover:text-yellow-500 p-1 flex flex-column justify-content-center align-items-center">
                        <div class="bg-white gap-4 flex flex-column justify-content-center align-items-center w-full h-full">
                            <i class="pi pi-desktop text-8xl"></i>
                            <span class="font-normal uppercase text-2xl">Desktop Application</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    @keyframes slidedown-icon {
        0% {
            transform: translateY(0);
        }

        50% {
            transform: translateY(20px);
        }

        100% {
            transform: translateY(0);
        }
    }

    .slidedown-icon {
        animation: slidedown-icon;
        animation-duration: 3s;
        animation-iteration-count: infinite;
    }

    .box {
        background-image: radial-gradient(var(--primary-300), var(--primary-600));
        border-radius: 50% !important;
        color: var(--primary-color-text);
    }
</style>